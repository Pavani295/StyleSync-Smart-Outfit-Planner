import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

export const ImageWithFallback = ({ src, alt, className = '', category = '' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className={`image-fallback-container ${className}`}>
        <div className="fallback-inner">
          <Shirt className="fallback-icon" size={28} />
          <span className="fallback-category">{category || 'Fashion Item'}</span>
          <span className="fallback-sub">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-wrapper ${className}`}>
      {isLoading && <div className="image-skeleton-shimmer" />}
      <img
        src={src}
        alt={alt}
        className={`loaded-image ${isLoading ? 'is-loading' : 'is-ready'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback;
