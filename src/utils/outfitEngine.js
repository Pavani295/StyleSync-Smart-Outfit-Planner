/**
 * StyleSync Rule-Based Outfit Recommendation Engine (V2 - Complete Multi-Gender & Anti-Repetition)
 * 
 * Deterministic styling logic supporting:
 * - Independent Men, Women, and Unisex matching
 * - Strict dress code rules (no formal suits with sandals, no sarees with sneakers, no athletic wear at weddings)
 * - Occasion appropriateness matrix (Office, Wedding, Casual, Sports, College, Party, etc.)
 * - Standalone garment detection (Dresses, Sarees, Lehengas, Jumpsuits, Suits do NOT require separate bottoms)
 * - Color harmony & pattern synergy calculation
 * - Multi-look pagination & anti-repetition tracking with signature exclusion
 * - Real-time slot piece swapping & compatibility recalculation
 */

// Universal neutrals that coordinate seamlessly
const NEUTRAL_COLORS = ['White', 'Black', 'Beige', 'Cream', 'Charcoal Grey'];

// Harmonious color relationships
const COLOR_HARMONIES = {
  'White': ['Navy Blue', 'Black', 'Emerald Green', 'Pastel Pink', 'Beige', 'Rust Brown', 'Crimson Red', 'Mustard Yellow', 'Gold', 'Olive Green', 'Cream', 'Charcoal Grey'],
  'Black': ['White', 'Gold', 'Crimson Red', 'Emerald Green', 'Pastel Pink', 'Beige', 'Charcoal Grey', 'Rust Brown', 'Mustard Yellow'],
  'Navy Blue': ['White', 'Beige', 'Cream', 'Rust Brown', 'Gold', 'Pastel Pink', 'Olive Green', 'Charcoal Grey'],
  'Beige': ['Navy Blue', 'White', 'Black', 'Olive Green', 'Rust Brown', 'Emerald Green', 'Cream', 'Pastel Pink', 'Charcoal Grey'],
  'Cream': ['Navy Blue', 'Olive Green', 'Rust Brown', 'Pastel Pink', 'White', 'Beige', 'Charcoal Grey', 'Gold'],
  'Charcoal Grey': ['White', 'Black', 'Pastel Pink', 'Navy Blue', 'Cream', 'Mustard Yellow', 'Beige'],
  'Emerald Green': ['Gold', 'Black', 'White', 'Beige', 'Cream', 'Navy Blue'],
  'Crimson Red': ['Gold', 'Black', 'White', 'Cream', 'Navy Blue'],
  'Maroon': ['Gold', 'Cream', 'Beige', 'Black', 'White'],
  'Pastel Pink': ['White', 'Beige', 'Navy Blue', 'Charcoal Grey', 'Cream', 'Gold', 'Rust Brown'],
  'Mustard Yellow': ['Navy Blue', 'White', 'Charcoal Grey', 'Olive Green', 'Black', 'Cream'],
  'Olive Green': ['Beige', 'White', 'Cream', 'Navy Blue', 'Rust Brown', 'Black', 'Charcoal Grey'],
  'Rust Brown': ['Beige', 'White', 'Navy Blue', 'Cream', 'Olive Green', 'Black', 'Pastel Pink'],
  'Gold': ['Emerald Green', 'Crimson Red', 'Maroon', 'Black', 'White', 'Navy Blue', 'Pastel Pink', 'Beige', 'Cream']
};

/**
 * Checks if two colors harmonize
 */
export const areColorsHarmonious = (colorA, colorB) => {
  if (!colorA || !colorB) return true;
  if (colorA === colorB) return true; // Monochromatic
  if (NEUTRAL_COLORS.includes(colorA) || NEUTRAL_COLORS.includes(colorB)) return true;
  const matches = COLOR_HARMONIES[colorA];
  return matches ? matches.includes(colorB) : true;
};

/**
 * Checks pattern compatibility (avoids pattern clashing)
 */
