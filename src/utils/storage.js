import initialClothes from '../data/clothes.json';

const STORAGE_KEYS = {
  CUSTOM_ITEMS: 'stylesync_custom_items',
  EDITED_ITEMS: 'stylesync_edited_items',
  DELETED_IDS: 'stylesync_deleted_ids',
  FAVOURITES: 'stylesync_favourites',
};

// Safe JSON parser
const safeParse = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

// Safe JSON writer
const safeSave = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Get all active clothes (Initial JSON + Custom items - Deleted items + Edits)
 */
export const getAllClothes = () => {
  const customItems = safeParse(STORAGE_KEYS.CUSTOM_ITEMS, []);
  const editedItems = safeParse(STORAGE_KEYS.EDITED_ITEMS, {});
  const deletedIds = new Set(safeParse(STORAGE_KEYS.DELETED_IDS, []));

  // Merge default + custom items
  const combined = [...initialClothes, ...customItems];

  // Filter out deleted and apply edits
  return combined
    .filter(item => !deletedIds.has(item.id))
    .map(item => {
      if (editedItems[item.id]) {
        return { ...item, ...editedItems[item.id] };
      }
      return item;
    });
};

/**
 * Add a new user-created clothing item
 */
export const addCustomClothing = (clothingData) => {
  const customItems = safeParse(STORAGE_KEYS.CUSTOM_ITEMS, []);
  const newItem = {
    ...clothingData,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...customItems];
  safeSave(STORAGE_KEYS.CUSTOM_ITEMS, updated);
  return newItem;
};

/**
 * Update an existing clothing item (works for both default & custom)
 */
export const updateClothing = (updatedItem) => {
  const customItems = safeParse(STORAGE_KEYS.CUSTOM_ITEMS, []);
  const isCustom = customItems.some(item => item.id === updatedItem.id);

  if (isCustom) {
    const updatedList = customItems.map(item =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item
    );
    safeSave(STORAGE_KEYS.CUSTOM_ITEMS, updatedList);
  } else {
    // Record edit override for initial item
    const editedItems = safeParse(STORAGE_KEYS.EDITED_ITEMS, {});
    editedItems[updatedItem.id] = { ...updatedItem };
    safeSave(STORAGE_KEYS.EDITED_ITEMS, editedItems);
  }

  return updatedItem;
};

/**
 * Delete a clothing item
 */
export const deleteClothing = (id) => {
  const customItems = safeParse(STORAGE_KEYS.CUSTOM_ITEMS, []);
  const isCustom = customItems.some(item => item.id === id);

  if (isCustom) {
    const updated = customItems.filter(item => item.id !== id);
    safeSave(STORAGE_KEYS.CUSTOM_ITEMS, updated);
  } else {
    const deletedIds = safeParse(STORAGE_KEYS.DELETED_IDS, []);
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      safeSave(STORAGE_KEYS.DELETED_IDS, deletedIds);
    }
  }

  // Also remove from favourites if present
  const favourites = safeParse(STORAGE_KEYS.FAVOURITES, []);
  const updatedFavourites = favourites.filter(fav =>
    !fav.items.some(item => item.id === id)
  );
  safeSave(STORAGE_KEYS.FAVOURITES, updatedFavourites);

  return true;
};

/**
 * Reset collection back to initial defaults
 */
export const resetToDefaults = () => {
  safeSave(STORAGE_KEYS.CUSTOM_ITEMS, []);
  safeSave(STORAGE_KEYS.EDITED_ITEMS, {});
  safeSave(STORAGE_KEYS.DELETED_IDS, []);
  return initialClothes;
};

/**
 * Get all favourite outfits
 */
export const getFavourites = () => {
  return safeParse(STORAGE_KEYS.FAVOURITES, []);
};

/**
 * Save an outfit to favourites
 */
export const saveFavourite = (outfit) => {
  const favourites = safeParse(STORAGE_KEYS.FAVOURITES, []);
  
  // Prevent duplicate: check if an outfit with identical item IDs already exists
  const itemIds = outfit.items.map(i => i.id).sort().join(',');
  const isDuplicate = favourites.some(fav => {
    const existingIds = fav.items.map(i => i.id).sort().join(',');
    return existingIds === itemIds;
  });

  if (isDuplicate) {
    return { success: false, message: 'This outfit combination is already in your favourites!' };
  }

  const newFav = {
    ...outfit,
    id: `fav-${Date.now()}`,
    savedAt: new Date().toISOString(),
  };

  const updated = [newFav, ...favourites];
  safeSave(STORAGE_KEYS.FAVOURITES, updated);
  return { success: true, favourite: newFav };
};

/**
 * Remove an outfit from favourites
 */
export const removeFavourite = (favouriteId) => {
  const favourites = safeParse(STORAGE_KEYS.FAVOURITES, []);
  const updated = favourites.filter(fav => fav.id !== favouriteId);
  safeSave(STORAGE_KEYS.FAVOURITES, updated);
  return updated;
};

/**
 * Clear all favourites
 */
export const clearAllFavourites = () => {
  safeSave(STORAGE_KEYS.FAVOURITES, []);
  return [];
};
