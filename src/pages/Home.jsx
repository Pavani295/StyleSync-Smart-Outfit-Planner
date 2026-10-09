import React from 'react';
import { Wand2, Shirt, Sparkles, ArrowRight, CheckCircle2, Heart, Compass } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

export const Home = ({
  setActivePage,
  setSelectedCategoryFilter,
  allClothes = [],
  onSaveFavourite
}) => {
  const categoriesList = [
    {
      name: 'Traditional Indian Wear',
      count: allClothes.filter(i => i.category === 'Traditional Indian Wear').length,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Sarees, Lehengas, Kurtas & Salwars'
    },
    {
      name: 'Western Wear',
      count: allClothes.filter(i => i.category === 'Western Wear').length,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Dresses, Jumpsuits & Co-ords'
    },
    {
      name: 'Tops',
      count: allClothes.filter(i => i.category === 'Tops').length,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Shirts, Blouses, Hoodies & Tees'
    },
    {
      name: 'Bottoms',
      count: allClothes.filter(i => i.category === 'Bottoms').length,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Trousers, Denims, Palazzos & Skirts'
    },
    {
      name: 'Outerwear',
      count: allClothes.filter(i => i.category === 'Outerwear').length,
      image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Trench Coats, Blazers & Jackets'
    },
    {
      name: 'Footwear',
      count: allClothes.filter(i => i.category === 'Footwear').length,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Juttis, Loafers, Heels & Sneakers'
    },
    {
      name: 'Accessories',
      count: allClothes.filter(i => i.category === 'Accessories').length,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Jewellery, Bags, Watches & Belts'
    },
    {
      name: 'Activewear and Sleepwear',
      count: allClothes.filter(i => i.category === 'Activewear and Sleepwear').length,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      subtitle: 'Tracksuits, Yoga Sets & Sleepwear'
    }
  ];

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategoryFilter) {
      setSelectedCategoryFilter(categoryName);
    }
    setActivePage('wardrobe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sample Featured Look of the Day
  const featuredLookItems = [
    allClothes.find(i => i.id === 'w-eth-001') || allClothes.find(i => i.category === 'Traditional Indian Wear') || allClothes[0],
    allClothes.find(i => i.id === 'w-foo-001') || allClothes.find(i => i.category === 'Footwear') || allClothes[1],
    allClothes.find(i => i.id === 'w-acc-001') || allClothes.find(i => i.category === 'Accessories') || allClothes[2]
  ].filter(Boolean);

  const featuredOutfit = {
    id: 'featured-royal-wedding',
    title: 'Royal Banarasi Heritage Ensemble',
    type: 'Traditional Indian Wear',
    occasion: 'Wedding',
    season: 'All-Season',
    items: featuredLookItems,
    reasons: [
      'Authentic Royal Banarasi Silk Zari saree paired with antique gold handcrafted juttis.',
      'Complemented with 22k gold-plated Kundan choker set for regal ceremonial grace.',
      'Timeless crimson-and-gold color balance ensuring festive magnificence.'
    ],
    totalPrice: featuredLookItems.reduce((acc, curr) => acc + (curr?.price || 0), 0)
  };

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tag-badge">
            <Sparkles size={14} className="tag-sparkle" />
            <span>Rule-Based Smart Styling Engine</span>
          </div>
          <h1 className="hero-title">
            Curate Your Wardrobe. <br />
            <span className="serif-highlight">Master Every Outfit.</span>
          </h1>
          <p className="hero-subtitle">
            Say goodbye to morning decision fatigue. StyleSync blends color harmony, 
            silhouette rules, and occasion-specific etiquette to recommend flawless, 
            coordinated outfits from your collection.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => { setActivePage('planner'); window.scrollTo(0,0); }}
              className="btn-primary hero-btn"
            >
              <Wand2 size={18} />
              <span>Plan an Outfit</span>
            </button>
            <button
              onClick={() => { setActivePage('wardrobe'); window.scrollTo(0,0); }}
              className="btn-secondary hero-btn"
            >
              <Shirt size={18} />
              <span>Explore My Wardrobe</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">{allClothes.length}+</span>
              <span className="stat-label">Wardrobe Pieces</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Core Categories</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">Occasions Covered</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Rule-Based Harmony</span>
            </div>
          </div>
        </div>

        {/* Hero Showcase Visual */}
        <div className="hero-visual">
          <div className="visual-card-stack">
            <div className="floating-preview-card card-front">
              <div className="preview-image-badge">Editorial Choice</div>
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80"
                alt="Chic Jumpsuit Styling"
                className="hero-card-img"
              />
              <div className="hero-card-info">
                <h4>Contemporary Chic Jumpsuit</h4>
                <div className="hero-card-meta">
                  <span className="hero-meta-pill">Date Night</span>
                  <span className="hero-price-pill">₹2,799</span>
                </div>
              </div>
            </div>

            <div className="floating-preview-card card-back">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"
                alt="Banarasi Silk"
                className="hero-card-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-container how-it-works-section">
        <div className="section-header text-center">
          <span className="section-eyebrow">The Styling Method</span>
          <h2 className="section-title">How StyleSync Works</h2>
          <p className="section-subtitle">
            A deterministic, intelligent approach to wardrobe pairing that respects style logic and color theory.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-box">
              <Shirt size={28} />
            </div>
            <h3 className="step-heading">Curate Your Wardrobe</h3>
            <p className="step-desc">
              Browse 70+ preloaded sample garments across Indian & Western fashion, or add your own clothes with customized tags and prices.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-box">
              <Compass size={28} />
            </div>
            <h3 className="step-heading">Set Occasion & Vibe</h3>
            <p className="step-desc">
              Select your destination—from College and Interviews to Weddings and Parties—plus your color palettes, weather, and aesthetic preference.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-box">
              <Wand2 size={28} />
            </div>
            <h3 className="step-heading">Rule-Based Matching</h3>
            <p className="step-desc">
              Our transparent styling algorithm combines compatible separates, matching footwear, and accessories with clear explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Look of the Day */}
      <section className="section-container featured-look-section">
        <div className="featured-look-wrapper">
          <div className="featured-look-left">
            <div className="look-badge">
              <Sparkles size={14} />
              <span>Curator's Spotlight Look</span>
            </div>
            <h2 className="look-title">{featuredOutfit.title}</h2>
            <p className="look-subtitle">
              Designed for luxury wedding ceremonies and grand traditional gatherings, 
              marrying crimson silk textures with handcrafted heritage accessories.
            </p>

            <div className="look-reasons-list">
              {featuredOutfit.reasons.map((reason, idx) => (
                <div key={idx} className="reason-row">
                  <CheckCircle2 size={18} className="reason-check" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="look-action-bar">
              <div className="look-pricing">
                <span className="total-label">Combined Outfit Value</span>
                <span className="total-value">₹{featuredOutfit.totalPrice.toLocaleString()}</span>
              </div>
              <button
                className="btn-primary"
                onClick={() => onSaveFavourite(featuredOutfit)}
              >
                <Heart size={18} />
                <span>Save to Favourites</span>
              </button>
            </div>
          </div>

          <div className="featured-look-right">
            <div className="pieces-collage-grid">
              {featuredLookItems.map((piece, i) => (
                <div key={piece.id || i} className="collage-item-card">
                  <ImageWithFallback
                    src={piece.imageUrl}
                    alt={piece.name}
                    category={piece.category}
                    className="collage-img"
                  />
                  <div className="collage-details">
                    <span className="collage-cat">{piece.subcategory}</span>
                    <h5 className="collage-name">{piece.name}</h5>
                    <span className="collage-price">₹{Number(piece.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase Section */}
      <section className="section-container categories-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Explore Collections</span>
            <h2 className="section-title">Diverse Clothing Categories</h2>
            <p className="section-subtitle">
              Click any category to filter and manage pieces inside your digital closet.
            </p>
          </div>
          <button
            onClick={() => { setActivePage('wardrobe'); window.scrollTo(0,0); }}
            className="btn-ghost"
          >
            <span>View All Clothes</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="categories-grid">
          {categoriesList.map((cat, idx) => (
            <div
              key={idx}
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-img-container">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  category={cat.name}
                  className="category-img"
                />
                <div className="category-overlay-count">
                  <span>{cat.count} Items</span>
                </div>
              </div>
              <div className="category-card-info">
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-subtext">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-box">
          <div className="cta-text">
            <h2>Ready to plan today's perfect look?</h2>
            <p>Select your occasion and let our transparent rule-based styling logic do the matching.</p>
          </div>
          <button
            onClick={() => { setActivePage('planner'); window.scrollTo(0,0); }}
            className="btn-primary-white"
          >
            <Wand2 size={18} />
            <span>Launch Outfit Planner</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
