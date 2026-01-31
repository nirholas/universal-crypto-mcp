'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { SERVICE_CATEGORIES } from '@/lib/marketplace/types';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  // Step 2: Pricing
  pricingType: 'pay-per-use' | 'subscription' | 'freemium';
  payPerUsePrice: string;
  subscriptionPlans: {
    name: string;
    price: string;
    requestsIncluded: string;
    features: string[];
  }[];
  // Step 3: API Configuration
  endpoint: string;
  authType: 'api-key' | 'oauth' | 'none';
  rateLimit: string;
  // Step 4: Documentation
  documentationUrl: string;
  openApiSpec: File | null;
  exampleCode: string;
  // Step 5: Review
  termsAccepted: boolean;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  shortDescription: '',
  category: '',
  tags: [],
  pricingType: 'pay-per-use',
  payPerUsePrice: '',
  subscriptionPlans: [
    { name: 'starter', price: '', requestsIncluded: '', features: [] },
    { name: 'professional', price: '', requestsIncluded: '', features: [] },
  ],
  endpoint: '',
  authType: 'api-key',
  rateLimit: '1000',
  documentationUrl: '',
  openApiSpec: null,
  exampleCode: '',
  termsAccepted: false,
};

export default function RegisterServicePage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push('/marketplace/provider/dashboard?registered=true');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.category;
      case 2:
        if (formData.pricingType === 'pay-per-use') {
          return !!formData.payPerUsePrice;
        }
        return true;
      case 3:
        return !!formData.endpoint;
      case 4:
        return true;
      case 5:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Register Your Service</h1>
        <p className="mt-2 text-gray-600">List your AI service on the marketplace</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(['Basic Info', 'Pricing', 'API Config', 'Documentation', 'Review'] as const).map(
            (label, index) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors',
                      step > index + 1
                        ? 'bg-green-500 text-white'
                        : step === index + 1
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className="mt-2 hidden text-xs font-medium text-gray-600 sm:block">
                    {label}
                  </span>
                </div>
                {index < 4 && (
                  <div
                    className={cn(
                      'h-1 flex-1 mx-2 rounded',
                      step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., GPT-4 Turbo API"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => updateFormData('shortDescription', e.target.value)}
                placeholder="Brief one-line description"
                maxLength={100}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.shortDescription.length}/100</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Detailed description of your service..."
                rows={5}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags..."
                  className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Pricing Configuration</h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pricing Model *
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { value: 'pay-per-use', label: 'Pay Per Use', desc: 'Charge per API request' },
                  { value: 'subscription', label: 'Subscription', desc: 'Monthly/yearly plans' },
                  { value: 'freemium', label: 'Freemium', desc: 'Free tier + paid plans' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'cursor-pointer rounded-xl border-2 p-4 transition-colors',
                      formData.pricingType === option.value
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="pricingType"
                      value={option.value}
                      checked={formData.pricingType === option.value}
                      onChange={(e) => updateFormData('pricingType', e.target.value as FormData['pricingType'])}
                      className="sr-only"
                    />
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="mt-1 text-sm text-gray-500">{option.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {formData.pricingType === 'pay-per-use' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price Per Request (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.payPerUsePrice}
                    onChange={(e) => updateFormData('payPerUsePrice', e.target.value)}
                    placeholder="0.001"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-8 transition-colors focus:border-black focus:outline-none"
                  />
                </div>
              </div>
            )}

            {(formData.pricingType === 'subscription' || formData.pricingType === 'freemium') && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Subscription Plans</h3>
                {formData.subscriptionPlans.map((plan, index) => (
                  <div key={plan.name} className="rounded-xl border-2 border-gray-200 p-4">
                    <h4 className="mb-3 font-medium capitalize text-gray-900">{plan.name} Plan</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Monthly Price (USD)</label>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const plans = [...formData.subscriptionPlans];
                            plans[index].price = e.target.value;
                            updateFormData('subscriptionPlans', plans);
                          }}
                          placeholder="29.99"
                          className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Requests Included</label>
                        <input
                          type="number"
                          value={plan.requestsIncluded}
                          onChange={(e) => {
                            const plans = [...formData.subscriptionPlans];
                            plans[index].requestsIncluded = e.target.value;
                            updateFormData('subscriptionPlans', plans);
                          }}
                          placeholder="10000"
                          className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: API Configuration */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                API Endpoint URL *
              </label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => updateFormData('endpoint', e.target.value)}
                placeholder="https://api.example.com/v1"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Authentication Type
              </label>
              <select
                value={formData.authType}
                onChange={(e) => updateFormData('authType', e.target.value as FormData['authType'])}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              >
                <option value="api-key">API Key</option>
                <option value="oauth">OAuth 2.0</option>
                <option value="none">No Authentication</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rate Limit (requests/minute)
              </label>
              <input
                type="number"
                value={formData.rateLimit}
                onChange={(e) => updateFormData('rateLimit', e.target.value)}
                placeholder="1000"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Documentation */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Documentation</h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Documentation URL
              </label>
              <input
                type="url"
                value={formData.documentationUrl}
                onChange={(e) => updateFormData('documentationUrl', e.target.value)}
                placeholder="https://docs.example.com"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                OpenAPI Specification (optional)
              </label>
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                <input
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={(e) => updateFormData('openApiSpec', e.target.files?.[0] || null)}
                  className="hidden"
                  id="openapi-upload"
                />
                <label htmlFor="openapi-upload" className="cursor-pointer">
                  <span className="text-4xl">📄</span>
                  <p className="mt-2 text-sm text-gray-600">
                    Drop your OpenAPI spec here or click to upload
                  </p>
                  <p className="mt-1 text-xs text-gray-400">JSON or YAML format</p>
                </label>
                {formData.openApiSpec && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {formData.openApiSpec.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Example Code
              </label>
              <textarea
                value={formData.exampleCode}
                onChange={(e) => updateFormData('exampleCode', e.target.value)}
                placeholder="// Example API usage code..."
                rows={8}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-mono text-sm transition-colors focus:border-black focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>

            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 font-medium text-gray-900">Service Summary</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-medium text-gray-900">{formData.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Pricing</dt>
                  <dd className="font-medium text-gray-900">
                    {formData.pricingType === 'pay-per-use'
                      ? `$${formData.payPerUsePrice}/request`
                      : formData.pricingType}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Endpoint</dt>
                  <dd className="font-mono text-sm text-gray-900">{formData.endpoint}</dd>
                </div>
              </dl>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="text-black underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-black underline">
                  Provider Agreement
                </a>
                . I confirm that my service complies with all platform policies.
              </span>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            disabled={step === 1}
            className={cn(
              'rounded-xl px-6 py-3 font-medium transition-colors',
              step === 1
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canProceed()}
              className={cn(
                'rounded-xl px-6 py-3 font-medium transition-colors',
                canProceed()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              )}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className={cn(
                'rounded-xl px-6 py-3 font-medium transition-colors',
                canProceed() && !isSubmitting
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
