import React, { useState, useEffect } from 'react';
import { X, Image, AlertCircle, Check } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const CATEGORIES_DATA = {
  'Tops': ['T-shirts', 'Shirts', 'Blouses', 'Crop Tops', 'Tank Tops', 'Sweaters', 'Hoodies', 'Tunics'],
  'Bottoms': ['Jeans', 'Trousers', 'Formal Pants', 'Leggings', 'Skirts', 'Shorts', 'Palazzos', 'Wide-leg Pants'],
  'Traditional Indian Wear': ['Sarees', 'Kurtis', 'Salwar Suits', 'Churidars', 'Anarkalis', 'Lehengas', 'Ethnic Sets', 'Kurtas', 'Dhotis', 'Sherwanis'],
  'Western Wear': ['Casual Dresses', 'Maxi Dresses', 'Gowns', 'Jumpsuits', 'Rompers', 'Co-ord Sets', 'Blazers', 'Formal Suits'],
  'Outerwear': ['Jackets', 'Coats', 'Cardigans', 'Denim Jackets', 'Sweatshirts'],
  'Footwear': ['Sneakers', 'Sports Shoes', 'Sandals', 'Heels', 'Flats', 'Loafers', 'Boots', 'Traditional Footwear'],
  'Accessories': ['Handbags', 'Backpacks', 'Sling Bags', 'Watches', 'Belts', 'Jewellery', 'Earrings', 'Necklaces', 'Scarves', 'Caps', 'Sunglasses'],
  'Activewear and Sleepwear': ['Sportswear', 'Tracksuits', 'Yoga wear', 'Night suits', 'Pyjamas', 'Robes']
};

const COLOURS = [
  'White', 'Black', 'Navy Blue', 'Beige', 'Cream', 'Charcoal Grey',
  'Emerald Green', 'Crimson Red', 'Maroon', 'Pastel Pink', 'Mustard Yellow',
  'Olive Green', 'Rust Brown', 'Gold'
];

const OCCASIONS = [
  'College', 'Casual', 'Office', 'Interview', 'Party', 'Wedding',
  'Festival', 'Traditional Event', 'Sports', 'Travel', 'Date Night'
];

const STYLES = [
  'Casual', 'Formal', 'Chic', 'Ethnic', 'Sporty', 'Glamorous', 'Minimalist'
];

const SEASONS = ['All-Season', 'Summer', 'Winter', 'Monsoon', 'Spring'];

