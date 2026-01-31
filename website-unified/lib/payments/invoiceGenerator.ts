/**
 * Invoice Generator
 * 
 * Generates PDF invoices with line items, tax calculation, and delivery
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { v4 as uuidv4 } from 'uuid';
import { getSubscriptionManager } from './subscriptionManager';
import { getUsageMetering } from './usageMetering';
import type { 
  Invoice, 
  InvoiceLineItem, 
  InvoiceStatus, 
  BillingDetails,
  Subscription 
} from './types';

// ============================================
// Types
// ============================================

interface InvoiceGeneratorConfig {
  companyDetails: CompanyDetails;
  taxRates: Record<string, number>; // Country code to tax rate
  defaultTaxRate: number;
  invoicePrefix: string;
  paymentTermsDays: number;
  currency: string;
}

interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  email: string;
  phone?: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

interface GenerateInvoiceParams {
  subscriptionId: string;
  billingDetails: BillingDetails;
  additionalLineItems?: Omit<InvoiceLineItem, 'id'>[];
  notes?: string;
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: InvoiceGeneratorConfig = {
  companyDetails: {
    name: 'Universal Crypto MCP',
    address: '123 Blockchain Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'US',
    email: 'billing@universal-crypto-mcp.com',
    website: 'https://universal-crypto-mcp.com',
  },
  taxRates: {
    US: 0,
    EU: 20,
    UK: 20,
    CA: 13,
  },
  defaultTaxRate: 0,
  invoicePrefix: 'INV',
  paymentTermsDays: 30,
  currency: 'USD',
};

// ============================================
// In-Memory Store (Replace with Database)
// ============================================

const invoices: Map<string, Invoice> = new Map();
let invoiceCounter = 1000;

// ============================================
// Invoice Generator Class
// ============================================

export class InvoiceGenerator {
  private config: InvoiceGeneratorConfig;
  private subscriptionManager = getSubscriptionManager();
  private usageMetering = getUsageMetering();

  constructor(config: Partial<InvoiceGeneratorConfig> = {}) {
    this.config = { 
      ...DEFAULT_CONFIG, 
      ...config,
      companyDetails: { ...DEFAULT_CONFIG.companyDetails, ...config.companyDetails },
    };
  }

  /**
   * Generate invoice for subscription
   */
  async generateInvoice(params: GenerateInvoiceParams): Promise<Invoice> {
    const subscription = await this.subscriptionManager.getById(params.subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${params.subscriptionId} not found`);
    }

    // Generate invoice number
    invoiceCounter++;
    const invoiceNumber = `${this.config.invoicePrefix}-${invoiceCounter.toString().padStart(6, '0')}`;

    // Create line items
    const lineItems: InvoiceLineItem[] = [];

    // Subscription line item
    lineItems.push({
      id: uuidv4(),
      description: `${subscription.tier.name} Plan - ${this.formatPeriod(subscription.currentPeriodStart, subscription.currentPeriodEnd)}`,
      quantity: 1,
      unitPrice: subscription.tier.price,
      amount: subscription.tier.price,
    });

    // Usage overage line items
    const usageData = await this.usageMetering.getCurrentUsage(params.subscriptionId);
    if (parseFloat(usageData.overageCharges) > 0) {
      for (const [resource, overage] of Object.entries(usageData.overage)) {
        if (overage > 0) {
          const rate = this.getOverageRate(resource);
          const amount = (overage * rate).toFixed(2);
          lineItems.push({
            id: uuidv4(),
            description: `${this.formatResourceName(resource)} Overage (${overage.toLocaleString()} units)`,
            quantity: overage,
            unitPrice: rate.toFixed(4),
            amount,
          });
        }
      }
    }

    // Additional line items
    if (params.additionalLineItems) {
      for (const item of params.additionalLineItems) {
        lineItems.push({
          id: uuidv4(),
          ...item,
        });
      }
    }

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const taxRate = this.getTaxRate(params.billingDetails.address?.country);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const now = Math.floor(Date.now() / 1000);

    const invoice: Invoice = {
      id: uuidv4(),
      number: invoiceNumber,
      subscriptionId: params.subscriptionId,
      userId: subscription.userId,
      status: 'pending',
      lineItems,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      taxRate,
      total: total.toFixed(2),
      amountPaid: '0.00',
      amountDue: total.toFixed(2),
      currency: this.config.currency,
      dueDate: now + (this.config.paymentTermsDays * 86400),
      billingDetails: params.billingDetails,
      createdAt: now,
      updatedAt: now,
    };

    // Store invoice
    invoices.set(invoice.id, invoice);

    return invoice;
  }

  /**
   * Generate PDF invoice
   */
  async generatePdf(invoiceId: string): Promise<Buffer> {
    const invoice = invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    // In production, use a PDF library like pdfkit or puppeteer
    // For now, return a mock PDF buffer
    const pdfContent = this.generatePdfContent(invoice);
    return Buffer.from(pdfContent, 'utf-8');
  }

  /**
   * Generate PDF content (HTML template)
   */
  private generatePdfContent(invoice: Invoice): string {
    const company = this.config.companyDetails;
    const billing = invoice.billingDetails;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company { font-weight: bold; font-size: 24px; }
    .invoice-title { font-size: 32px; color: #2563eb; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address { width: 45%; }
    .address-title { font-weight: bold; margin-bottom: 8px; color: #666; }
    .meta { margin-bottom: 40px; }
    .meta-row { display: flex; margin-bottom: 4px; }
    .meta-label { width: 120px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .amount { text-align: right; }
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .total-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">${company.name}</div>
    <div class="invoice-title">INVOICE</div>
  </div>
  
  <div class="addresses">
    <div class="address">
      <div class="address-title">FROM</div>
      <div>${company.name}</div>
      <div>${company.address}</div>
      <div>${company.city}, ${company.state || ''} ${company.postalCode}</div>
      <div>${company.country}</div>
      <div>${company.email}</div>
    </div>
    <div class="address">
      <div class="address-title">TO</div>
      <div>${billing.name || ''}</div>
      <div>${billing.company || ''}</div>
      ${billing.address ? `
        <div>${billing.address.line1}</div>
        ${billing.address.line2 ? `<div>${billing.address.line2}</div>` : ''}
        <div>${billing.address.city}, ${billing.address.state || ''} ${billing.address.postalCode}</div>
        <div>${billing.address.country}</div>
      ` : ''}
      <div>${billing.email || ''}</div>
    </div>
  </div>
  
  <div class="meta">
    <div class="meta-row">
      <div class="meta-label">Invoice #:</div>
      <div>${invoice.number}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Date:</div>
      <div>${new Date(invoice.createdAt * 1000).toLocaleDateString()}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Due Date:</div>
      <div>${new Date(invoice.dueDate * 1000).toLocaleDateString()}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Status:</div>
      <div>${invoice.status.toUpperCase()}</div>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th class="amount">Unit Price</th>
        <th class="amount">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.lineItems.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td class="amount">$${item.unitPrice}</td>
          <td class="amount">$${item.amount}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="totals">
    <div class="total-row">
      <div>Subtotal</div>
      <div>$${invoice.subtotal}</div>
    </div>
    <div class="total-row">
      <div>Tax (${invoice.taxRate}%)</div>
      <div>$${invoice.tax}</div>
    </div>
    <div class="total-row final">
      <div>Total</div>
      <div>$${invoice.total} ${invoice.currency}</div>
    </div>
    ${parseFloat(invoice.amountPaid) > 0 ? `
      <div class="total-row">
        <div>Paid</div>
        <div>-$${invoice.amountPaid}</div>
      </div>
      <div class="total-row final">
        <div>Amount Due</div>
        <div>$${invoice.amountDue} ${invoice.currency}</div>
      </div>
    ` : ''}
  </div>
  
  <div class="footer">
    <p>Payment is due within ${this.config.paymentTermsDays} days.</p>
    <p>Thank you for your business!</p>
    <p>${company.website}</p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Get invoice by ID
   */
  async getById(invoiceId: string): Promise<Invoice | undefined> {
    return invoices.get(invoiceId);
  }

  /**
   * Get invoice by number
   */
  async getByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    return Array.from(invoices.values()).find((i) => i.number === invoiceNumber);
  }

  /**
   * Get invoices by user
   */
  async getByUser(userId: string): Promise<Invoice[]> {
    return Array.from(invoices.values())
      .filter((i) => i.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get invoices by subscription
   */
  async getBySubscription(subscriptionId: string): Promise<Invoice[]> {
    return Array.from(invoices.values())
      .filter((i) => i.subscriptionId === subscriptionId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Update invoice status
   */
  async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice> {
    const invoice = invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.status = status;
    invoice.updatedAt = Math.floor(Date.now() / 1000);

    if (status === 'paid') {
      invoice.paidAt = invoice.updatedAt;
      invoice.amountPaid = invoice.total;
      invoice.amountDue = '0.00';
    }

    invoices.set(invoiceId, invoice);
    return invoice;
  }

  /**
   * Record payment for invoice
   */
  async recordPayment(
    invoiceId: string,
    amount: string,
    paymentId: string
  ): Promise<Invoice> {
    const invoice = invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    const paidAmount = parseFloat(invoice.amountPaid) + parseFloat(amount);
    const dueAmount = parseFloat(invoice.total) - paidAmount;

    invoice.amountPaid = paidAmount.toFixed(2);
    invoice.amountDue = Math.max(0, dueAmount).toFixed(2);
    invoice.paymentId = paymentId;
    invoice.updatedAt = Math.floor(Date.now() / 1000);

    if (dueAmount <= 0) {
      invoice.status = 'paid';
      invoice.paidAt = invoice.updatedAt;
    }

    invoices.set(invoiceId, invoice);
    return invoice;
  }

  /**
   * Get overdue invoices
   */
  async getOverdue(): Promise<Invoice[]> {
    const now = Math.floor(Date.now() / 1000);
    return Array.from(invoices.values())
      .filter((i) => i.status === 'pending' && i.dueDate < now)
      .sort((a, b) => a.dueDate - b.dueDate);
  }

  /**
   * Mark invoice as overdue
   */
  async markOverdue(invoiceId: string): Promise<Invoice> {
    return this.updateStatus(invoiceId, 'overdue');
  }

  /**
   * Cancel invoice
   */
  async cancel(invoiceId: string): Promise<Invoice> {
    return this.updateStatus(invoiceId, 'cancelled');
  }

  /**
   * Get tax rate for country
   */
  private getTaxRate(country?: string): number {
    if (!country) return this.config.defaultTaxRate;
    return this.config.taxRates[country] ?? this.config.defaultTaxRate;
  }

  /**
   * Get overage rate for resource
   */
  private getOverageRate(resource: string): number {
    const rates: Record<string, number> = {
      apiCalls: 0.0001,
      storage: 0.02,
      bandwidth: 0.01,
    };
    return rates[resource] || 0;
  }

  /**
   * Format period for display
   */
  private formatPeriod(start: number, end: number): string {
    const startDate = new Date(start * 1000);
    const endDate = new Date(end * 1000);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  /**
   * Format resource name for display
   */
  private formatResourceName(resource: string): string {
    const names: Record<string, string> = {
      apiCalls: 'API Calls',
      storage: 'Storage',
      bandwidth: 'Bandwidth',
    };
    return names[resource] || resource;
  }
}

// ============================================
// Singleton Instance
// ============================================

let invoiceGeneratorInstance: InvoiceGenerator | null = null;

export function getInvoiceGenerator(
  config?: Partial<InvoiceGeneratorConfig>
): InvoiceGenerator {
  if (!invoiceGeneratorInstance || config) {
    invoiceGeneratorInstance = new InvoiceGenerator(config);
  }
  return invoiceGeneratorInstance;
}

export default InvoiceGenerator;