export const arePatternsCompatible = (patternA, patternB) => {
  if (!patternA || !patternB) return true;
  const isBusyA = ['Floral', 'Plaid', 'Graphic', 'Striped'].includes(patternA);
  const isBusyB = ['Floral', 'Plaid', 'Graphic', 'Striped'].includes(patternB);
  if (isBusyA && isBusyB && patternA !== patternB) {
    return false;
  }
  return true;
};

/**
 * Checks if a garment is a complete standalone outfit (no bottom separate needed)
 */
export const isStandaloneGarment = (item) => {
  if (!item) return false;
  const standaloneSubcats = [
    'Sarees', 'Lehengas', 'Anarkalis', 'Salwar Suits', 'Ethnic Sets',
    'Casual Dresses', 'Maxi Dresses', 'Gowns', 'Jumpsuits', 'Rompers',
    'Co-ord Sets', 'Formal Suits', 'Sherwanis', 'Dhotis', 'Tracksuits'
  ];
  return standaloneSubcats.includes(item.subcategory);
};

/**
 * Validates whether an item's occasion tag is suitable for the target occasion
 */
export const isOccasionCompatible = (itemOccasion, targetOccasion) => {
  if (!itemOccasion || !targetOccasion) return true;
  if (itemOccasion === targetOccasion) return true;

  const occasionMatrix = {
    'Office': ['Office', 'Interview'],
    'Interview': ['Interview', 'Office'],
    'Wedding': ['Wedding', 'Festival', 'Traditional Event'],
    'Festival': ['Festival', 'Traditional Event', 'Wedding'],
    'Traditional Event': ['Traditional Event', 'Festival', 'Wedding'],
    'College': ['College', 'Casual'],
    'Casual': ['Casual', 'College', 'Travel'],
    'Travel': ['Travel', 'Casual', 'College'],
    'Date Night': ['Date Night', 'Party', 'Casual'],
    'Party': ['Party', 'Date Night'],
    'Sports': ['Sports']
  };

  const allowed = occasionMatrix[targetOccasion] || [targetOccasion];
  return allowed.includes(itemOccasion);
};

/**
 * Validates dress code and footwear appropriateness (strictly bans inappropriate mixes)
 */
export const isFootwearAppropriate = (footwear, heroGarment, occasion) => {
  if (!footwear) return true;
  const subcat = footwear.subcategory;

  // Rule 1: Formal office / interview cannot have casual beach slides or sports running shoes
  if (occasion === 'Office' || occasion === 'Interview') {
    if (['Sports Shoes', 'Flats'].includes(subcat) && footwear.style !== 'Formal') {
      return false;
    }
    return ['Loafers', 'Heels', 'Formal Footwear'].includes(subcat) || footwear.style === 'Formal';
  }

  // Rule 2: Grand Traditional Indian (Saree, Lehenga, Sherwani) requires ethnic or elegant footwear
  if (['Sarees', 'Lehengas', 'Sherwanis', 'Anarkalis', 'Salwar Suits'].includes(heroGarment?.subcategory)) {
    if (['Sneakers', 'Sports Shoes', 'Boots'].includes(subcat)) {
      return false; // strictly ban sneakers with sarees/lehengas/sherwanis
    }
    return ['Traditional Footwear', 'Heels', 'Sandals', 'Loafers', 'Flats'].includes(subcat);
  }

  // Rule 3: Sports occasion requires sports shoes / sneakers
  if (occasion === 'Sports') {
    return ['Sports Shoes', 'Sneakers'].includes(subcat);
  }

  // Rule 4: Wedding / Festival should not pair sneakers or sports shoes
  if (occasion === 'Wedding' || occasion === 'Festival') {
    if (['Sports Shoes', 'Sneakers'].includes(subcat)) return false;
  }

  return true;
};

/**
 * Evaluates holistic compatibility score between items and criteria
 * Returns numeric score (0 - 100) and contextual reasoning list
 */
