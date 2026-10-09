import React, { useState, useEffect, useCallback } from 'react';
import { Wand2, Sparkles, CheckCircle2, Heart, RotateCcw, AlertCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import ImageWithFallback from '../components/ImageWithFallback';
import { generateOutfitRecommendations } from '../utils/outfitEngine';

const OCCASIONS = [
  'College', 'Casual', 'Office', 'Interview', 'Party', 'Wedding',
  'Festival', 'Traditional Event', 'Sports', 'Travel', 'Date Night'
];

const COLOURS = [
  'Any', 'White', 'Black', 'Navy Blue', 'Beige', 'Cream', 'Charcoal Grey',
  'Emerald Green', 'Crimson Red', 'Maroon', 'Pastel Pink', 'Mustard Yellow',
  'Olive Green', 'Rust Brown', 'Gold'
];

const SEASONS = ['All-Season', 'Summer', 'Winter / Chilly', 'Monsoon', 'Spring'];

const STYLES = ['Any', 'Casual', 'Formal', 'Chic', 'Ethnic', 'Sporty', 'Glamorous', 'Minimalist'];

const CATEGORIES = [
  'Any',
  'Traditional Indian Wear',
  'Western Wear',
  'Tops',
  'Bottoms',
  'Activewear and Sleepwear'
];

export const OutfitPlanner = ({
  allClothes = [],
  onSaveFavourite,
  prefilledCriteria
}) => {
  const [occasion, setOccasion] = useState(prefilledCriteria?.occasion || 'Casual');
  const [preferredColour, setPreferredColour] = useState(prefilledCriteria?.colour || 'Any');
  const [season, setSeason] = useState(prefilledCriteria?.season || 'All-Season');
  const [style, setStyle] = useState(prefilledCriteria?.style || 'Any');
  const [categoryFocus, setCategoryFocus] = useState('Any');
  
  const [recommendations, setRecommendations] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Micro-delay for smooth styling animation
    const timer = setTimeout(() => {
      const result = generateOutfitRecommendations(allClothes, {
        occasion,
        preferredColour,
        season,
        style,
        categoryFocus
      });
      setRecommendations(result);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [allClothes, occasion, preferredColour, season, style, categoryFocus]);

  // Initial recommendation generation on mount
  useEffect(() => {
    const cleanup = handleGenerate();
    return () => {
      if (cleanup) cleanup();
    };
  }, [handleGenerate]);

  const handleSaveWithCelebration = (outfit) => {
    const res = onSaveFavourite(outfit);
    if (res && res.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <div className="planner-page-container">
      {/* Page Header */}
      <div className="planner-header">
        <div className="planner-badge">
          <Sparkles size={14} />
          <span>Rule-Based Outfit Recommendation Engine</span>
        </div>
        <h1 className="page-title">Smart Outfit Planner</h1>
        <p className="page-subtitle">
          Configure your occasion, style vibe, and weather preferences. Our rule-based logic pairs 
          complementary colors, matching silhouettes, and appropriate accessories from your wardrobe.
        </p>
        <div className="rule-engine-notice">
          <ShieldCheck size={16} />
          <span>
            <strong>Deterministic Styling:</strong> This system uses curated color theory rules, category exclusion logic, and occasion dress codes—not opaque AI models.
          </span>
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="planner-control-card">
        <div className="planner-options-grid">
          {/* 1. Occasion */}
          <div className="planner-field-group">
            <label className="planner-field-label">
              <span>1. Occasion</span>
              <span className="required-star">*</span>
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="planner-select"
            >
              {OCCASIONS.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* 2. Preferred Colour */}
          <div className="planner-field-group">
            <label className="planner-field-label">
              <span>2. Preferred Colour</span>
            </label>
            <select
              value={preferredColour}
              onChange={(e) => setPreferredColour(e.target.value)}
              className="planner-select"
            >
              {COLOURS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 3. Weather / Season */}
          <div className="planner-field-group">
            <label className="planner-field-label">
              <span>3. Weather & Season</span>
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="planner-select"
            >
              {SEASONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 4. Style Vibe */}
          <div className="planner-field-group">
            <label className="planner-field-label">
              <span>4. Style Aesthetic</span>
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="planner-select"
            >
              {STYLES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 5. Garment Focus */}
          <div className="planner-field-group">
            <label className="planner-field-label">
              <span>5. Category Focus (Optional)</span>
            </label>
            <select
              value={categoryFocus}
              onChange={(e) => setCategoryFocus(e.target.value)}
              className="planner-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="planner-submit-bar">
          <div className="active-preferences-summary">
            Targeting: <span className="pref-tag">{occasion}</span>
            {preferredColour !== 'Any' && <span className="pref-tag">{preferredColour}</span>}
            {season !== 'All-Season' && <span className="pref-tag">{season}</span>}
            {style !== 'Any' && <span className="pref-tag">{style}</span>}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary btn-generate"
          >
            <Wand2 size={18} className={isGenerating ? 'spin-icon' : ''} />
            <span>{isGenerating ? 'Analyzing Wardrobe Harmony...' : 'Generate Outfits'}</span>
          </button>
        </div>
      </div>

      {/* Outfits Showcase Section */}
      <div className="recommendations-container">
        {isGenerating ? (
          <div className="generating-shimmer-state">
            <Wand2 size={40} className="pulse-icon text-gold" />
            <h3>Evaluating Garment Silhouettes & Color Harmonies...</h3>
            <p>Cross-checking dress code appropriateness and color balance.</p>
          </div>
        ) : recommendations && recommendations.outfits.length > 0 ? (
          <div className="outfits-list">
            <div className="recommendations-heading-row">
              <h2>
                Curated Suggestions for <span className="serif-highlight">{occasion}</span>
              </h2>
              <span className="outfits-count-badge">
                {recommendations.outfits.length} Look{recommendations.outfits.length > 1 ? 's' : ''} Recommended
              </span>
            </div>

            {recommendations.outfits.map((outfit, index) => (
              <div key={outfit.id || index} className="outfit-recommendation-card">
                {/* Outfit Header */}
                <div className="outfit-header-bar">
                  <div className="outfit-title-group">
                    <span className="look-number">Look #{index + 1}</span>
                    <h3 className="outfit-title">{outfit.title}</h3>
                    <div className="outfit-type-tags">
                      <span className="badge badge-primary">{outfit.type}</span>
                      <span className="badge badge-outline">{outfit.occasion}</span>
                      {outfit.season && <span className="badge badge-season">{outfit.season}</span>}
                    </div>
                  </div>

                  <div className="outfit-header-actions">
                    <div className="outfit-price-tag">
                      <span className="price-tag-label">Est. Total</span>
                      <span className="price-tag-value">₹{Number(outfit.totalPrice || 0).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleSaveWithCelebration(outfit)}
                      className="btn-save-outfit"
                    >
                      <Heart size={16} />
                      <span>Save to Favourites</span>
                    </button>
                  </div>
                </div>

                {/* Outfit Items Grid */}
                <div className="outfit-items-display-grid">
                  {outfit.items.map((item, itemIdx) => (
                    <div key={item.id || itemIdx} className="outfit-garment-card">
                      <div className="garment-media-wrap">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.name}
                          category={item.category}
                          className="garment-media"
                        />
                        <span className="garment-role-badge">{item.subcategory}</span>
                      </div>

                      <div className="garment-info">
                        <span className="garment-category">{item.category}</span>
                        <h4 className="garment-name">{item.name}</h4>
                        <div className="garment-meta-row">
                          <span className="garment-colour">{item.colour}</span>
                          <span className="garment-price">₹{Number(item.price || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Why This Match Works (Rule-Based Justification) */}
                <div className="outfit-reasoning-box">
                  <div className="reasoning-title-row">
                    <Sparkles size={16} className="text-gold" />
                    <strong>Why This Combination Works:</strong>
                  </div>
                  <ul className="reasoning-list">
                    {outfit.reasons.map((reason, rIdx) => (
                      <li key={rIdx}>
                        <CheckCircle2 size={15} className="reason-bullet" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : hasGenerated ? (
          <div className="no-outfit-match-card">
            <AlertCircle size={44} className="no-match-icon" />
            <h3>No Suitable Combination Found</h3>
            <p>
              We couldn't form a fully compatible outfit matching all of your specific filters 
              ({occasion}, {preferredColour !== 'Any' ? `${preferredColour} colour` : ''}, {style !== 'Any' ? `${style} style` : ''}) with the clothes currently in your wardrobe.
            </p>
            <div className="no-match-hints">
              <strong>Helpful Styling Tips:</strong>
              <ul>
                <li>Try setting Preferred Colour to <em>"Any"</em> for broader palette matching.</li>
                <li>Ensure you have both suitable bottoms and footwear for {occasion}.</li>
                <li>Add custom clothing items to your wardrobe in the "My Wardrobe" section.</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setPreferredColour('Any');
                setStyle('Any');
                setCategoryFocus('Any');
                handleGenerate();
              }}
              className="btn-primary"
            >
              <RotateCcw size={16} />
              <span>Reset to Open Filters</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OutfitPlanner;
