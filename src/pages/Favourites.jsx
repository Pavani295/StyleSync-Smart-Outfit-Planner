import React, { useState } from 'react';
import { Heart, Trash2, Wand2, Eye, CheckCircle2, X } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const formatDate = (dateString) => {
  if (!dateString) return 'Recently';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
};

export const Favourites = ({
  favourites = [],
  onRemoveFavourite,
  onClearAllFavourites,
  setActivePage
}) => {
  const [selectedOutfitModal, setSelectedOutfitModal] = useState(null);

  return (
    <div className="favourites-page-container">
      {/* Page Header */}
      <div className="favourites-header">
        <div>
          <span className="section-eyebrow">Curated Collections</span>
          <h1 className="page-title">My Saved Favourites</h1>
          <p className="page-subtitle">
            All your bookmarked outfit combinations safely preserved across browser sessions.
          </p>
        </div>

        {favourites.length > 0 && (
          <div className="favourites-header-actions">
            <button
              onClick={onClearAllFavourites}
              className="btn-danger-outline"
            >
              <Trash2 size={16} />
              <span>Clear All Favourites</span>
            </button>
          </div>
        )}
      </div>

      {/* Outfits List or Empty State */}
      {favourites.length > 0 ? (
        <div className="favourites-grid">
          {favourites.map((fav) => (
            <div key={fav.id} className="favourite-card">
              <div className="favourite-card-header">
                <div>
                  <span className="fav-date">
                    Saved on {formatDate(fav.savedAt)}
                  </span>
                  <h3 className="fav-title">{fav.title}</h3>
                </div>

                <div className="fav-badges">
                  <span className="badge badge-primary">{fav.occasion}</span>
                  <span className="badge badge-outline">{fav.type}</span>
                </div>
              </div>

              {/* Items collage */}
              <div className="fav-items-row">
                {fav.items.map((item, idx) => (
                  <div key={item.id || idx} className="fav-item-thumb" title={item.name}>
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      category={item.category}
                      className="fav-thumb-img"
                    />
                    <span className="fav-thumb-label">{item.subcategory}</span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="favourite-card-footer">
                <div className="fav-total-box">
                  <span className="fav-total-label">Look Value</span>
                  <span className="fav-total-val">₹{Number(fav.totalPrice || 0).toLocaleString()}</span>
                </div>

                <div className="fav-actions-group">
                  <button
                    onClick={() => setSelectedOutfitModal(fav)}
                    className="btn-card-action btn-view"
                  >
                    <Eye size={15} />
                    <span>View Look</span>
                  </button>

                  <button
                    onClick={() => onRemoveFavourite(fav.id)}
                    className="btn-card-action btn-delete"
                    title="Remove from favourites"
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favourites-state">
          <div className="empty-heart-circle">
            <Heart size={44} />
          </div>
          <h3>No Favourites Saved Yet</h3>
          <p>
            You haven't bookmarked any outfit recommendations. Generate fresh combinations 
            using the Outfit Planner and click "Save to Favourites" to build your lookbook.
          </p>
          <button
            onClick={() => { setActivePage('planner'); window.scrollTo(0,0); }}
            className="btn-primary"
          >
            <Wand2 size={18} />
            <span>Go to Outfit Planner</span>
          </button>
        </div>
      )}

      {/* Outfit Details Modal */}
      {selectedOutfitModal && (
        <div className="modal-backdrop" onClick={() => setSelectedOutfitModal(null)}>
          <div className="modal-container outfit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-primary">{selectedOutfitModal.occasion}</span>
                <h2 className="modal-title">{selectedOutfitModal.title}</h2>
                <p className="modal-subtitle">
                  {selectedOutfitModal.type} &bull; Total Value: ₹{Number(selectedOutfitModal.totalPrice || 0).toLocaleString()}
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedOutfitModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Pieces showcase */}
            <div className="outfit-modal-pieces">
              {selectedOutfitModal.items.map((item, idx) => (
                <div key={item.id || idx} className="outfit-modal-piece-card">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.name}
                    category={item.category}
                    className="modal-piece-img"
                  />
                  <div className="modal-piece-info">
                    <span className="modal-piece-sub">{item.subcategory}</span>
                    <h4 className="modal-piece-name">{item.name}</h4>
                    <span className="modal-piece-meta">{item.colour} &bull; ₹{Number(item.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reasoning */}
            {selectedOutfitModal.reasons && (
              <div className="modal-reasoning-box">
                <strong>Why this outfit was matched:</strong>
                <ul>
                  {selectedOutfitModal.reasons.map((r, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} className="reason-bullet" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-footer">
              <button
                className="btn-danger-outline"
                onClick={() => {
                  onRemoveFavourite(selectedOutfitModal.id);
                  setSelectedOutfitModal(null);
                }}
              >
                <Trash2 size={16} />
                <span>Remove from Favourites</span>
              </button>
              <button
                className="btn-primary"
                onClick={() => setSelectedOutfitModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
