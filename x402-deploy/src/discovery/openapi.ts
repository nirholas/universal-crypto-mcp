/**
 * OpenAPI Spec Generator
 *
 * Generates OpenAPI 3.0 specifications for x402-enabled APIs,
 * including payment information extensions.
 */

export interface OpenAPIConfig {
  name: string;
  version?: string;
  description?: string;
  url?: string;
  payment?: {
    wallet?: string;
    network?: string;
    facilitator?: string;
  };
  pricing?: {
    model?: string;
    default?: string;
    routes?: Record<string, string | RoutePrice>;
  };
}

export interface RoutePrice {
  price: string;
  description?: string;
  rateLimit?: {
    requests: number;
    window: string;
  };
}

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    "x-payment"?: {
      method: string;
      wallet?: string;
      network?: string;
      facilitator?: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, Record<string, PathOperation>>;
  components: {
    securitySchemes: Record<string, SecurityScheme>;
    schemas?: Record<string, SchemaObject>;
  };
  security: Array<Record<string, string[]>>;
}

export interface PathOperation {
  summary: string;
  description?: string;
  operationId?: string;
  "x-price"?: string;
  "x-rate-limit"?: {
    requests: number;
    window: string;
  };
  parameters?: Array<ParameterObject>;
  requestBody?: RequestBodyObject;
  responses: Record<string, ResponseObject>;
  tags?: string[];
}

export interface ParameterObject {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  description?: string;
  required?: boolean;
  schema: SchemaObject;
}

export interface RequestBodyObject {
  description?: string;
  required?: boolean;
  content: Record<string, MediaTypeObject>;
}

export interface ResponseObject {
  description: string;
  headers?: Record<string, HeaderObject>;
  content?: Record<string, MediaTypeObject>;
}

export interface HeaderObject {
  schema: SchemaObject;
  description?: string;
}

export interface MediaTypeObject {
  schema: SchemaObject;
}

export interface SchemaObject {
  type?: string;
  format?: string;
  description?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  enum?: string[];
  example?: unknown;
  $ref?: string;
}

export interface SecurityScheme {
  type: string;
  in?: string;
  name?: string;
  description?: string;
  scheme?: string;
}

/**
 * Generate OpenAPI spec from config
 */
export function generateOpenAPISpec(config: OpenAPIConfig): OpenAPISpec {
  return {
    openapi: "3.0.0",
    info: {
      title: config.name,
      version: config.version || "1.0.0",
      description: config.description,
      "x-payment": {
        method: "x402",
        wallet: config.payment?.wallet,
        network: config.payment?.network,
        facilitator: config.payment?.facilitator,
      },
    },
    servers: [
      {
        url: config.url || "https://api.example.com",
        description: "Production server",
      },
    ],
    paths: generatePaths(config.pricing?.routes || {}, config.pricing?.default),
    components: {
      securitySchemes: {
        x402Payment: {
          type: "apiKey",
          in: "header",
          name: "x-payment",
          description: "x402 payment proof from facilitator",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            code: {
              type: "string",
              description: "Error code",
            },
          },
        },
        PaymentRequired: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Payment required message",
            },
            price: {
              type: "string",
              description: "Required payment amount",
            },
            currency: {
              type: "string",
              description: "Payment currency",
            },
            facilitator: {
              type: "string",
              description: "Facilitator URL for payment",
            },
          },
        },
      },
    },
    security: [{ x402Payment: [] }],
  };
}

/**
 * Generate path objects from route pricing config
 */
