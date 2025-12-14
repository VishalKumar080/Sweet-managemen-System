import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { sweetService } from "../services/sweetService";
import { Sweet } from "../types";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import SweetModal from "../components/SweetModal";
import { Plus, Search } from "lucide-react";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = [
    "All",
    "Barfi",
    "Ladoo",
    "Halwa",
    "Jalebi",
    "Rasgulla",
    "Gulab Jamun",
    "Peda",
    "Kaju Katli",
    "Other",
  ];

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetService.getAllSweets(1, 100);
      setSweets(response.data.sweets);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchName) params.name = searchName;
      if (searchCategory && searchCategory !== "All")
        params.category = searchCategory;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const response = await sweetService.searchSweets(params);
      setSweets(response.data.sweets);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateSweet = async (sweetData: Partial<Sweet>) => {
    try {
      if (editingSweet) {
        await sweetService.updateSweet(editingSweet._id, sweetData);
      } else {
        await sweetService.addSweet(sweetData);
      }
      setIsModalOpen(false);
      setEditingSweet(null);
      fetchSweets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteSweet = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        await sweetService.deleteSweet(id);
        fetchSweets();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete sweet");
      }
    }
  };

  const handlePurchase = async (id: string, quantity: number) => {
    try {
      await sweetService.purchaseSweet(id, quantity);
      fetchSweets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleRestock = async (id: string, quantity: number) => {
    try {
      await sweetService.restockSweet(id, quantity);
      fetchSweets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Restock failed");
    }
  };

  const handleEditClick = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingSweet(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sweet Collection</h1>
          {isAdmin && (
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add Sweet</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Search & Filter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "All" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 flex items-center space-x-2 bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No sweets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={handleEditClick}
                onDelete={handleDeleteSweet}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </div>

      <SweetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSweet(null);
        }}
        onSubmit={handleAddOrUpdateSweet}
        sweet={editingSweet}
      />
    </div>
  );
};

export default Dashboard;
