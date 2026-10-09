/**
 * StyleSync Rule-Based Outfit Recommendation Engine
 * 
 * Transparent, deterministic styling logic combining color theory, 
 * silhouette compatibility, and occasion-specific dress codes.
 */

// Colors that act as universal neutrals
const NEUTRAL_COLORS = ['White', 'Black', 'Beige', 'Cream', 'Charcoal Grey'];

// Color harmony pairing rules
const COLOR_HARMONIES = {
  'White': ['Navy Blue', 'Black', 'Emerald Green', 'Pastel Pink', 'Beige', 'Rust Brown', 'Crimson Red', 'Mustard Yellow', 'Gold', 'Olive Green', 'Cream'],
  'Black': ['White', 'Gold', 'Crimson Red', 'Emerald Green', 'Pastel Pink', 'Beige', 'Charcoal Grey', 'Rust Brown'],
  'Navy Blue': ['White', 'Beige', 'Cream', 'Rust Brown', 'Gold', 'Pastel Pink', 'Olive Green'],
  'Beige': ['Navy Blue', 'White', 'Black', 'Olive Green', 'Rust Brown', 'Emerald Green', 'Cream', 'Pastel Pink'],
  'Cream': ['Navy Blue', 'Olive Green', 'Rust Brown', 'Pastel Pink', 'White', 'Beige', 'Charcoal Grey'],
  'Charcoal Grey': ['White', 'Black', 'Pastel Pink', 'Navy Blue', 'Cream', 'Mustard Yellow'],
  'Emerald Green': ['Gold', 'Black', 'White', 'Beige', 'Cream'],
  'Crimson Red': ['Gold', 'Black', 'White', 'Cream', 'Navy Blue'],
  'Maroon': ['Gold', 'Cream', 'Beige', 'Black'],
  'Pastel Pink': ['White', 'Beige', 'Navy Blue', 'Charcoal Grey', 'Cream', 'Gold'],
  'Mustard Yellow': ['Navy Blue', 'White', 'Charcoal Grey', 'Olive Green', 'Black'],
  'Olive Green': ['Beige', 'White', 'Cream', 'Navy Blue', 'Rust Brown', 'Black'],
  'Rust Brown': ['Beige', 'White', 'Navy Blue', 'Cream', 'Olive Green', 'Black'],
  'Gold': ['Emerald Green', 'Crimson Red', 'Maroon', 'Black', 'White', 'Navy Blue', 'Pastel Pink', 'Beige']
};

/**
 * Checks if two colors harmonize
 */
export const areColorsHarmonious = (colorA, colorB) => {
  if (!colorA || !colorB) return true;
  if (colorA === colorB) return true; // Monochromatic
  if (NEUTRAL_COLORS.includes(colorA) || NEUTRAL_COLORS.includes(colorB)) return true; // Neutrals match almost all
  const matches = COLOR_HARMONIES[colorA];
  return matches ? matches.includes(colorB) : true;
};

/**
 * Determine if an occasion is traditional/ethnic oriented
 */
const isEthnicOccasion = (occasion) => {
  return ['Wedding', 'Festival', 'Traditional Event'].includes(occasion);
};

/**
 * Determine if an occasion is athletic oriented
 */
const isSportOccasion = (occasion) => {
  return occasion === 'Sports';
};

/**
 * Generate outfit recommendations based on user criteria
 */
