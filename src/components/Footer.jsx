import React from 'react';
import { Sparkles, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="footer-section">
      <div className="footer-inner">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="brand-icon-wrapper small">
                <Sparkles size={18} />
              </div>
              <span className="brand-title">Style<span className="brand-highlight">Sync</span></span>
            </div>
            <p className="footer-bio">
              A smart, rule-based outfit planner designed to streamline wardrobe management,
              inspire daily confidence, and curate harmonious outfits for every occasion.
            </p>
            <div className="github-profile-pill">
              <GithubIcon size={16} />
              <a
                href="https://github.com/Pavani295"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <span>Created by @Pavani295</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => { setActivePage('home'); window.scrollTo(0,0); }}>Home</button></li>
              <li><button onClick={() => { setActivePage('wardrobe'); window.scrollTo(0,0); }}>My Wardrobe</button></li>
              <li><button onClick={() => { setActivePage('planner'); window.scrollTo(0,0); }}>Outfit Planner</button></li>
              <li><button onClick={() => { setActivePage('favourites'); window.scrollTo(0,0); }}>Saved Outfits</button></li>
              <li><button onClick={() => { setActivePage('dashboard'); window.scrollTo(0,0); }}>Wardrobe Analytics</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Core Collections</h4>
            <ul className="footer-nav-list text-muted">
              <li>Traditional Indian Wear</li>
              <li>Western Wear & Co-ords</li>
              <li>Workwear & Office Suits</li>
              <li>Footwear & Handcrafted Juttis</li>
              <li>Accessories & Fine Jewellery</li>
            </ul>
          </div>

          {/* Technology Badges */}
          <div className="footer-col">
            <h4 className="footer-heading">Engineered With</h4>
            <div className="tech-badge-container">
              <span className="tech-badge">React.js 19</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">Modern CSS3</span>
              <span className="tech-badge">Local JSON Database</span>
              <span className="tech-badge">Browser LocalStorage</span>
              <span className="tech-badge">Rule-Based Styling</span>
            </div>
            <div className="footer-guarantee">
              <ShieldCheck size={16} className="text-gold" />
              <span>100% Client-Side &bull; Zero external API dependencies</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {CURRENT_YEAR} StyleSync – Smart Outfit Planner. All rights reserved.
          </p>
          <p className="crafted-text">
            Crafted with <Heart size={14} className="heart-icon" /> for stylish everyday living.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
