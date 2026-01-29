/**
 * HSM (Hardware Security Module) Adapter
 * Abstract interface for HSM integration
 */

import type { HSMConfig, HSMAdapter as IHSMAdapter, WalletErrorCode } from '../types.js';
import { WalletManagerError } from '../types.js';

/**
 * Local HSM Adapter (software-based fallback)
 * This is a placeholder for actual HSM integration
 */
export class LocalHSMAdapter implements IHSMAdapter {
  private initialized = false;
  private keys = new Map<string, Uint8Array>();

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async encrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HSM not initialized'
      );
    }

    const key = this.keys.get(keyId);
    if (!key) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Key ${keyId} not found in HSM`
      );
    }

    // Simple XOR encryption (for demonstration only - NOT secure!)
    // In production, this would use actual HSM encryption
    const encrypted = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = (data[i] ?? 0) ^ (key[i % key.length] ?? 0);
    }

    return encrypted;
  }

  async decrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    // XOR encryption is symmetric
    return this.encrypt(data, keyId);
  }

  async generateKey(keyId: string): Promise<void> {
    if (!this.initialized) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HSM not initialized'
      );
    }

    const key = new Uint8Array(32);
    crypto.getRandomValues(key);
    this.keys.set(keyId, key);
  }

  async deleteKey(keyId: string): Promise<void> {
    this.keys.delete(keyId);
  }

  isAvailable(): boolean {
    return this.initialized;
  }
}

/**
 * AWS CloudHSM Adapter
 * Integrates with AWS KMS for secure key management
 * Requires AWS SDK (@aws-sdk/client-kms)
 */
export class AWSCloudHSMAdapter implements IHSMAdapter {
  private readonly config: HSMConfig;
  private initialized = false;
  private kmsClient: any | null = null;
  private keyMap = new Map<string, string>(); // Maps keyId to AWS KMS KeyId

  constructor(config: HSMConfig) {
    this.config = config;
  }

  /** Get the HSM configuration */
  getConfig(): HSMConfig {
    return this.config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamically import AWS SDK (optional dependency)
      const { KMSClient } = await import('@aws-sdk/client-kms').catch(() => {
        throw new WalletManagerError(
          'HSM_UNAVAILABLE' as WalletErrorCode,
          'AWS SDK not installed. Install @aws-sdk/client-kms to use AWS CloudHSM'
        );
      });

      // Initialize KMS client with config
      this.kmsClient = new KMSClient({
        region: this.config.region || 'us-east-1',
        credentials: this.config.credentials ? {
          accessKeyId: this.config.credentials.accessKeyId,
          secretAccessKey: this.config.credentials.secretAccessKey,
          sessionToken: this.config.credentials.sessionToken,
        } : undefined,
      });

      this.initialized = true;
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Failed to initialize AWS CloudHSM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async encrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.kmsClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'AWS CloudHSM not initialized'
      );
    }

    try {
      const { EncryptCommand } = await import('@aws-sdk/client-kms');
      const kmsKeyId = this.keyMap.get(keyId) || keyId;
      
      const command = new EncryptCommand({
        KeyId: kmsKeyId,
        Plaintext: data,
      });

      const response = await this.kmsClient.send(command);
      
      if (!response.CiphertextBlob) {
        throw new Error('No ciphertext returned from KMS');
      }

      return new Uint8Array(response.CiphertextBlob);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `AWS KMS encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async decrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.kmsClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'AWS CloudHSM not initialized'
      );
    }

    try {
      const { DecryptCommand } = await import('@aws-sdk/client-kms');
      const kmsKeyId = this.keyMap.get(keyId) || keyId;
      
      const command = new DecryptCommand({
        KeyId: kmsKeyId,
        CiphertextBlob: data,
      });

      const response = await this.kmsClient.send(command);
      
      if (!response.Plaintext) {
        throw new Error('No plaintext returned from KMS');
      }

      return new Uint8Array(response.Plaintext);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `AWS KMS decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.kmsClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'AWS CloudHSM not initialized'
      );
    }

    try {
      const { CreateKeyCommand, KeySpec } = await import('@aws-sdk/client-kms');
      
      const command = new CreateKeyCommand({
        Description: `Wallet key: ${keyId}`,
        KeySpec: KeySpec.SYMMETRIC_DEFAULT,
        KeyUsage: 'ENCRYPT_DECRYPT',
        Tags: [
          { TagKey: 'Purpose', TagValue: 'WalletEncryption' },
          { TagKey: 'KeyId', TagValue: keyId },
        ],
      });

      const response = await this.kmsClient.send(command);
      
      if (!response.KeyMetadata?.KeyId) {
        throw new Error('No KeyId returned from KMS');
      }

      // Map our keyId to the AWS KMS KeyId
      this.keyMap.set(keyId, response.KeyMetadata.KeyId);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `AWS KMS key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.kmsClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'AWS CloudHSM not initialized'
      );
    }

    try {
      const { ScheduleKeyDeletionCommand } = await import('@aws-sdk/client-kms');
      const kmsKeyId = this.keyMap.get(keyId) || keyId;
      
      const command = new ScheduleKeyDeletionCommand({
        KeyId: kmsKeyId,
        PendingWindowInDays: 7, // Minimum allowed by AWS
      });

      await this.kmsClient.send(command);
      this.keyMap.delete(keyId);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `AWS KMS key deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  isAvailable(): boolean {
    return this.initialized && this.kmsClient !== null;
  }
}

/**
 * Azure Key Vault Adapter
 * Integrates with Azure Key Vault for secure key management
 * Requires Azure SDK (@azure/keyvault-keys, @azure/identity)
 */
export class AzureKeyVaultAdapter implements IHSMAdapter {
  private readonly config: HSMConfig;
  private initialized = false;
  private cryptographyClient: any | null = null;
  private keyClient: any | null = null;
  private keyMap = new Map<string, string>(); // Maps keyId to Azure Key name

  constructor(config: HSMConfig) {
    this.config = config;
  }

  /** Get the HSM configuration */
  getConfig(): HSMConfig {
    return this.config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamically import Azure SDK (optional dependency)
      const [{ KeyClient }, { DefaultAzureCredential }] = await Promise.all([
        import('@azure/keyvault-keys').catch(() => {
          throw new WalletManagerError(
            'HSM_UNAVAILABLE' as WalletErrorCode,
            'Azure SDK not installed. Install @azure/keyvault-keys and @azure/identity'
          );
        }),
        import('@azure/identity').catch(() => {
          throw new WalletManagerError(
            'HSM_UNAVAILABLE' as WalletErrorCode,
            'Azure Identity SDK not installed. Install @azure/identity'
          );
        }),
      ]);

      const vaultUrl = this.config.endpoint || `https://${this.config.vaultName}.vault.azure.net`;
      const credential = new DefaultAzureCredential();
      
      this.keyClient = new KeyClient(vaultUrl, credential);
      this.initialized = true;
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Failed to initialize Azure Key Vault: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async encrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.keyClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'Azure Key Vault not initialized'
      );
    }

    try {
      const { CryptographyClient } = await import('@azure/keyvault-keys');
      const keyName = this.keyMap.get(keyId) || keyId;
      
      // Get the key
      const key = await this.keyClient.getKey(keyName);
      const cryptoClient = new CryptographyClient(key, this.keyClient.vaultUrl.credential);
      
      // Encrypt the data using RSA-OAEP
      const result = await cryptoClient.encrypt({
        algorithm: 'RSA-OAEP',
        plaintext: data,
      });

      return new Uint8Array(result.result);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Azure Key Vault encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async decrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.keyClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'Azure Key Vault not initialized'
      );
    }

    try {
      const { CryptographyClient } = await import('@azure/keyvault-keys');
      const keyName = this.keyMap.get(keyId) || keyId;
      
      // Get the key
      const key = await this.keyClient.getKey(keyName);
      const cryptoClient = new CryptographyClient(key, this.keyClient.vaultUrl.credential);
      
      // Decrypt the data using RSA-OAEP
      const result = await cryptoClient.decrypt({
        algorithm: 'RSA-OAEP',
        ciphertext: data,
      });

      return new Uint8Array(result.result);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Azure Key Vault decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.keyClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'Azure Key Vault not initialized'
      );
    }

    try {
      // Create an RSA key in Azure Key Vault
      const result = await this.keyClient.createRsaKey(keyId, {
        keySize: 2048,
        keyOps: ['encrypt', 'decrypt'],
        tags: {
          purpose: 'WalletEncryption',
          managedBy: 'universal-crypto-mcp',
        },
      });

      // Map our keyId to the Azure key name
      this.keyMap.set(keyId, result.name);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Azure Key Vault key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.keyClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'Azure Key Vault not initialized'
      );
    }

    try {
      const keyName = this.keyMap.get(keyId) || keyId;
      
      // Begin delete operation
      const poller = await this.keyClient.beginDeleteKey(keyName);
      await poller.pollUntilDone();
      
      // Purge the deleted key (optional - requires permission)
      try {
        await this.keyClient.purgeDeletedKey(keyName);
      } catch {
        // Purge might not be allowed, that's okay
      }
      
      this.keyMap.delete(keyId);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Azure Key Vault key deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  isAvailable(): boolean {
    return this.initialized && this.keyClient !== null;
  }
}