// Quick preset images for user convenience
const SAMPLE_IMAGE_PRESETS = [
  { label: 'Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80' },
  { label: 'White Shirt', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80' },
  { label: 'Blue Denim', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80' },
  { label: 'Black Dress', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80' },
  { label: 'Trench Coat', url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=700&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80' },
  { label: 'Gold Kundan', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80' },
  { label: 'Activewear', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80' },
];

export const AddEditClothingModal = ({
  itemToEdit,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(itemToEdit);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Tops',
    subcategory: 'Shirts',
    colour: 'White',
    occasion: 'Casual',
    style: 'Casual',
    season: 'All-Season',
    price: '',
    imageUrl: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        category: itemToEdit.category || 'Tops',
        subcategory: itemToEdit.subcategory || 'Shirts',
        colour: itemToEdit.colour || 'White',
        occasion: itemToEdit.occasion || 'Casual',
        style: itemToEdit.style || 'Casual',
        season: itemToEdit.season || 'All-Season',
        price: itemToEdit.price !== undefined ? itemToEdit.price : '',
        imageUrl: itemToEdit.imageUrl || '',
        description: itemToEdit.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Tops',
        subcategory: 'Shirts',
        colour: 'White',
        occasion: 'Casual',
        style: 'Casual',
        season: 'All-Season',
        price: '',
        imageUrl: SAMPLE_IMAGE_PRESETS[1].url,
        description: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [itemToEdit, isOpen]);

  // When category changes, reset subcategory to first valid one
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const subcats = CATEGORIES_DATA[newCategory] || [];
    setFormData(prev => ({
      ...prev,
      category: newCategory,
      subcategory: subcats[0] || ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide an item name.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Item name must be at least 3 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a clothing category.';
    }

    if (!formData.subcategory) {
      newErrors.subcategory = 'Please specify the subcategory.';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Please provide or select an image URL.';
    } else if (!formData.imageUrl.startsWith('http://') && !formData.imageUrl.startsWith('https://')) {
      newErrors.imageUrl = 'Image URL must begin with http:// or https://';
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      category: true,
      subcategory: true,
      imageUrl: true,
      price: true
    });

    if (validate()) {
      const payload = {
        ...(itemToEdit ? { id: itemToEdit.id } : {}),
        name: formData.name.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        colour: formData.colour,
        occasion: formData.occasion,
        style: formData.style,
        season: formData.season,
        price: formData.price ? Number(formData.price) : 0,
        imageUrl: formData.imageUrl.trim(),
        description: formData.description.trim() || `${formData.name} in ${formData.colour}, ideal for ${formData.occasion} occasions.`
      };

      onSave(payload, isEditing);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? 'Edit Clothing Item' : 'Add New Clothing to Wardrobe'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update specifications, image, or pricing for this wardrobe item.'
                : 'Upload or curate your personal fashion piece to include in outfit recommendations.'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Left Form Column */}
            <div className="form-col-main">
              {/* Item Name */}
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input
                  type="text"
                  className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Royal Embroidered Kurti, Slim Dark Jeans"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => setTouched({ ...touched, name: true })}
                />
                {touched.name && errors.name && (
                  <span className="field-error"><AlertCircle size={13} /> {errors.name}</span>
                )}
              </div>

              {/* Category & Subcategory */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={handleCategoryChange}
                  >
                    {Object.keys(CATEGORIES_DATA).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory *</label>
                  <select
                    className="form-select"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  >
                    {(CATEGORIES_DATA[formData.category] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colour & Occasion */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Colour *</label>
                  <select
                    className="form-select"
                    value={formData.colour}
                    onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                  >
                    {COLOURS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Occasion *</label>
                  <select
                    className="form-select"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  >
                    {OCCASIONS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Style, Season, Price */}
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Style Vibe</label>
                  <select
                    className="form-select"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  >
                    {STYLES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Season</label>
                  <select
                    className="form-select"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  >
                    {SEASONS.map(sea => (
                      <option key={sea} value={sea}>{sea}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="form-input"
                    placeholder="e.g. 1999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              {/* Image URL input */}
              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className={`form-input ${touched.imageUrl && errors.imageUrl ? 'input-error' : ''}`}
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  onBlur={() => setTouched({ ...touched, imageUrl: true })}
                />
                {touched.imageUrl && errors.imageUrl && (
                  <span className="field-error"><AlertCircle size={13} /> {errors.imageUrl}</span>
                )}

                {/* Preset Image Shortcuts */}
                <div className="preset-images-section">
                  <span className="preset-label">Quick sample image picker:</span>
                  <div className="preset-buttons">
                    {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`preset-pill ${formData.imageUrl === preset.url ? 'active' : ''}`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Detail fabric material, fit notes, styling hints..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Right Preview Column */}
            <div className="form-col-preview">
              <label className="form-label">Live Image Preview</label>
              <div className="preview-card-box">
                {formData.imageUrl ? (
                  <ImageWithFallback
                    src={formData.imageUrl}
                    alt={formData.name || 'Preview'}
                    category={formData.category}
                    className="form-preview-image"
                  />
                ) : (
                  <div className="empty-preview-placeholder">
                    <Image size={36} />
                    <span>Enter image URL to view preview</span>
                  </div>
                )}
                <div className="preview-caption">
                  <strong>{formData.name || 'Item Name'}</strong>
                  <span>{formData.category} &bull; {formData.colour}</span>
                  {formData.price && <span>₹{Number(formData.price).toLocaleString()}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              <span>{isEditing ? 'Save Changes' : 'Add to Wardrobe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditClothingModal;
