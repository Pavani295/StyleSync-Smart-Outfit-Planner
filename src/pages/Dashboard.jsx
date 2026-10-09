import React, { useMemo } from 'react';
import { Shirt, Layers, Heart, IndianRupee, BarChart3, Tag, Sparkles, Plus, Wand2, Users } from 'lucide-react';

const CATEGORY_COLORS = {
  'Tops': '#C5A880',
  'Bottoms': '#7C9082',
  'Traditional Indian Wear': '#C86D51',
  'Western Wear': '#4A6984',
  'Outerwear': '#8C7A6B',
  'Footwear': '#D4AF37',
  'Accessories': '#9E5B75',
  'Activewear and Sleepwear': '#5A8B71'
};

const COLOR_SWATCHES = {
  'White': '#FFFFFF',
  'Black': '#222222',
  'Navy Blue': '#1D2A44',
  'Beige': '#D8C3A5',
  'Cream': '#FAF6F0',
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

export const Dashboard = ({
  clothes = [],
  favourites = [],
  setActivePage,
  onAddNew
}) => {
  // 1. Metric stats
  const totalItems = clothes.length;
  const totalFavourites = favourites.length;
  
  const totalWardrobeValue = useMemo(() => {
    return clothes.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [clothes]);

  // 2. Category distribution
  const categoryStats = useMemo(() => {
    const counts = {};
    clothes.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
        color: CATEGORY_COLORS[name] || '#C5A880'
      }))
      .sort((a, b) => b.count - a.count);
  }, [clothes, totalItems]);

  const totalCategories = categoryStats.length;

  // 3. Colour distribution
  const colourStats = useMemo(() => {
    const counts = {};
    clothes.forEach(item => {
      if (item.colour) {
        counts[item.colour] = (counts[item.colour] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
        hex: COLOR_SWATCHES[name] || '#CCCCCC'
      }))
      .sort((a, b) => b.count - a.count);
  }, [clothes, totalItems]);

  // 4. Occasion distribution
  const occasionStats = useMemo(() => {
    const counts = {};
    clothes.forEach(item => {
      if (item.occasion) {
        counts[item.occasion] = (counts[item.occasion] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [clothes, totalItems]);

  // 5. Season distribution
  const seasonStats = useMemo(() => {
    const counts = {};
    clothes.forEach(item => {
      const sea = item.season || 'All-Season';
      counts[sea] = (counts[sea] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [clothes, totalItems]);

  // 6. Gender section distribution
  const genderStats = useMemo(() => {
    const counts = { Women: 0, Men: 0, Unisex: 0 };
    clothes.forEach(item => {
      const g = item.gender || 'Unisex';
      if (counts[g] !== undefined) counts[g]++;
      else counts.Unisex++;
    });
    return [
      { name: "Women's Collection", count: counts.Women, percentage: totalItems > 0 ? Math.round((counts.Women / totalItems) * 100) : 0, color: '#C86D51' },
      { name: "Men's Collection", count: counts.Men, percentage: totalItems > 0 ? Math.round((counts.Men / totalItems) * 100) : 0, color: '#4A6984' },
      { name: 'Unisex Wear', count: counts.Unisex, percentage: totalItems > 0 ? Math.round((counts.Unisex / totalItems) * 100) : 0, color: '#D4AF37' }
    ];
  }, [clothes, totalItems]);

  return (
    <div className="dashboard-page-container">
      {/* Top Header */}
      <div className="dashboard-header">
        <div>
          <span className="section-eyebrow">Wardrobe Intelligence</span>
          <h1 className="page-title">Wardrobe Analytics Dashboard</h1>
          <p className="page-subtitle">
            Real-time analytics, category distributions, color profiles, and valuation of your collection.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button onClick={onAddNew} className="btn-secondary">
            <Plus size={16} />
            <span>Add Item</span>
          </button>
          <button onClick={() => setActivePage('planner')} className="btn-primary">
            <Wand2 size={16} />
            <span>Plan Outfit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Wardrobe Pieces</span>
            <div className="metric-icon-wrap gold">
              <Shirt size={20} />
            </div>
          </div>
          <div className="metric-value">{totalItems}</div>
          <div className="metric-subtext">
            <span>Live updated from local storage</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Categories</span>
            <div className="metric-icon-wrap sage">
              <Layers size={20} />
            </div>
          </div>
          <div className="metric-value">{totalCategories} <span className="metric-unit">/ 8</span></div>
          <div className="metric-subtext">
            <span>Tops, Indian, Western, Footwear & more</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Saved Favourites</span>
            <div className="metric-icon-wrap rose">
              <Heart size={20} />
            </div>
          </div>
          <div className="metric-value">{totalFavourites}</div>
          <div className="metric-subtext">
            <span>Curated looks ready to wear</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Estimated Wardrobe Value</span>
            <div className="metric-icon-wrap blue">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="metric-value">₹{totalWardrobeValue.toLocaleString()}</div>
          <div className="metric-subtext">
            <span>Sum of all registered garments</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations Grid */}
      <div className="dashboard-charts-grid">
        {/* Category Breakdown Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-header-title">
              <BarChart3 size={20} className="chart-icon text-gold" />
              <h3>Category Distribution</h3>
            </div>
            <span className="chart-badge">{categoryStats.length} Categories</span>
          </div>

          <div className="category-bars-list">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="chart-bar-row">
                <div className="bar-labels">
                  <span className="bar-name">{cat.name}</span>
                  <span className="bar-numbers">
                    <strong>{cat.count} items</strong> ({cat.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max(cat.percentage, 4)}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occasion Distribution Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-header-title">
              <Tag size={20} className="chart-icon text-gold" />
              <h3>Occasion Suitability</h3>
            </div>
            <span className="chart-badge">Event Breakdown</span>
          </div>

          <div className="occasion-bars-list">
            {occasionStats.map((occ) => (
              <div key={occ.name} className="chart-bar-row">
                <div className="bar-labels">
                  <span className="bar-name">{occ.name}</span>
                  <span className="bar-numbers">
                    <strong>{occ.count} pieces</strong> ({occ.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-occasion"
                    style={{ width: `${Math.max(occ.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender / Wardrobe Section Distribution Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-header-title">
              <Users size={20} className="chart-icon text-gold" />
              <h3>Wardrobe Sections</h3>
            </div>
            <span className="chart-badge">Men, Women & Unisex</span>
          </div>

          <div className="category-bars-list">
            {genderStats.map((gen) => (
              <div key={gen.name} className="chart-bar-row">
                <div className="bar-labels">
                  <span className="bar-name">{gen.name}</span>
                  <span className="bar-numbers">
                    <strong>{gen.count} pieces</strong> ({gen.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max(gen.percentage, 4)}%`,
                      backgroundColor: gen.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colour Palette Swatches Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-header-title">
              <Sparkles size={20} className="chart-icon text-gold" />
              <h3>Colour Palette Distribution</h3>
            </div>
            <span className="chart-badge">{colourStats.length} Distinct Shades</span>
          </div>

          <div className="color-swatches-grid">
            {colourStats.map((col) => (
              <div key={col.name} className="color-swatch-card">
                <div
                  className="color-circle"
                  style={{
                    backgroundColor: col.hex,
                    border: col.name === 'White' || col.name === 'Cream' ? '1px solid #CCC' : 'none'
                  }}
                />
                <div className="color-info">
                  <span className="color-title">{col.name}</span>
                  <span className="color-count">{col.count} items &bull; {col.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Season Readiness Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-header-title">
              <Layers size={20} className="chart-icon text-gold" />
              <h3>Seasonal Readiness</h3>
            </div>
            <span className="chart-badge">Climate Profiles</span>
          </div>

          <div className="seasonal-cards-grid">
            {seasonStats.map((sea) => (
              <div key={sea.name} className="seasonal-stat-box">
                <span className="season-box-label">{sea.name}</span>
                <span className="season-box-count">{sea.count}</span>
                <span className="season-box-pct">{sea.percentage}% of wardrobe</span>
              </div>
            ))}
          </div>

          <div className="dashboard-tip-banner">
            <Sparkles size={16} className="text-gold" />
            <p>
              <strong>Stylist Tip:</strong> Keep your wardrobe balanced with versatile All-Season pieces 
              and dedicated traditional ensembles to stay ready for unexpected celebrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
