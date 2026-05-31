"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/app/actions/courses";

type ReviewUser = { name: string };
type Review = {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  user: ReviewUser;
};

type Props = {
  courseId: string;
  courseSlug: string;
  initialReviews: Review[];
  isEnrolled: boolean;
  currentUserId?: string;
  currentUserName?: string;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-[#e59819]" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function ReviewSection({
  courseId,
  courseSlug,
  initialReviews,
  isEnrolled,
  currentUserId,
  currentUserName,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasUserReview = currentUserId
    ? reviews.some((r) => r.userId === currentUserId)
    : false;
  const showForm = isEnrolled && !!currentUserId && !hasUserReview;

  const avgRating =
    reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    startTransition(async () => {
      const result = await submitReview(courseId, courseSlug, rating, comment);
      const newReview: Review = {
        id: result.id,
        userId: result.userId,
        rating: result.rating,
        comment: result.comment,
        user: { name: currentUserName ?? "Вы" },
      };
      setReviews((prev) => [
        newReview,
        ...prev.filter((r) => r.userId !== currentUserId),
      ]);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Отзывы ({reviews.length})
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl font-bold text-gray-900">
            {avgRating.toFixed(1)}
          </span>
          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= Math.round(avgRating)} />
              ))}
            </div>
            <p className="text-sm text-gray-500">Средний рейтинг курса</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Оставить отзыв
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  <span
                    className={
                      (hover || rating) >= s ? "text-[#e59819]" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ваш комментарий (необязательно)"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#a435f0] mb-2 bg-white"
            />
            <button
              type="submit"
              disabled={rating === 0 || isPending}
              className="text-sm px-4 py-2 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {isPending ? "Отправляем..." : "Опубликовать отзыв"}
            </button>
          </form>
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="text-sm text-gray-500">Отзывов пока нет.</p>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#a435f0] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.user.name}
                    {review.userId === currentUserId && (
                      <span className="ml-2 text-xs text-[#a435f0] font-normal">
                        (ваш отзыв)
                      </span>
                    )}
                  </p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-3 h-3 ${s <= review.rating ? "text-[#e59819]" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