export const evaluateOutfitCompatibility = (items, criteria = {}) => {
  const {
    occasion = 'Casual',
    preferredColour = 'Any',
    season = 'All-Season',
    style = 'Any'
  } = criteria;

  const validItems = items.filter(Boolean);
  if (validItems.length === 0) return { score: 50, reasons: [] };

  let score = 72; // baseline
  const reasons = [];

  // 1. Occasion Check
  const occasionMatches = validItems.filter(i => isOccasionCompatible(i.occasion, occasion)).length;
  if (occasionMatches >= 2) {
    score += 12;
    reasons.push(`Tailored specifically for ${occasion} settings with dress code adherence.`);
  } else if (occasionMatches >= 1) {
    score += 8;
    reasons.push(`Appropriate for ${occasion} activities and etiquette.`);
  }

  // 2. Preferred Colour Alignment
  if (preferredColour !== 'Any') {
    const hasPreferred = validItems.some(i => i.colour === preferredColour);
    if (hasPreferred) {
      score += 8;
      reasons.push(`Highlights your preferred ${preferredColour} palette prominently.`);
    }
  }

  // 3. Color Harmony between pieces
  let allColorsHarmonious = true;
  for (let i = 0; i < validItems.length - 1; i++) {
    for (let j = i + 1; j < validItems.length; j++) {
      if (!areColorsHarmonious(validItems[i].colour, validItems[j].colour)) {
        allColorsHarmonious = false;
        break;
      }
    }
  }
  if (allColorsHarmonious) {
    score += 8;
    const colorsList = Array.from(new Set(validItems.map(i => i.colour))).slice(0, 3).join(' & ');
    reasons.push(`Harmonious color balance coordinating ${colorsList}.`);
  } else {
    score -= 4;
  }

  // 4. Pattern Balance
  const patterns = validItems.map(i => i.pattern).filter(Boolean);
  const busyPatterns = patterns.filter(p => ['Floral', 'Plaid', 'Graphic', 'Striped'].includes(p));
  if (busyPatterns.length <= 1) {
    score += 4;
    reasons.push('Balanced pattern contrast with solid and complementary textures.');
  }

  // 5. Footwear dress code check
  const footwearItem = validItems.find(i => i.category === 'Footwear');
  const heroItem = validItems[0];
  if (footwearItem && isFootwearAppropriate(footwearItem, heroItem, occasion)) {
    score += 3;
    reasons.push(`Footwear selection (${footwearItem.subcategory}) appropriately complements ${occasion} styling.`);
  }

  // Cap score between 75 and 98 for realistic, believable styling metric
  score = Math.min(Math.max(score, 75), 98);

  return {
    score,
    reasons: reasons.slice(0, 3)
  };
};

/**
 * Generate all valid, compatible outfit combinations for given criteria
 * Supports gender isolation (Women, Men, Unisex), anti-repetition tracking, and pagination
 */