export const generateOutfitRecommendations = (allClothes, criteria) => {
  const {
    occasion = 'Casual',
    preferredColour = 'Any',
    season = 'All-Season',
    style = 'Any',
    categoryFocus = 'Any'
  } = criteria;

  if (!allClothes || allClothes.length === 0) {
    return {
      outfits: [],
      reason: 'No clothes currently available in your wardrobe. Add items to generate outfits.'
    };
  }

  // Group candidate items by high-level category
  const tops = allClothes.filter(i => i.category === 'Tops');
  const bottoms = allClothes.filter(i => i.category === 'Bottoms');
  const ethnic = allClothes.filter(i => i.category === 'Traditional Indian Wear');
  const western = allClothes.filter(i => i.category === 'Western Wear');
  const outerwear = allClothes.filter(i => i.category === 'Outerwear');
  const footwear = allClothes.filter(i => i.category === 'Footwear');
  const accessories = allClothes.filter(i => i.category === 'Accessories');
  const activewear = allClothes.filter(i => i.category === 'Activewear and Sleepwear');

  const generatedOutfits = [];

  // Helper score function for an individual item matching criteria
  const getItemScore = (item) => {
    let score = 0;
    if (item.occasion === occasion) score += 5;
    if (preferredColour !== 'Any' && item.colour === preferredColour) score += 4;
    if (style !== 'Any' && item.style === style) score += 3;
    if (season !== 'All-Season') {
      if (item.season === season || item.season === 'All-Season') score += 2;
    }
    return score;
  };

  const sortCandidates = (items) => {
    return [...items].sort((a, b) => getItemScore(b) - getItemScore(a));
  };

  const isWinterWeather = season === 'Winter / Chilly' || season === 'Winter';

  // Strategy 1: Traditional Indian Wear Ensemble (for Weddings, Festivals, Traditional Events or Ethnic preference)
  if (isEthnicOccasion(occasion) || categoryFocus === 'Traditional Indian Wear' || style === 'Ethnic') {
    const sortedEthnic = sortCandidates(ethnic);
    
    // Check one-piece / complete ethnic sets first (Saree, Lehenga, Anarkali, Sherwani, Dhoti, Salwar Suit)
    for (const heroItem of sortedEthnic) {
      if (generatedOutfits.length >= 3) break;

      const isOnePieceOrSet = ['Sarees', 'Lehengas', 'Anarkalis', 'Sherwanis', 'Dhotis', 'Salwar Suits', 'Ethnic Sets'].includes(heroItem.subcategory);
      
      let candidateFootwear = footwear.filter(f => 
        ['Traditional Footwear', 'Heels', 'Sandals', 'Flats'].includes(f.subcategory) &&
        areColorsHarmonious(heroItem.colour, f.colour)
      );
      if (candidateFootwear.length === 0) candidateFootwear = footwear;

      let candidateAccessories = accessories.filter(a => 
        ['Jewellery', 'Earrings', 'Necklaces', 'Watches', 'Sling Bags', 'Handbags'].includes(a.subcategory) &&
        areColorsHarmonious(heroItem.colour, a.colour)
      );
      if (candidateAccessories.length === 0) candidateAccessories = accessories;

      const chosenFootwear = sortCandidates(candidateFootwear)[0] || footwear[0];
      const chosenAccessory = sortCandidates(candidateAccessories)[0] || accessories[0];

      if (isOnePieceOrSet) {
        generatedOutfits.push({
          id: `outfit-${Date.now()}-eth-${heroItem.id}`,
          title: `Royal ${heroItem.subcategory.replace(/s$/, '')} Festive Ensemble`,
          type: 'Traditional Indian Ensemble',
          occasion,
          season,
          items: [heroItem, chosenFootwear, chosenAccessory].filter(Boolean),
          reasons: [
            `Tailored specifically for ${occasion} with authentic ${heroItem.subcategory}.`,
            `Color harmony: ${heroItem.colour} coordinates gracefully with ${chosenFootwear?.name || 'ethnic footwear'}.`,
            `Traditional silhouette avoids conflicting modern casual separates.`
          ],
          totalPrice: [heroItem, chosenFootwear, chosenAccessory].reduce((acc, curr) => acc + (curr?.price || 0), 0)
        });
      } else {
        // Kurti or Tunic requiring a bottom (Palazzo or Legging)
        let candidateBottoms = bottoms.filter(b => 
          ['Palazzos', 'Leggings'].includes(b.subcategory) &&
          areColorsHarmonious(heroItem.colour, b.colour)
        );
        if (candidateBottoms.length === 0) candidateBottoms = bottoms.filter(b => ['Palazzos', 'Leggings'].includes(b.subcategory));
        
        const chosenBottom = sortCandidates(candidateBottoms)[0];
        if (chosenBottom) {
          generatedOutfits.push({
            id: `outfit-${Date.now()}-kurti-${heroItem.id}`,
            title: `Elegant Kurti & Palazzo Pairing`,
            type: 'Indo-Western Fusion',
            occasion,
            season,
            items: [heroItem, chosenBottom, chosenFootwear, chosenAccessory].filter(Boolean),
            reasons: [
              `Comfortable yet poised ${heroItem.subcategory} paired with flowing ${chosenBottom.subcategory}.`,
              `Harmonious color balance between ${heroItem.colour} and ${chosenBottom.colour}.`,
              `Finished with authentic festive accents and footwear.`
            ],
            totalPrice: [heroItem, chosenBottom, chosenFootwear, chosenAccessory].reduce((acc, curr) => acc + (curr?.price || 0), 0)
          });
        }
      }
    }
  }

  // Strategy 2: Sportswear / Activewear (for Sports or Workout focus)
  if (isSportOccasion(occasion) || categoryFocus === 'Activewear and Sleepwear' || style === 'Sporty') {
    const sortedActive = sortCandidates(activewear);
    for (const heroItem of sortedActive) {
      if (generatedOutfits.length >= 3) break;

      const sportsShoes = footwear.filter(f => f.subcategory === 'Sports Shoes' || f.subcategory === 'Sneakers');
      const sportsAcc = accessories.filter(a => ['Backpacks', 'Watches', 'Caps'].includes(a.subcategory));

      const chosenShoes = sortCandidates(sportsShoes)[0] || footwear[0];
      const chosenAcc = sortCandidates(sportsAcc)[0] || accessories[0];

      generatedOutfits.push({
        id: `outfit-${Date.now()}-sport-${heroItem.id}`,
        title: `High-Performance ${heroItem.subcategory} Set`,
        type: 'Athletic Activewear',
        occasion,
        season,
        items: [heroItem, chosenShoes, chosenAcc].filter(Boolean),
        reasons: [
          `Optimized for mobility and active movement during ${occasion}.`,
          `Paired with supportive high-cushion footwear for physical comfort.`,
          `Breathable fabric combination ideal for workouts and training.`
        ],
        totalPrice: [heroItem, chosenShoes, chosenAcc].reduce((acc, curr) => acc + (curr?.price || 0), 0)
      });
    }
  }

  // Strategy 3: Western One-Piece Dress / Co-ord / Jumpsuit
  if (!isSportOccasion(occasion) && (!isEthnicOccasion(occasion) || categoryFocus === 'Western Wear')) {
    const sortedWestern = sortCandidates(western);
    for (const dress of sortedWestern) {
      if (generatedOutfits.length >= 3) break;

      const isOnePiece = ['Casual Dresses', 'Maxi Dresses', 'Gowns', 'Jumpsuits', 'Rompers', 'Co-ord Sets'].includes(dress.subcategory);
      if (!isOnePiece) continue;

      let candidateFootwear = footwear.filter(f => {
        if (occasion === 'Party' || occasion === 'Date Night') return ['Heels', 'Sandals', 'Boots'].includes(f.subcategory);
        if (occasion === 'Office' || occasion === 'Interview') return ['Loafers', 'Heels'].includes(f.subcategory);
        return ['Sneakers', 'Flats', 'Sandals', 'Loafers'].includes(f.subcategory);
      });
      if (candidateFootwear.length === 0) candidateFootwear = footwear;

      let candidateAccessories = accessories.filter(a => 
        ['Handbags', 'Sling Bags', 'Jewellery', 'Earrings', 'Necklaces', 'Sunglasses', 'Watches'].includes(a.subcategory) &&
        areColorsHarmonious(dress.colour, a.colour)
      );
      if (candidateAccessories.length === 0) candidateAccessories = accessories;

      const chosenFootwear = sortCandidates(candidateFootwear)[0] || footwear[0];
      const chosenAccessory = sortCandidates(candidateAccessories)[0] || accessories[0];

      // Add outerwear if cold
      let itemsList = [dress, chosenFootwear, chosenAccessory];
      let layerReason = '';

      if (isWinterWeather && outerwear.length > 0) {
        const matchingOuter = sortCandidates(outerwear.filter(o => areColorsHarmonious(dress.colour, o.colour)))[0] || outerwear[0];
        if (matchingOuter) {
          itemsList.splice(1, 0, matchingOuter);
          layerReason = ` Layered with ${matchingOuter.name} for chilly weather.`;
        }
      }

      generatedOutfits.push({
        id: `outfit-${Date.now()}-wes-${dress.id}`,
        title: `${dress.subcategory.replace(/s$/, '')} Silhouette for ${occasion}`,
        type: 'Contemporary One-Piece',
        occasion,
        season,
        items: itemsList.filter(Boolean),
        reasons: [
          `Effortlessly refined ${dress.name} chosen for a sleek, cohesive statement.`,
          `Color synergy: ${dress.colour} highlighted by complementary ${chosenAccessory?.name || 'accessories'}.`,
          `Footwear selection matches the dress code expectations for ${occasion}.${layerReason}`
        ],
        totalPrice: itemsList.reduce((acc, curr) => acc + (curr?.price || 0), 0)
      });
    }
  }

  // Strategy 4: Classic Separates (Top + Bottom + Footwear + Accessory +/- Outerwear)
  if (generatedOutfits.length < 3 && !isSportOccasion(occasion)) {
    const sortedTops = sortCandidates(tops);
    const sortedBottoms = sortCandidates(bottoms);

    for (const top of sortedTops) {
      if (generatedOutfits.length >= 3) break;

      // Filter bottoms compatible with the occasion and top style
      let candidateBottoms = sortedBottoms.filter(bottom => {
        // Formal check
        if (occasion === 'Office' || occasion === 'Interview') {
          return ['Trousers', 'Formal Pants', 'Wide-leg Pants'].includes(bottom.subcategory);
        }
        // College / Casual
        if (occasion === 'College' || occasion === 'Casual') {
          return ['Jeans', 'Skirts', 'Shorts', 'Wide-leg Pants', 'Leggings'].includes(bottom.subcategory);
        }
        return true;
      });

      if (candidateBottoms.length === 0) candidateBottoms = sortedBottoms;

      // Filter by color harmony
      const colorMatchingBottoms = candidateBottoms.filter(b => areColorsHarmonious(top.colour, b.colour));
      const chosenBottom = (colorMatchingBottoms.length > 0 ? colorMatchingBottoms : candidateBottoms)[0];

      if (!chosenBottom) continue;

      // Find compatible footwear
      let candidateFootwear = footwear.filter(f => {
        if (occasion === 'Office' || occasion === 'Interview') {
          return ['Loafers', 'Heels'].includes(f.subcategory);
        }
        if (occasion === 'College' || occasion === 'Travel') {
          return ['Sneakers', 'Boots', 'Flats'].includes(f.subcategory);
        }
        if (occasion === 'Party' || occasion === 'Date Night') {
          return ['Heels', 'Sandals', 'Boots', 'Loafers'].includes(f.subcategory);
        }
        return true;
      });
      if (candidateFootwear.length === 0) candidateFootwear = footwear;
      const chosenFootwear = sortCandidates(candidateFootwear)[0] || footwear[0];

      // Find compatible accessory
      let candidateAccessories = accessories.filter(a => {
        if (occasion === 'Office' || occasion === 'Interview') {
          return ['Handbags', 'Watches', 'Belts'].includes(a.subcategory);
        }
        if (occasion === 'College') {
          return ['Backpacks', 'Watches', 'Sunglasses'].includes(a.subcategory);
        }
        return true;
      });
      if (candidateAccessories.length === 0) candidateAccessories = accessories;
      const chosenAccessory = sortCandidates(candidateAccessories)[0] || accessories[0];

      const outfitItems = [top, chosenBottom, chosenFootwear, chosenAccessory];

      // Add outerwear if cold weather or blazers for interview
      if ((isWinterWeather || occasion === 'Interview' || occasion === 'Office') && outerwear.length > 0) {
        const suitableOuterwear = outerwear.filter(o => {
          if (occasion === 'Interview' || occasion === 'Office') return ['Coats', 'Blazers', 'Jackets'].includes(o.subcategory);
          return true;
        });
        const chosenOuterwear = sortCandidates(suitableOuterwear)[0];
        if (chosenOuterwear && !outfitItems.some(i => i.id === chosenOuterwear.id)) {
          outfitItems.splice(2, 0, chosenOuterwear);
        }
      }

      generatedOutfits.push({
        id: `outfit-${Date.now()}-sep-${top.id}-${chosenBottom.id}`,
        title: `${top.subcategory} & ${chosenBottom.subcategory} Edit`,
        type: 'Classic Separates',
        occasion,
        season,
        items: outfitItems.filter(Boolean),
        reasons: [
          `Balanced silhouette pairing ${top.name} with ${chosenBottom.name}.`,
          `Color palette: ${top.colour} upper complemented by ${chosenBottom.colour} lower.`,
          `Functional accessorizing with ${chosenAccessory?.name || 'accessories'} and occasion-ready ${chosenFootwear?.name || 'shoes'}.`
        ],
        totalPrice: outfitItems.reduce((acc, curr) => acc + (curr?.price || 0), 0)
      });
    }
  }

  // Deduplicate and return
  const uniqueOutfits = [];
  const seenSignatures = new Set();

  for (const outfit of generatedOutfits) {
    const signature = outfit.items.map(i => i.id).sort().join('-');
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      uniqueOutfits.push(outfit);
    }
  }

  return {
    outfits: uniqueOutfits.slice(0, 3),
    totalFound: uniqueOutfits.length
  };
};
