'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { ServiceReview } from '@/lib/marketplace/types';

interface ReviewSystemProps {
  serviceId: string;
  reviews: ServiceReview[];
  onSubmitReview: (review: Partial<ServiceReview>) => Promise<void>;
  canReview?: boolean;
}

export function ReviewSystem({ serviceId, reviews, onSubmitReview, canReview = true }: ReviewSystemProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [pros, setPros] = React.useState('');
  const [cons, setCons] = React.useState('');
  const [useCase, setUseCase] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'newest' | 'helpful' | 'rating'>('newest');

  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => Math.floor(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitReview({
        serviceId,
        rating,
        title,
        pros,
        cons,
        useCase,
        comment,
      });
      setShowForm(false);
      setRating(5);
      setTitle('');
      setPros('');
      setCons('');
      setUseCase('');
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rating Overview */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-gray-600">{star}</span>
                  <span className="text-yellow-400">★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review CTA */}
        <div className="flex flex-col justify-center rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Share your experience</h3>
          <p className="mt-1 text-sm text-gray-600">
            Help others make informed decisions by sharing your honest feedback
          </p>
          {canReview ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Write a Review
            </button>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Subscribe to this service to leave a review
            </p>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={cn(
                        'text-4xl transition-transform hover:scale-110',
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Review Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Pros</label>
                  <textarea
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    placeholder="What did you like?"
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Cons</label>
                  <textarea
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    placeholder="What could be improved?"
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Use Case */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Use Case</label>
                <input
                  type="text"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="e.g., Trading bot, Data analysis"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                />
              </div>

              {/* Detailed Review */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Detailed Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed experience..."
                  rows={5}
                  required
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium text-gray-700 hover:border-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">All Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
          >
            <option value="newest">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {sortedReviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-4xl">💬</p>
            <h3 className="mt-4 font-semibold text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-gray-600">Be the first to review this service!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ServiceReview }) {
  const [helpful, setHelpful] = React.useState(false);

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-medium">
            {review.reviewerName?.[0] || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{review.reviewerName || 'Anonymous'}</p>
              {review.verifiedPurchase && (
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h4 className="mt-4 font-semibold text-gray-900">{review.title}</h4>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {review.pros && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm font-medium text-green-700">👍 Pros</p>
              <p className="mt-1 text-sm text-green-600">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">👎 Cons</p>
              <p className="mt-1 text-sm text-red-600">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Comment */}
      <p className="mt-3 text-gray-600">{review.comment}</p>

      {/* Use Case */}
      {review.useCase && (
        <p className="mt-3 text-sm text-gray-500">
          <span className="font-medium">Use case:</span> {review.useCase}
        </p>
      )}

      {/* Provider Response */}
      {review.providerResponse && (
        <div className="mt-4 rounded-lg border-l-4 border-gray-300 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Provider Response</p>
          <p className="mt-1 text-sm text-gray-600">{review.providerResponse.comment}</p>
          <p className="mt-2 text-xs text-gray-400">
            {new Date(review.providerResponse.respondedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setHelpful(!helpful)}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors',
            helpful ? 'text-blue-600' : 'text-gray-500 hover:text-black'
          )}
        >
          <span>👍</span>
          <span>Helpful ({review.helpful + (helpful ? 1 : 0)})</span>
        </button>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-black"
        >
          🚩 Report
        </button>
      </div>
    </div>
  );
}