export const generateOutfitRecommendations = (allClothes, criteria = {}, ...rest) => {
  const genderPreference = criteria.gender || criteria.genderPreference || 'Women';
  const occasion = criteria.occasion || 'Casual';
  const preferredColour = criteria.preferredColour || 'Any';
  const season = criteria.season || 'All-Season';
  const style = criteria.style || 'Any';
  const categoryFocus = criteria.categoryFocus || 'Any';

  // Flexible option parsing (both object and parameter signatures supported)
  let offset = 0;
  let limit = 3;
  let excludeSignatures = [];

  if (typeof rest[0] === 'number') {
    offset = rest[0];
    limit = typeof rest[1] === 'number' ? rest[1] : 3;
    excludeSignatures = Array.isArray(rest[2]) ? rest[2] : [];
  } else if (typeof rest[0] === 'object' && rest[0] !== null) {
    offset = rest[0].offset || 0;
    limit = rest[0].limit || 3;
    excludeSignatures = rest[0].excludeSignatures || [];
  }

  if (!allClothes || allClothes.length === 0) {
    return {
      outfits: [],
      totalAvailable: 0,
      totalInPool: 0,
      hasMore: false,
      allSignatures: []
    };
  }

  // 1. Filter garments matching selected gender
  // Women: Women + Unisex
  // Men: Men + Unisex
  // All: Everything
  const genderFiltered = allClothes.filter(item => {
    if (genderPreference === 'Women') {
      return item.gender === 'Women' || item.gender === 'Unisex';
    }
    if (genderPreference === 'Men') {
      return item.gender === 'Men' || item.gender === 'Unisex';
    }
    return true; // 'All'
  });

  // Group candidate categories
  const tops = genderFiltered.filter(i => i.category === 'Tops');
  const bottoms = genderFiltered.filter(i => i.category === 'Bottoms');
  const ethnic = genderFiltered.filter(i => i.category === 'Traditional Indian Wear');
  const western = genderFiltered.filter(i => i.category === 'Western Wear');
  const outerwear = genderFiltered.filter(i => i.category === 'Outerwear');
  const footwear = genderFiltered.filter(i => i.category === 'Footwear');
  const accessories = genderFiltered.filter(i => i.category === 'Accessories');
  const activewear = genderFiltered.filter(i => i.category === 'Activewear and Sleepwear');

  const allCombinations = [];
  const isWinterWeather = season === 'Winter / Chilly' || season === 'Winter';

  // Helper score for candidate ranking
  const getCandidateScore = (item) => {
    let pts = 0;
    if (item.occasion === occasion) pts += 12;
    else if (isOccasionCompatible(item.occasion, occasion)) pts += 6;
    if (preferredColour !== 'Any' && item.colour === preferredColour) pts += 8;
    if (style !== 'Any' && item.style === style) pts += 5;
    if (season !== 'All-Season' && (item.season === season || item.season === 'All-Season')) pts += 4;
    return pts;
  };

  const sortItems = (items) => [...items].sort((a, b) => getCandidateScore(b) - getCandidateScore(a));

  // =========================================================================
  // Strategy A: Standalone Ensembles (Dresses, Sarees, Lehengas, Suits, Jumpsuits)
  // NEVER REQUIRE A SEPARATE BOTTOM!
  // =========================================================================
  const standaloneCandidates = [
    ...ethnic.filter(i => isStandaloneGarment(i)),
    ...western.filter(i => isStandaloneGarment(i)),
    ...activewear.filter(i => isStandaloneGarment(i))
  ];

  if (categoryFocus === 'Any' || categoryFocus === 'Traditional Indian Wear' || categoryFocus === 'Western Wear' || categoryFocus === 'Activewear and Sleepwear') {
    for (const hero of sortItems(standaloneCandidates)) {
      // Occasion suitability gate
      if (occasion === 'Sports' && hero.category !== 'Activewear and Sleepwear') continue;
      if (['Wedding', 'Festival', 'Traditional Event'].includes(occasion) && hero.category !== 'Traditional Indian Wear') continue;
      if (!isOccasionCompatible(hero.occasion, occasion)) continue;

      // Find compatible footwear matching hero's gender
      const compatibleShoes = footwear.filter(f => {
        if (hero.gender === 'Women' && f.gender === 'Men') return false;
        if (hero.gender === 'Men' && f.gender === 'Women') return false;
        return isFootwearAppropriate(f, hero, occasion) && isOccasionCompatible(f.occasion, occasion);
      });
      const harmoniousShoes = compatibleShoes.filter(f => areColorsHarmonious(hero.colour, f.colour));
      const chosenFootwearCandidates = (harmoniousShoes.length > 0 ? harmoniousShoes : compatibleShoes).slice(0, 2);

      // Find compatible accessory matching hero's gender
      const compatibleAcc = accessories.filter(a => {
        if (hero.gender === 'Women' && a.gender === 'Men') return false;
        if (hero.gender === 'Men' && a.gender === 'Women') return false;
        if (['Wedding', 'Traditional Event', 'Festival'].includes(occasion)) {
          return ['Jewellery', 'Earrings', 'Necklaces', 'Watches', 'Sling Bags'].includes(a.subcategory);
        }
        if (occasion === 'Office' || occasion === 'Interview') {
          return ['Handbags', 'Watches', 'Belts'].includes(a.subcategory);
        }
        return areColorsHarmonious(hero.colour, a.colour);
      });
      const chosenAccessory = sortItems(compatibleAcc)[0] || accessories.find(a => (hero.gender === 'Women' ? a.gender !== 'Men' : hero.gender === 'Men' ? a.gender !== 'Women' : true));

      for (const chosenFootwear of chosenFootwearCandidates) {
        const outfitItems = [hero, chosenFootwear, chosenAccessory].filter(Boolean);

        // Optional winter outerwear layer for dresses/suits
        if (isWinterWeather && outerwear.length > 0 && !['Sarees', 'Lehengas'].includes(hero.subcategory)) {
          const outer = sortItems(outerwear.filter(o => {
            if (hero.gender === 'Women' && o.gender === 'Men') return false;
            if (hero.gender === 'Men' && o.gender === 'Women') return false;
            return areColorsHarmonious(hero.colour, o.colour);
          }))[0];
          if (outer) outfitItems.splice(1, 0, outer);
        }

        const evalResult = evaluateOutfitCompatibility(outfitItems, criteria);

        allCombinations.push({
          id: `outfit-std-${hero.id}-${chosenFootwear?.id || 'f'}`,
          title: `${hero.name.replace(/ Set$/, '')} Ensemble`,
          type: hero.category === 'Traditional Indian Wear' ? 'Traditional Indian Ensemble' : (hero.category === 'Activewear and Sleepwear' ? 'Performance Activewear' : 'Complete Silhouette'),
          gender: hero.gender || genderPreference,
          occasion,
          season,
          items: outfitItems,
          compatibilityScore: evalResult.score,
          reasons: evalResult.reasons,
          totalPrice: outfitItems.reduce((acc, curr) => acc + (curr?.price || 0), 0)
        });
      }
    }
  }

  // =========================================================================
  // Strategy B: Separates Outfits (Top + Bottom + Footwear + Accessory +/- Outerwear)
  // For College, Casual, Office, Interview, Date Night, Travel, etc.
  // =========================================================================
  if (occasion !== 'Wedding' && occasion !== 'Festival') {
    const candidateTops = tops.filter(t => isOccasionCompatible(t.occasion, occasion));
    const sortedTops = sortItems(candidateTops.length > 0 ? candidateTops : tops);

    for (const top of sortedTops) {
      // Find compatible bottoms
      const validBottoms = bottoms.filter(bottom => {
        // Gender consistency
        if (top.gender === 'Women' && bottom.gender === 'Men') return false;
        if (top.gender === 'Men' && bottom.gender === 'Women') return false;

        // Occasion suitability
        if (!isOccasionCompatible(bottom.occasion, occasion)) return false;

        // Formal check
        if (occasion === 'Office' || occasion === 'Interview') {
          if (['Shorts', 'Leggings'].includes(bottom.subcategory)) return false;
          return ['Trousers', 'Formal Pants', 'Wide-leg Pants'].includes(bottom.subcategory);
        }
        // College / Casual
        if (occasion === 'College' || occasion === 'Casual') {
          return ['Jeans', 'Trousers', 'Skirts', 'Shorts', 'Wide-leg Pants', 'Palazzos'].includes(bottom.subcategory);
        }
        return true;
      });

      // Check color harmony and pattern compatibility
      const harmoniousBottoms = validBottoms.filter(b => 
        areColorsHarmonious(top.colour, b.colour) &&
        arePatternsCompatible(top.pattern, b.pattern)
      );

      const candidateBottoms = harmoniousBottoms.length > 0 ? harmoniousBottoms : validBottoms;
      if (candidateBottoms.length === 0) continue;

      // Find compatible footwear
      const validShoes = footwear.filter(f => {
        if (top.gender === 'Women' && f.gender === 'Men') return false;
        if (top.gender === 'Men' && f.gender === 'Women') return false;
        return isFootwearAppropriate(f, top, occasion) && isOccasionCompatible(f.occasion, occasion);
      });
      const harmoniousShoes = validShoes.filter(f => areColorsHarmonious(top.colour, f.colour));
      const candidateShoes = (harmoniousShoes.length > 0 ? harmoniousShoes : validShoes).slice(0, 2);

      // Find compatible accessory
      const validAcc = accessories.filter(a => {
        if (top.gender === 'Women' && a.gender === 'Men') return false;
        if (top.gender === 'Men' && a.gender === 'Women') return false;
        if (occasion === 'College') return ['Backpacks', 'Watches', 'Sunglasses'].includes(a.subcategory);
        if (occasion === 'Office' || occasion === 'Interview') return ['Handbags', 'Watches', 'Belts'].includes(a.subcategory);
        return areColorsHarmonious(top.colour, a.colour);
      });
      const chosenAccessory = sortItems(validAcc)[0] || accessories.find(a => (top.gender === 'Women' ? a.gender !== 'Men' : top.gender === 'Men' ? a.gender !== 'Women' : true));

      for (const chosenBottom of candidateBottoms.slice(0, 2)) {
        for (const chosenFootwear of candidateShoes) {
          const outfitItems = [top, chosenBottom, chosenFootwear, chosenAccessory].filter(Boolean);

          // Add Outerwear if cold or if interview/office blazer needed
          if ((isWinterWeather || occasion === 'Interview' || occasion === 'Office') && outerwear.length > 0) {
            const outerCandidates = outerwear.filter(o => {
              if (top.gender === 'Women' && o.gender === 'Men') return false;
              if (top.gender === 'Men' && o.gender === 'Women') return false;
              if (occasion === 'Interview') return ['Jackets', 'Coats'].includes(o.subcategory);
              return areColorsHarmonious(top.colour, o.colour);
            });
            const chosenOuter = sortItems(outerCandidates)[0];
            if (chosenOuter && !outfitItems.some(i => i.id === chosenOuter.id)) {
              outfitItems.splice(2, 0, chosenOuter);
            }
          }

          const evalResult = evaluateOutfitCompatibility(outfitItems, criteria);

          allCombinations.push({
            id: `outfit-sep-${top.id}-${chosenBottom.id}-${chosenFootwear?.id || 'f'}`,
            title: `${top.subcategory} & ${chosenBottom.subcategory} Edit`,
            type: 'Curated Separates',
            gender: top.gender || genderPreference,
            occasion,
            season,
            items: outfitItems,
            compatibilityScore: evalResult.score,
            reasons: evalResult.reasons,
            totalPrice: outfitItems.reduce((acc, curr) => acc + (curr?.price || 0), 0)
          });
        }
      }
    }
  }

  // =========================================================================
  // Strategy C: Kurti / Tunic Separates (Women's Indo-Western)
  // Kurti + Palazzo / Legging + Ethnic Footwear + Jewellery
  // =========================================================================
  if (genderPreference === 'Women' || genderPreference === 'All') {
    const kurtis = ethnic.filter(i => ['Kurtis', 'Tunics'].includes(i.subcategory) && isOccasionCompatible(i.occasion, occasion));
    for (const kurti of sortItems(kurtis)) {
      const kurtiBottoms = bottoms.filter(b => 
        ['Palazzos', 'Leggings', 'Wide-leg Pants'].includes(b.subcategory) &&
        b.gender !== 'Men'
      );
      const chosenBottom = sortItems(kurtiBottoms.filter(b => areColorsHarmonious(kurti.colour, b.colour)))[0] || kurtiBottoms[0];
      if (!chosenBottom) continue;

      const kurtiShoes = footwear.filter(f => 
        ['Traditional Footwear', 'Flats', 'Sandals'].includes(f.subcategory) &&
        f.gender !== 'Men'
      );
      const chosenShoes = sortItems(kurtiShoes.filter(f => areColorsHarmonious(kurti.colour, f.colour)))[0] || kurtiShoes[0];

      const kurtiAcc = accessories.filter(a => 
        ['Jewellery', 'Earrings', 'Sling Bags', 'Handbags'].includes(a.subcategory) &&
        a.gender !== 'Men'
      );
      const chosenAcc = sortItems(kurtiAcc)[0] || accessories[0];

      const outfitItems = [kurti, chosenBottom, chosenShoes, chosenAcc].filter(Boolean);
      const evalResult = evaluateOutfitCompatibility(outfitItems, criteria);

      allCombinations.push({
        id: `outfit-kurti-${kurti.id}-${chosenBottom.id}`,
        title: `${kurti.name.replace(/ Kurti$/, '')} Ethnic Fusion`,
        type: 'Indo-Western Fusion',
        gender: 'Women',
        occasion,
        season,
        items: outfitItems,
        compatibilityScore: evalResult.score,
        reasons: evalResult.reasons,
        totalPrice: outfitItems.reduce((acc, curr) => acc + (curr?.price || 0), 0)
      });
    }
  }

  // Deduplicate combinations by item signatures
  const uniqueCombinations = [];
  const seenSignatures = new Set();

  for (const combo of allCombinations) {
    const signature = combo.items.map(i => i.id).sort().join('_');
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      combo.signature = signature;
      uniqueCombinations.push(combo);
    }
  }

  // Sort by compatibility score
  uniqueCombinations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Filter out any combination in excludeSignatures (Anti-Repetition)
  const excludeSet = new Set(excludeSignatures);
  const eligibleCombinations = uniqueCombinations.filter(c => !excludeSet.has(c.signature));

  // Paginate according to offset and limit
  const pagedOutfits = eligibleCombinations.slice(offset, offset + limit);
  const hasMore = offset + limit < eligibleCombinations.length;

  return {
    outfits: pagedOutfits,
    totalAvailable: eligibleCombinations.length,
    totalInPool: uniqueCombinations.length,
    hasMore,
    allSignatures: uniqueCombinations.map(c => c.signature)
  };
};

