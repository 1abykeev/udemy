"use client";

import { useState, useTransition } from "react";
import { submitReview } from "@/app/actions/courses";

type Props = { courseId: string; courseSlug: string };

export default function ReviewForm({ courseId, courseSlug }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    startTransition(async () => {
      await submitReview(courseId, courseSlug, rating, comment);
      setSubmitted(true);
    });
  }

  if (submitted) {
    return <p className="text-sm text-green-600 font-medium">Спасибо за отзыв!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-gray-700 mb-2">Оставить отзыв</p>
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
            <span className={(hover || rating) >= s ? "text-[#e59819]" : "text-gray-300"}>★</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ваш комментарий (необязательно)"
        rows={2}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-[#a435f0] mb-2"
      />
      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="text-sm px-4 py-2 bg-[#a435f0] hover:bg-[#8710d8] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
      >
        {isPending ? "Отправляем..." : "Отправить"}
      </button>
    </form>
  );
}
