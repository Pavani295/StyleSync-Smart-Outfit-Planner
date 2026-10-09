import React, { useMemo } from 'react';
import { X, RefreshCw, Sparkles, Check, AlertCircle } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { getCompatibleReplacements } from '../utils/outfitEngine';

export const SwapPieceModal = ({
  isOpen,
  onClose,
  outfit,
  slotIndex,
  allClothes = [],
  criteria = {},
  onSelectReplacement
}) => {
  if (!isOpen || !outfit || slotIndex === null || slotIndex === undefined) return null;

  const currentItem = outfit.items[slotIndex];

  // Calculate compatible replacements with their simulated scores
  const replacements = useMemo(() => {
    return getCompatibleReplacements(outfit, slotIndex, allClothes, criteria);
  }, [outfit, slotIndex, allClothes, criteria]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container swap-piece-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-eyebrow">Interactive Garment Swap</span>
            <h2 className="modal-title">
              Replace {currentItem?.subcategory || currentItem?.category}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="swap-modal-current-bar">
          <span className="swap-label">Currently selected:</span>
          <div className="swap-current-pill">
            <span className="current-dot"></span>
            <strong>{currentItem?.name}</strong> ({currentItem?.colour}, {currentItem?.category})
          </div>
        </div>

        <div className="swap-modal-body">
          {replacements.length === 0 ? (
            <div className="empty-replacements-state">
              <AlertCircle size={36} className="text-muted" />
              <h3>No Alternative {currentItem?.category} Found</h3>
              <p>
                There are no other {currentItem?.category.toLowerCase()} in your wardrobe
                matching the {outfit.gender || 'selected'} collection and occasion criteria.
              </p>
              <p className="sub-hint">
                You can add more items to this category on the <em>My Wardrobe</em> page.
              </p>
            </div>
          ) : (
            <>
              <p className="swap-instructions">
                Select an alternative piece below. The overall outfit compatibility score, 
                reasons, and estimated price will automatically update.
              </p>
              <div className="swap-candidates-grid">
                {replacements.map(({ item, score }) => (
                  <div
                    key={item.id}
                    className="swap-candidate-card"
                    onClick={() => {
                      onSelectReplacement(item);
                      onClose();
                    }}
                  >
                    <div className="swap-candidate-media">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        category={item.category}
                        className="swap-image"
                      />
                      <span className="swap-score-pill">
                        <Sparkles size={11} /> {score}% Match
                      </span>
                    </div>

                    <div className="swap-candidate-details">
                      <span className="candidate-subcat">{item.subcategory || item.category}</span>
                      <h4 className="candidate-name">{item.name}</h4>
                      <div className="candidate-meta-row">
                        <span className="candidate-colour">{item.colour}</span>
                        <span className="candidate-price">₹{Number(item.price || 0).toLocaleString()}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-select-candidate"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReplacement(item);
                          onClose();
                        }}
                      >
                        <Check size={14} />
                        <span>Swap Into Look</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapPieceModal;
