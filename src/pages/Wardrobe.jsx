import React, { useState, useMemo } from 'react';
import { Search, Plus, RotateCcw, SlidersHorizontal, Shirt, ArrowUpDown } from 'lucide-react';
import ClothingCard from '../components/ClothingCard';

const CATEGORIES = [
  'All Categories',
  'Tops',
  'Bottoms',
  'Traditional Indian Wear',
  'Western Wear',
  'Outerwear',
  'Footwear',
  'Accessories',
  'Activewear and Sleepwear'
];

const COLOURS = [
  'All Colours',
  'White',
  'Black',
  'Navy Blue',
  'Beige',
  'Cream',
  'Charcoal Grey',
  'Emerald Green',
  'Crimson Red',
  'Maroon',
  'Pastel Pink',
  'Mustard Yellow',
  'Olive Green',
  'Rust Brown',
  'Gold'
];

const OCCASIONS = [
  'All Occasions',
  'College',
  'Casual',
  'Office',
  'Interview',
  'Party',
  'Wedding',
  'Festival',
  'Traditional Event',
  'Sports',
  'Travel',
  'Date Night'
];

const STYLES = [
  'All Styles',
  'Casual',
  'Formal',
  'Chic',
  'Ethnic',
  'Sporty',
  'Glamorous',
  'Minimalist'
];

const SEASONS = ['All Seasons', 'Summer', 'Winter', 'Monsoon', 'Spring'];

export const Wardrobe = ({
  clothes = [],
  onAddNew,
  onEditItem,
  onDeleteItem,
  onViewDetails,
  selectedCategoryFilter = 'All Categories',
  setSelectedCategoryFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColour, setSelectedColour] = useState('All Colours');
  const [selectedOccasion, setSelectedOccasion] = useState('All Occasions');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [selectedSeason, setSelectedSeason] = useState('All Seasons');
  const [sortByPrice, setSortByPrice] = useState('default');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryFilter !== 'All Categories') count++;
    if (selectedColour !== 'All Colours') count++;
    if (selectedOccasion !== 'All Occasions') count++;
    if (selectedStyle !== 'All Styles') count++;
    if (selectedSeason !== 'All Seasons') count++;
    if (sortByPrice !== 'default') count++;
    if (searchTerm.trim() !== '') count++;
    return count;
  }, [selectedCategoryFilter, selectedColour, selectedOccasion, selectedStyle, selectedSeason, sortByPrice, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    if (setSelectedCategoryFilter) setSelectedCategoryFilter('All Categories');
    setSelectedColour('All Colours');
    setSelectedOccasion('All Occasions');
    setSelectedStyle('All Styles');
    setSelectedSeason('All Seasons');
    setSortByPrice('default');
  };

  // Filtered and sorted clothes
  const filteredClothes = useMemo(() => {
    return clothes.filter((item) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSubcat = (item.subcategory || '').toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSubcat && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategoryFilter !== 'All Categories') {
        if (item.category !== selectedCategoryFilter) return false;
      }

      // Colour filter
      if (selectedColour !== 'All Colours') {
        if (item.colour !== selectedColour) return false;
      }

      // Occasion filter
      if (selectedOccasion !== 'All Occasions') {
        if (item.occasion !== selectedOccasion) return false;
      }

      // Style filter
      if (selectedStyle !== 'All Styles') {
        if (item.style !== selectedStyle) return false;
      }

      // Season filter
      if (selectedSeason !== 'All Seasons') {
        if (item.season !== selectedSeason && item.season !== 'All-Season') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortByPrice === 'low-to-high') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortByPrice === 'high-to-low') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      return 0;
    });
  }, [
    clothes,
    searchTerm,
    selectedCategoryFilter,
    selectedColour,
    selectedOccasion,
    selectedStyle,
    selectedSeason,
    sortByPrice
  ]);

  return (
    <div className="wardrobe-page-container">
      {/* Top Header */}
      <div className="wardrobe-header">
        <div>
          <span className="section-eyebrow">Digital Wardrobe</span>
          <h1 className="page-title">My Wardrobe Collection</h1>
          <p className="page-subtitle">
            Manage your personal closet, filter by occasion, or add custom wardrobe items with images.
          </p>
        </div>

        <div className="wardrobe-header-actions">
          <button onClick={onAddNew} className="btn-primary">
            <Plus size={18} />
            <span>Add New Clothing</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Strip */}
      <div className="wardrobe-controls-card">
        <div className="search-filter-row">
          {/* Search bar */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search garments by name, subcategory, or fabric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`btn-filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
          >
            <SlidersHorizontal size={17} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filters-count-pill">{activeFiltersCount}</span>
            )}
          </button>

          {/* Price Sorting */}
          <div className="sort-wrapper">
            <ArrowUpDown size={16} className="sort-icon" />
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sort by: Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills Scroller */}
        <div className="category-pills-row">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter && setSelectedCategoryFilter(cat)}
                className={`category-pill ${isSelected ? 'active' : ''}`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="advanced-filters-drawer">
            <div className="filters-grid">
              {/* Colour Filter */}
              <div className="filter-select-group">
                <label className="filter-label">Colour</label>
                <select
                  value={selectedColour}
                  onChange={(e) => setSelectedColour(e.target.value)}
                  className="filter-select"
                >
                  {COLOURS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Occasion Filter */}
              <div className="filter-select-group">
                <label className="filter-label">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="filter-select"
                >
                  {OCCASIONS.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {/* Style Vibe */}
              <div className="filter-select-group">
                <label className="filter-label">Style Vibe</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="filter-select"
                >
                  {STYLES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Season */}
              <div className="filter-select-group">
                <label className="filter-label">Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="filter-select"
                >
                  {SEASONS.map(sea => (
                    <option key={sea} value={sea}>{sea}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Filters button inside drawer */}
            <div className="drawer-footer">
              <button
                onClick={handleResetFilters}
                className="btn-reset-filters"
              >
                <RotateCcw size={15} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Status Header */}
      <div className="wardrobe-results-bar">
        <div className="results-count">
          Showing <strong>{filteredClothes.length}</strong> of {clothes.length} items
          {activeFiltersCount > 0 && (
            <span className="active-filters-hint">
              ({activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''})
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button onClick={handleResetFilters} className="btn-link-reset">
            <RotateCcw size={14} />
            <span>Clear all filters</span>
          </button>
        )}
      </div>

      {/* Items Grid */}
      {filteredClothes.length > 0 ? (
        <div className="clothing-cards-grid">
          {filteredClothes.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onViewDetails={onViewDetails}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="empty-wardrobe-state">
          <div className="empty-icon-circle">
            <Shirt size={40} />
          </div>
          <h3>No matching clothes found</h3>
          <p>
            No items in your collection matched the selected filters or search terms.
            Try resetting your filters or adding a new clothing item.
          </p>
          <div className="empty-state-actions">
            <button onClick={handleResetFilters} className="btn-secondary">
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
            <button onClick={onAddNew} className="btn-primary">
              <Plus size={16} />
              <span>Add New Clothing</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
