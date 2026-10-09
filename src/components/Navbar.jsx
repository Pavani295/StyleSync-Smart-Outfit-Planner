import React, { useState } from 'react';
import { Sparkles, Shirt, Wand2, Heart, LayoutDashboard, Home, Menu, X } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, favouritesCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt },
    { id: 'planner', label: 'Outfit Planner', icon: Wand2 },
    { id: 'favourites', label: 'Favourites', icon: Heart, badge: favouritesCount },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNavClick('home')}>
          <div className="brand-icon-wrapper">
            <Sparkles className="brand-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Style<span className="brand-highlight">Sync</span></span>
            <span className="brand-tagline">Smart Outfit Planner</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} className="nav-link-icon" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="navbar-actions">
          <button
            onClick={() => handleNavClick('planner')}
            className="btn-primary-compact"
          >
            <Wand2 size={16} />
            <span>Generate Outfit</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <div className="mobile-nav-link-content">
                  <Icon size={20} className="nav-link-icon" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