/**
 * Find compatible replacement pieces for an outfit slot (Garment Swapping)
 */
export const getCompatibleReplacements = (currentOutfit, slotIndex, allClothes, criteria = {}) => {
  if (!currentOutfit || !currentOutfit.items || !currentOutfit.items[slotIndex]) return [];
  const currentItem = currentOutfit.items[slotIndex];
  const targetCategory = currentItem.category;
  const otherItems = currentOutfit.items.filter((_, idx) => idx !== slotIndex);

  // Filter candidates by gender and category
  const candidates = allClothes.filter(candidate => {
    if (candidate.id === currentItem.id) return false;
    if (candidate.category !== targetCategory) return false;

    // Gender consistency
    if (currentOutfit.gender === 'Women') {
      if (candidate.gender !== 'Women' && candidate.gender !== 'Unisex') return false;
    } else if (currentOutfit.gender === 'Men') {
      if (candidate.gender !== 'Men' && candidate.gender !== 'Unisex') return false;
    }

    // Occasion consistency
    if (!isOccasionCompatible(candidate.occasion, currentOutfit.occasion) && targetCategory !== 'Accessories') {
      return false;
    }

    // Footwear appropriateness check
    if (targetCategory === 'Footwear') {
      const hero = otherItems[0];
      if (!isFootwearAppropriate(candidate, hero, currentOutfit.occasion)) return false;
    }

    return true;
  });

  // Score candidate replacements by compatibility with other items
  return candidates.map(candidate => {
    const testItems = [...currentOutfit.items];
    testItems[slotIndex] = candidate;
    const testEval = evaluateOutfitCompatibility(testItems, criteria);
    return {
      item: candidate,
      score: testEval.score
    };
  }).sort((a, b) => b.score - a.score);
};

/**
 * Swaps a piece in an outfit and recalculates score, reasons, and pricing
 */
export const swapOutfitPiece = (currentOutfit, slotIndex, replacementItem, criteria = {}) => {
  if (!currentOutfit || !currentOutfit.items) return currentOutfit;
  const newItems = [...currentOutfit.items];
  newItems[slotIndex] = replacementItem;

  const evalResult = evaluateOutfitCompatibility(newItems, criteria);
  const newTotalPrice = newItems.reduce((acc, curr) => acc + (curr?.price || 0), 0);
  const newSignature = newItems.map(i => i.id).sort().join('_');

  return {
    ...currentOutfit,
    id: `outfit-swapped-${Date.now()}`,
    signature: newSignature,
    items: newItems,
    compatibilityScore: evalResult.score,
    reasons: evalResult.reasons,
    totalPrice: newTotalPrice
  };
};

export default {
  areColorsHarmonious,
  arePatternsCompatible,
  isStandaloneGarment,
  isOccasionCompatible,
  isFootwearAppropriate,
  evaluateOutfitCompatibility,
  generateOutfitRecommendations,
  getCompatibleReplacements,
  swapOutfitPiece
};
