import React from 'react';
import { Eye, Edit3, Trash2, Tag, Calendar, Sparkles } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

// Visual color swatches mapping
const COLOR_HEX_MAP = {
  'White': '#FFFFFF',
  'Black': '#1A1818',
  'Navy Blue': '#1D2A44',
  'Beige': '#D8C3A5',
  'Cream': '#FDFBF7',
  'Charcoal Grey': '#4A4E53',
  'Emerald Green': '#185339',
  'Crimson Red': '#A61C1C',
  'Maroon': '#6B1426',
  'Pastel Pink': '#F4C2C2',
  'Mustard Yellow': '#E5A93C',
  'Olive Green': '#556B2F',
  'Rust Brown': '#9E472A',
  'Gold': '#D4AF37'
};

export const ClothingCard = ({
  item,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const swatchColor = COLOR_HEX_MAP[item.colour] || '#CCCCCC';
  const isLightColor = item.colour === 'White' || item.colour === 'Cream';

  return (
    <div className="clothing-card">
      {/* Top Image Container */}
      <div className="card-media-wrapper">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.name}
          category={item.category}
          className="card-media"
        />

        {/* Category Pill Tag */}
        <div className="card-badge-category">
          <span>{item.category}</span>
        </div>

        {/* Gender Badge */}
        {item.gender && (
          <div className="card-badge-gender" title={`Section: ${item.gender}`}>
            <span>{item.gender}</span>
          </div>
        )}

        {/* Custom Item Badge if user created */}
        {item.isCustom && (
          <div className="card-badge-custom" title="User added custom piece">
            <Sparkles size={12} />
            <span>Custom</span>
          </div>
        )}

        {/* Overlay hover actions */}
        <div className="card-media-overlay">
          <button
            onClick={() => onViewDetails(item)}
            className="overlay-btn view"
            title="View Details"
          >
            <Eye size={18} />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="card-body">
        <div className="card-header-row">
          <span className="card-subcategory">{item.subcategory}</span>
          {item.price && (
            <span className="card-price">₹{Number(item.price).toLocaleString()}</span>
          )}
        </div>

        <h3 className="card-title" onClick={() => onViewDetails(item)}>
          {item.name}
        </h3>

        {/* Attribute Pills */}
        <div className="card-meta-tags">
          {/* Colour Tag */}
          <div className="meta-tag color-tag" title={`Colour: ${item.colour}`}>
            <span
              className="color-swatch-dot"
              style={{
                backgroundColor: swatchColor,
                border: isLightColor ? '1px solid #C5BFB5' : 'none'
              }}
            />
            <span>{item.colour}</span>
          </div>

          {/* Pattern Tag */}
          {item.pattern && (
            <div className="meta-tag pattern-tag" title={`Pattern: ${item.pattern}`}>
              <span>{item.pattern}</span>
            </div>
          )}

          {/* Occasion Tag */}
          <div className="meta-tag occasion-tag" title={`Occasion: ${item.occasion}`}>
            <Tag size={12} />
            <span>{item.occasion}</span>
          </div>

          {/* Season Tag */}
          {item.season && (
            <div className="meta-tag season-tag" title={`Season: ${item.season}`}>
              <Calendar size={12} />
              <span>{item.season}</span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="card-actions-row">
          <button
            onClick={() => onViewDetails(item)}
            className="btn-card-action btn-view"
            aria-label="View Details"
          >
            <Eye size={15} />
            <span>View</span>
          </button>

          <button
            onClick={() => onEdit(item)}
            className="btn-card-action btn-edit"
            aria-label="Edit clothing"
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(item)}
            className="btn-card-action btn-delete"
            aria-label="Delete clothing"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
