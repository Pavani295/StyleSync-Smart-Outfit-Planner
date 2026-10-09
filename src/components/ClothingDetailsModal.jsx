import React, { useEffect } from 'react';
import { X, Sparkles, Edit3, Trash2, Wand2 } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

export const ClothingDetailsModal = ({
  item,
  onClose,
  onEdit,
  onDelete,
  onPlanWithItem
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="details-modal-grid">
          {/* Left: Media Showcase */}
          <div className="details-media-col">
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.name}
              category={item.category}
              className="details-large-image"
            />
          </div>

          {/* Right: Details & Specs */}
          <div className="details-info-col">
            <div className="details-badges-row">
              <span className="badge badge-primary">{item.category}</span>
              <span className="badge badge-outline">{item.subcategory}</span>
              {item.isCustom && <span className="badge badge-custom"><Sparkles size={12} /> Custom</span>}
            </div>

            <h2 className="details-title">{item.name}</h2>

            <div className="details-price-row">
              <span className="details-price-label">Estimated Value:</span>
              <span className="details-price-value">₹{Number(item.price || 0).toLocaleString()}</span>
            </div>

            <p className="details-description">{item.description}</p>

            <div className="details-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Colour</span>
                <span className="spec-value">{item.colour}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Occasion</span>
                <span className="spec-value">{item.occasion}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Style Vibe</span>
                <span className="spec-value">{item.style}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Season</span>
                <span className="spec-value">{item.season || 'All-Season'}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="details-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onPlanWithItem(item);
                }}
              >
                <Wand2 size={18} />
                <span>Plan Outfits With This</span>
              </button>

              <div className="details-secondary-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    onEdit(item);
                  }}
                >
                  <Edit3 size={16} />
                  <span>Edit Item</span>
                </button>
                <button
                  className="btn-danger-outline"
                  onClick={() => {
                    onClose();
                    onDelete(item);
                  }}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingDetailsModal;