function generatePaths(
  routes: Record<string, string | RoutePrice>,
  defaultPrice?: string
): Record<string, Record<string, PathOperation>> {
  const paths: Record<string, Record<string, PathOperation>> = {};

  for (const [route, pricing] of Object.entries(routes)) {
    const parts = route.split(" ");
    const method = parts.length > 1 ? parts[0].toLowerCase() : "get";
    const path = parts.length > 1 ? parts[1] : parts[0];
    const priceInfo: RoutePrice =
      typeof pricing === "string" ? { price: pricing } : pricing;

    if (!paths[path]) {
      paths[path] = {};
    }

    const operation: PathOperation = {
      summary: priceInfo.description || `${method.toUpperCase()} ${path}`,
      operationId: generateOperationId(method, path),
      "x-price": priceInfo.price,
      responses: {
        "200": {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
        "402": {
          description: "Payment required",
          headers: {
            "WWW-Authenticate": {
              schema: { type: "string" },
              description: "Payment requirements in x402 format",
            },
            "X-Payment-Required": {
              schema: { type: "string" },
              description: "Base64 encoded payment requirements",
            },
          },
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/PaymentRequired",
              },
            },
          },
        },
        "401": {
          description: "Invalid or expired payment proof",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    };

    if (priceInfo.rateLimit) {
      operation["x-rate-limit"] = priceInfo.rateLimit;
    }

    // Extract path parameters
    const pathParams = path.match(/\{([^}]+)\}/g);
    if (pathParams) {
      operation.parameters = pathParams.map((param) => ({
        name: param.slice(1, -1),
        in: "path",
        required: true,
        schema: { type: "string" },
      }));
    }

    paths[path][method] = operation;
  }

  // If no routes defined but default price exists, add a catch-all
  if (Object.keys(routes).length === 0 && defaultPrice) {
    paths["/{path}"] = {
      get: {
        summary: "API endpoint",
        "x-price": defaultPrice,
        parameters: [
          {
            name: "path",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Successful response" },
          "402": {
            description: "Payment required",
            headers: {
              "WWW-Authenticate": {
                schema: { type: "string" },
                description: "Payment requirements",
              },
            },
          },
        },
      },
    };
  }

  return paths;
}

/**
 * Generate operation ID from method and path
 */
function generateOperationId(method: string, path: string): string {
  const cleanPath = path
    .replace(/^\//, "")
    .replace(/\{([^}]+)\}/g, "By$1")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/_$/, "");

  return `${method}${cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1)}`;
}

/**
 * Generate OpenAPI spec as YAML string
 */
export function generateOpenAPIYaml(config: OpenAPIConfig): string {
  const spec = generateOpenAPISpec(config);

  // Simple YAML serialization (for full YAML support, use js-yaml)
  return toYaml(spec);
}

/**
 * Simple object to YAML converter
 */
function toYaml(obj: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null || obj === undefined) {
    return "null";
  }

  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#")) {
      return `|\n${obj
        .split("\n")
        .map((line) => spaces + "  " + line)
        .join("\n")}`;
    }
    return obj;
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        const value = toYaml(item, indent + 1);
        if (typeof item === "object" && item !== null) {
          return `${spaces}- ${value.trim().replace(/^\s+/, "")}`;
        }
        return `${spaces}- ${value}`;
      })
      .join("\n");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null
    );
    if (entries.length === 0) return "{}";

    return entries
      .map(([key, value]) => {
        const yamlValue = toYaml(value, indent + 1);
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        if (Array.isArray(value)) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        return `${spaces}${key}: ${yamlValue}`;
      })
      .join("\n");
  }

  return String(obj);
}

/**
 * Validate an OpenAPI spec
 */
export function validateOpenAPISpec(spec: OpenAPISpec): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!spec.openapi) {
    errors.push("Missing openapi version");
  }

  if (!spec.info?.title) {
    errors.push("Missing info.title");
  }

  if (!spec.info?.version) {
    errors.push("Missing info.version");
  }

  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    errors.push("No paths defined");
  }

  // Validate each path
  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!operation.responses) {
        errors.push(`${method.toUpperCase()} ${path}: Missing responses`);
      }
      if (!operation.responses?.["200"] && !operation.responses?.["201"]) {
        errors.push(
          `${method.toUpperCase()} ${path}: Missing success response (200/201)`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge custom paths into an existing OpenAPI spec
 */
export function mergeOpenAPISpecs(
  base: OpenAPISpec,
  custom: Partial<OpenAPISpec>
): OpenAPISpec {
  return {
    ...base,
    info: {
      ...base.info,
      ...custom.info,
    },
    servers: custom.servers || base.servers,
    paths: {
      ...base.paths,
      ...custom.paths,
    },
    components: {
      securitySchemes: {
        ...base.components?.securitySchemes,
        ...custom.components?.securitySchemes,
      },
      schemas: {
        ...base.components?.schemas,
        ...custom.components?.schemas,
      },
    },
    security: custom.security || base.security,
  };
}