/**
 * HashiCorp Vault Adapter
 * Integrates with HashiCorp Vault for secure key management
 * Uses the Transit Secrets Engine for encryption as a service
 */
export class HashiCorpVaultAdapter implements IHSMAdapter {
  private readonly config: HSMConfig;
  private initialized = false;
  private vaultClient: any | null = null;
  private mountPath: string = 'transit';

  constructor(config: HSMConfig) {
    this.config = config;
    this.mountPath = config.mountPath || 'transit';
  }

  /** Get the HSM configuration */
  getConfig(): HSMConfig {
    return this.config;
  }

  async initialize(): Promise<void> {
    try {
      // Dynamically import node-vault (optional dependency)
      const nodeVault = await import('node-vault').catch(() => {
        throw new WalletManagerError(
          'HSM_UNAVAILABLE' as WalletErrorCode,
          'node-vault not installed. Install node-vault to use HashiCorp Vault'
        );
      });

      // Initialize Vault client
      this.vaultClient = nodeVault.default({
        endpoint: this.config.endpoint || 'http://127.0.0.1:8200',
        token: this.config.token,
      });

      // Test connection by checking if transit engine is enabled
      try {
        await this.vaultClient.mounts();
      } catch (error) {
        throw new Error(`Failed to connect to Vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      this.initialized = true;
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `Failed to initialize HashiCorp Vault: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async encrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.vaultClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HashiCorp Vault not initialized'
      );
    }

    try {
      // Convert data to base64 for Vault
      const base64Data = Buffer.from(data).toString('base64');
      
      // Encrypt using Transit engine
      const result = await this.vaultClient.write(
        `${this.mountPath}/encrypt/${keyId}`,
        { plaintext: base64Data }
      );

      // Vault returns ciphertext in format: "vault:v1:base64..."
      const ciphertext = result.data.ciphertext;
      
      // Store as UTF-8 bytes (including the "vault:v1:" prefix for integrity)
      return new TextEncoder().encode(ciphertext);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `HashiCorp Vault encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async decrypt(data: Uint8Array, keyId: string): Promise<Uint8Array> {
    if (!this.initialized || !this.vaultClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HashiCorp Vault not initialized'
      );
    }

    try {
      // Convert ciphertext from bytes to string
      const ciphertext = new TextDecoder().decode(data);
      
      // Decrypt using Transit engine
      const result = await this.vaultClient.write(
        `${this.mountPath}/decrypt/${keyId}`,
        { ciphertext }
      );

      // Vault returns base64-encoded plaintext
      const base64Plaintext = result.data.plaintext;
      
      // Decode from base64
      return new Uint8Array(Buffer.from(base64Plaintext, 'base64'));
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `HashiCorp Vault decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.vaultClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HashiCorp Vault not initialized'
      );
    }

    try {
      // Create a new encryption key in Transit engine
      await this.vaultClient.write(
        `${this.mountPath}/keys/${keyId}`,
        {
          type: 'aes256-gcm96', // AES-256-GCM encryption
          exportable: false,    // Key cannot be exported (stays in Vault)
          allow_plaintext_backup: false,
        }
      );
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `HashiCorp Vault key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteKey(keyId: string): Promise<void> {
    if (!this.initialized || !this.vaultClient) {
      throw new WalletManagerError(
        'HSM_UNAVAILABLE' as WalletErrorCode,
        'HashiCorp Vault not initialized'
      );
    }

    try {
      // Delete the encryption key from Transit engine
      // First, we need to allow deletion (if not already allowed)
      await this.vaultClient.write(
        `${this.mountPath}/keys/${keyId}/config`,
        { deletion_allowed: true }
      );

      // Then delete the key
      await this.vaultClient.delete(`${this.mountPath}/keys/${keyId}`);
    } catch (error) {
      throw new WalletManagerError(
        'HSM_ERROR' as WalletErrorCode,
        `HashiCorp Vault key deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  isAvailable(): boolean {
    return this.initialized && this.vaultClient !== null;
  }
}

/**
 * Create an HSM adapter based on configuration
 * @param config - HSM configuration
 * @returns The appropriate HSM adapter
 */
export function createHSMAdapter(config: HSMConfig): IHSMAdapter {
  if (!config.enabled) {
    return new LocalHSMAdapter();
  }

  switch (config.provider) {
    case 'aws-cloudhsm':
      return new AWSCloudHSMAdapter(config);
    case 'azure-keyvault':
      return new AzureKeyVaultAdapter(config);
    case 'hashicorp-vault':
      return new HashiCorpVaultAdapter(config);
    case 'local':
    default:
      return new LocalHSMAdapter();
  }
}
