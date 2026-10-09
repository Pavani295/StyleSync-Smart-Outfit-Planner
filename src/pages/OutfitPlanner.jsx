import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Wand2,
  Sparkles,
  CheckCircle2,
  Heart,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ImageWithFallback from '../components/ImageWithFallback';
import SwapPieceModal from '../components/SwapPieceModal';
import {
  generateOutfitRecommendations,
  swapOutfitPiece
} from '../utils/outfitEngine';

const GENDER_OPTIONS = [
  { id: 'Women', label: "Women's Styling", icon: '👩' },
  { id: 'Men', label: "Men's Styling", icon: '👨' },
  { id: 'All', label: 'All / Unisex', icon: '✨' }
];

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
  // Filter & Generation States
  const [gender, setGender] = useState(prefilledCriteria?.gender || 'Women');
  const [occasion, setOccasion] = useState(prefilledCriteria?.occasion || 'Casual');
  const [preferredColour, setPreferredColour] = useState(prefilledCriteria?.colour || 'Any');
  const [season, setSeason] = useState(prefilledCriteria?.season || 'All-Season');
  const [style, setStyle] = useState(prefilledCriteria?.style || 'Any');
  const [categoryFocus, setCategoryFocus] = useState('Any');

  // Recommendation State
  const [displayedOutfits, setDisplayedOutfits] = useState([]);
  const [seenSignatures, setSeenSignatures] = useState([]);
  const [totalPoolCount, setTotalPoolCount] = useState(0);
  const [hasMoreOutfits, setHasMoreOutfits] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [exhaustedNotice, setExhaustedNotice] = useState(null);

  // Garment Swapping Modal State
  const [swapModalState, setSwapModalState] = useState({
    isOpen: false,
    outfitIndex: null,
    slotIndex: null
  });

  const criteria = useMemo(() => ({
    gender,
    occasion,
    preferredColour,
    season,
    style,
    categoryFocus
  }), [gender, occasion, preferredColour, season, style, categoryFocus]);

  /**
   * Primary recommendation generation: resets history for a fresh criteria setup
   */
  const handleGenerateFresh = useCallback(() => {
    setIsGenerating(true);
    setExhaustedNotice(null);

    const timer = setTimeout(() => {
      const result = generateOutfitRecommendations(allClothes, criteria, 0, 3, []);
      setDisplayedOutfits(result.outfits);
      const newSigs = result.outfits.map(o => o.signature);
      setSeenSignatures(newSigs);
      setTotalPoolCount(result.totalInPool);
      setHasMoreOutfits(result.hasMore);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [allClothes, criteria]);

  // Generate on initial mount
  useEffect(() => {
    const cleanup = handleGenerateFresh();
    return () => {
      if (cleanup) cleanup();
    };
  }, [handleGenerateFresh]);

  /**
   * "Show More Outfits": Appends next batch of unseen combinations
   */
  const handleShowMore = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateOutfitRecommendations(allClothes, criteria, 0, 3, seenSignatures);
      
      if (result.outfits.length > 0) {
        setDisplayedOutfits(prev => [...prev, ...result.outfits]);
        const addedSigs = result.outfits.map(o => o.signature);
        setSeenSignatures(prev => [...prev, ...addedSigs]);
        setHasMoreOutfits(result.hasMore);
        setExhaustedNotice(null);
      } else {
        setHasMoreOutfits(false);
        setExhaustedNotice(
          `You have viewed all ${totalPoolCount} compatible outfit combinations for this setup.`
        );
      }
      setIsGenerating(false);
    }, 200);
  };

  /**
   * "Refresh Recommendations": Replaces current view with next unseen combinations
   */
  const handleRefreshRecommendations = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateOutfitRecommendations(allClothes, criteria, 0, 3, seenSignatures);

      if (result.outfits.length > 0) {
        setDisplayedOutfits(result.outfits);
        const addedSigs = result.outfits.map(o => o.signature);
        setSeenSignatures(prev => [...prev, ...addedSigs]);
        setHasMoreOutfits(result.hasMore);
        setExhaustedNotice(null);
      } else {
        // All combinations were already seen: cycle back to start
        const freshResult = generateOutfitRecommendations(allClothes, criteria, 0, 3, []);
        setDisplayedOutfits(freshResult.outfits);
        setSeenSignatures(freshResult.outfits.map(o => o.signature));
        setHasMoreOutfits(freshResult.hasMore);
        setExhaustedNotice('All unique looks viewed! Cycled back to top scoring recommendations.');
      }
      setIsGenerating(false);
    }, 200);
  };

  /**
   * Interactive Garment Swapping Handlers
   */
  const handleOpenSwapModal = (outfitIndex, slotIndex) => {
    setSwapModalState({
      isOpen: true,
      outfitIndex,
      slotIndex
    });
  };

  const handleCloseSwapModal = () => {
    setSwapModalState({
      isOpen: false,
      outfitIndex: null,
      slotIndex: null
    });
  };

  const handleApplyReplacement = (replacementItem) => {
    const { outfitIndex, slotIndex } = swapModalState;
    if (outfitIndex === null || slotIndex === null) return;

    const targetOutfit = displayedOutfits[outfitIndex];
    if (!targetOutfit) return;

    const updatedOutfit = swapOutfitPiece(targetOutfit, slotIndex, replacementItem, criteria);

    setDisplayedOutfits(prev => {
      const copy = [...prev];
      copy[outfitIndex] = updatedOutfit;
      return copy;
    });
  };

  /**
   * Save favourite with confetti
   */
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
        // Fallback
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
          Intelligent wardrobe matching for Men, Women, and Unisex wear. Pairs silhouettes, 
          harmonious colors, pattern balances, and appropriate dress codes with zero repeated looks.
        </p>
        <div className="rule-engine-notice">
          <ShieldCheck size={16} />
          <span>
            <strong>Deterministic Styling:</strong> Uses verified color theory, standalone garment rules (no bottoms forced on sarees or dresses), and occasion dress codes.
          </span>
        </div>
      </div>

      {/* Interactive Controls Card */}
      <div className="planner-control-card">
        {/* Gender Toggle Strip */}
        <div className="planner-gender-section">
          <span className="gender-section-label">Target Wardrobe Section:</span>
          <div className="gender-toggle-buttons">
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`gender-toggle-btn ${gender === g.id ? 'active' : ''}`}
                onClick={() => setGender(g.id)}
              >
                <span className="gender-icon">{g.icon}</span>
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Options Grid */}
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

        {/* Submit & Filter Summary Bar */}
        <div className="planner-submit-bar">
          <div className="active-preferences-summary">
            Section: <span className="pref-tag">{gender === 'Women' ? "Women's" : gender === 'Men' ? "Men's" : 'All / Unisex'}</span>
            Occasion: <span className="pref-tag">{occasion}</span>
            {preferredColour !== 'Any' && <span className="pref-tag">{preferredColour}</span>}
            {season !== 'All-Season' && <span className="pref-tag">{season}</span>}
            {style !== 'Any' && <span className="pref-tag">{style}</span>}
          </div>

          <button
            onClick={handleGenerateFresh}
            disabled={isGenerating}
            className="btn-primary btn-generate"
          >
            <Wand2 size={18} className={isGenerating ? 'spin-icon' : ''} />
            <span>{isGenerating ? 'Analyzing Wardrobe Harmony...' : 'Find Matching Outfits'}</span>
          </button>
        </div>
      </div>

      {/* Outfits Showcase Section */}
      <div className="recommendations-container">
        {isGenerating && displayedOutfits.length === 0 ? (
          <div className="generating-shimmer-state">
            <Wand2 size={40} className="pulse-icon text-gold" />
            <h3>Evaluating Garment Silhouettes & Color Harmonies...</h3>
            <p>Cross-checking dress code appropriateness, footwear compatibility, and color balance.</p>
          </div>
        ) : displayedOutfits.length > 0 ? (
          <div className="outfits-list">
            {/* Header with Anti-Repetition Action Buttons */}
            <div className="recommendations-heading-row">
              <div>
                <h2>
                  Curated Looks for <span className="serif-highlight">{occasion}</span>
                </h2>
                <p className="pool-info-text">
                  Showing {displayedOutfits.length} of {totalPoolCount} compatible combination{totalPoolCount === 1 ? '' : 's'} in wardrobe
                </p>
              </div>

              <div className="outfit-batch-actions">
                <button
                  type="button"
                  onClick={handleRefreshRecommendations}
                  disabled={isGenerating}
                  className="btn-secondary btn-refresh-batch"
                  title="Generate a new set of unseen compatible combinations"
                >
                  <RefreshCw size={15} className={isGenerating ? 'spin-icon' : ''} />
                  <span>Refresh Recommendations</span>
                </button>
              </div>
            </div>

            {/* Exhausted or cycled notification banner */}
            {exhaustedNotice && (
              <div className="info-banner-notice">
                <Sparkles size={16} />
                <span>{exhaustedNotice}</span>
              </div>
            )}

            {/* Render Outfit Cards */}
            {displayedOutfits.map((outfit, index) => (
              <div key={outfit.id || index} className="outfit-recommendation-card">
                {/* Outfit Header Bar */}
                <div className="outfit-header-bar">
                  <div className="outfit-title-group">
                    <div className="outfit-meta-topline">
                      <span className="look-number">Look #{index + 1}</span>
                      <span className="compatibility-score-pill">
                        <Sparkles size={12} /> {outfit.compatibilityScore}% Match
                      </span>
                    </div>
                    <h3 className="outfit-title">{outfit.title}</h3>
                    <div className="outfit-type-tags">
                      <span className="badge badge-primary">{outfit.type}</span>
                      <span className="badge badge-gender-tag">{outfit.gender}</span>
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

                {/* Outfit Garment Items Grid with Interactive Swap */}
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
                        {item.pattern && (
                          <span className="garment-pattern-badge">{item.pattern}</span>
                        )}
                      </div>

                      <div className="garment-info">
                        <div className="garment-cat-row">
                          <span className="garment-category">{item.category}</span>
                          <span className="garment-gender-sub">{item.gender}</span>
                        </div>
                        <h4 className="garment-name">{item.name}</h4>
                        <div className="garment-meta-row">
                          <span className="garment-colour">{item.colour}</span>
                          <span className="garment-price">₹{Number(item.price || 0).toLocaleString()}</span>
                        </div>

                        {/* Interactive Swap Button */}
                        <button
                          type="button"
                          className="btn-swap-piece"
                          onClick={() => handleOpenSwapModal(index, itemIdx)}
                          title={`Swap this ${item.subcategory || item.category} with another compatible piece`}
                        >
                          <RefreshCw size={13} />
                          <span>Swap Piece</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rule-Based Styling Justifications */}
                <div className="outfit-reasoning-box">
                  <div className="reasoning-title-row">
                    <Sparkles size={16} className="text-gold" />
                    <strong>Styling Harmony & Dress Code Rationale:</strong>
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

            {/* Pagination Controls ("Show More Outfits") */}
            <div className="planner-pagination-row">
              {hasMoreOutfits ? (
                <button
                  type="button"
                  onClick={handleShowMore}
                  disabled={isGenerating}
                  className="btn-primary btn-show-more"
                >
                  <PlusCircle size={17} />
                  <span>Show More Outfits ({totalPoolCount - displayedOutfits.length} more)</span>
                </button>
              ) : (
                <div className="exhausted-pool-banner">
                  <CheckCircle2 size={18} className="text-emerald" />
                  <span>
                    All {totalPoolCount} compatible outfit combinations for this setup have been displayed.
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : hasGenerated ? (
          <div className="no-outfit-match-card">
            <AlertCircle size={44} className="no-match-icon" />
            <h3>No Suitable Outfit Found</h3>
            <p>
              We couldn't form a fully compatible outfit matching your criteria for{' '}
              <strong>{gender === 'Women' ? "Women's" : gender === 'Men' ? "Men's" : 'All'}</strong> section{' '}
              ({occasion}, {preferredColour !== 'Any' ? `${preferredColour} colour` : ''}, {style !== 'Any' ? `${style} style` : ''}) with the clothes currently in your wardrobe.
            </p>
            <div className="no-match-hints">
              <strong>Helpful Styling Recommendations:</strong>
              <ul>
                <li>Try setting Preferred Colour to <em>"Any"</em> for broader palette harmony.</li>
                <li>Make sure you have both tops/dresses and appropriate footwear for {occasion}.</li>
                <li>Switch to the <em>"All / Unisex"</em> section to view unisex garments.</li>
                <li>Add custom clothing items to your wardrobe in the "My Wardrobe" section.</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setPreferredColour('Any');
                setStyle('Any');
                setCategoryFocus('Any');
                handleGenerateFresh();
              }}
              className="btn-primary"
            >
              <RotateCcw size={16} />
              <span>Reset to Open Filters</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Garment Swapping Modal */}
      {swapModalState.isOpen && swapModalState.outfitIndex !== null && (
        <SwapPieceModal
          isOpen={swapModalState.isOpen}
          onClose={handleCloseSwapModal}
          outfit={displayedOutfits[swapModalState.outfitIndex]}
          slotIndex={swapModalState.slotIndex}
          allClothes={allClothes}
          criteria={criteria}
          onSelectReplacement={handleApplyReplacement}
        />
      )}
    </div>
  );
};

export default OutfitPlanner;
