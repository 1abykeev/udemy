interface CourseCardProps {
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  level: string;
  gradient: string;
  badge?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#e59819]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CourseCard({ title, instructor, rating, reviewCount, price, originalPrice, level, gradient, badge }: CourseCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden mb-3 ${gradient} flex items-center justify-center`}>
        <svg className="w-12 h-12 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {badge && (
          <span className="absolute top-2 left-2 bg-[#eceb98] text-[#3d3c0a] text-xs font-bold px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-[#a435f0] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mb-1">{instructor}</p>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-bold text-[#b4690e]">{rating.toFixed(1)}</span>
          <StarRating rating={rating} />
          <span className="text-xs text-gray-500">({reviewCount.toLocaleString("ru-RU")})</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">{level}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">{price.toLocaleString("ru-RU")} ₽</span>
          <span className="text-sm text-gray-400 line-through">{originalPrice.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>
    </div>
  );
}
