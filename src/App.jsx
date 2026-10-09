import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ClothingDetailsModal from './components/ClothingDetailsModal';
import AddEditClothingModal from './components/AddEditClothingModal';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import OutfitPlanner from './pages/OutfitPlanner';
import Favourites from './pages/Favourites';
import Dashboard from './pages/Dashboard';
import {
  getAllClothes,
  addCustomClothing,
  updateClothing,
  deleteClothing,
  getFavourites,
  saveFavourite,
  removeFavourite,
  clearAllFavourites
} from './utils/storage';
import './App.css';

export function App() {
  const [activePage, setActivePage] = useState('home');
  const [clothes, setClothes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [detailsItem, setDetailsItem] = useState(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Filters passed from other pages (e.g., Home category clicks)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [prefilledPlannerCriteria, setPrefilledPlannerCriteria] = useState(null);

  const loadData = useCallback(() => {
    const loadedClothes = getAllClothes();
    const loadedFavourites = getFavourites();
    setClothes(loadedClothes);
    setFavourites(loadedFavourites);
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toast Helper
  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Clothing item actions
  const handleAddNewClothing = () => {
    setItemToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleEditClothing = (item) => {
    setItemToEdit(item);
    setIsAddEditOpen(true);
  };

  const handleSaveClothing = (formData, isEditing) => {
    if (isEditing) {
      updateClothing(formData);
      showToast(`"${formData.name}" has been updated successfully!`, 'success', 'Updated');
    } else {
      addCustomClothing(formData);
      showToast(`"${formData.name}" has been added to your wardrobe!`, 'success', 'Added');
    }
    loadData();
  };

  const handleDeleteClothing = (item) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${item.name}" from your wardrobe?`);
    if (confirmed) {
      deleteClothing(item.id);
      showToast(`"${item.name}" was removed from your wardrobe.`, 'danger', 'Deleted');
      loadData();
    }
  };

  const handlePlanWithItem = (item) => {
    setPrefilledPlannerCriteria({
      occasion: item.occasion || 'Casual',
      colour: item.colour || 'Any',
      style: item.style || 'Any',
      season: item.season || 'All-Season'
    });
    setActivePage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded preferences matching "${item.name}" into Outfit Planner!`, 'info', 'Outfit Planner');
  };

  // Favourites actions
  const handleSaveFavourite = (outfit) => {
    const result = saveFavourite(outfit);
    if (result.success) {
      showToast(`"${outfit.title}" saved to your favourites!`, 'success', 'Saved Outfit');
      setFavourites(getFavourites());
      return { success: true };
    } else {
      showToast(result.message, 'warning', 'Already Saved');
      return { success: false };
    }
  };

  const handleRemoveFavourite = (favouriteId) => {
    removeFavourite(favouriteId);
    setFavourites(getFavourites());
    showToast('Outfit removed from favourites.', 'info', 'Removed');
  };

  const handleClearAllFavourites = () => {
    const confirmed = window.confirm('Are you sure you want to clear all your saved favourite outfits?');
    if (confirmed) {
      clearAllFavourites();
      setFavourites([]);
      showToast('All favourite outfits have been cleared.', 'info', 'Cleared');
    }
  };

  return (
    <div className="stylesync-app">
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        favouritesCount={favourites.length}
      />

      {/* Main Pages Content */}
      <main className="main-content">
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            allClothes={clothes}
            onSaveFavourite={handleSaveFavourite}
          />
        )}

        {activePage === 'wardrobe' && (
          <Wardrobe
            clothes={clothes}
            onAddNew={handleAddNewClothing}
            onEditItem={handleEditClothing}
            onDeleteItem={handleDeleteClothing}
            onViewDetails={(item) => setDetailsItem(item)}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
          />
        )}

        {activePage === 'planner' && (
          <OutfitPlanner
            allClothes={clothes}
            onSaveFavourite={handleSaveFavourite}
            prefilledCriteria={prefilledPlannerCriteria}
          />
        )}

        {activePage === 'favourites' && (
          <Favourites
            favourites={favourites}
            onRemoveFavourite={handleRemoveFavourite}
            onClearAllFavourites={handleClearAllFavourites}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            clothes={clothes}
            favourites={favourites}
            setActivePage={setActivePage}
            onAddNew={handleAddNewClothing}
          />
        )}
      </main>

      {/* Clothing Details Modal */}
      {detailsItem && (
        <ClothingDetailsModal
          item={detailsItem}
          onClose={() => setDetailsItem(null)}
          onEdit={(item) => handleEditClothing(item)}
          onDelete={(item) => handleDeleteClothing(item)}
          onPlanWithItem={handlePlanWithItem}
        />
      )}

      {/* Add / Edit Clothing Modal */}
      <AddEditClothingModal
        isOpen={isAddEditOpen}
        itemToEdit={itemToEdit}
        onClose={() => {
          setIsAddEditOpen(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveClothing}
      />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default App;
