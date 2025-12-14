import { useState } from "react";
import { Sweet } from "../types";
import { ShoppingCart, Edit, Trash2, Package } from "lucide-react";

interface SweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onPurchase: (id: string, quantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: string) => void;
  onRestock: (id: string, quantity: number) => void;
}

const SweetCard = ({
  sweet,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}: SweetCardProps) => {
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [restockQty, setRestockQty] = useState(10);

  const handlePurchase = () => {
    if (purchaseQty > 0 && purchaseQty <= sweet.quantity) {
      onPurchase(sweet._id, purchaseQty);
      setPurchaseQty(1);
    }
  };

  const handleRestock = () => {
    if (restockQty > 0) {
      onRestock(sweet._id, restockQty);
      setRestockQty(10);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{sweet.category}</p>
        </div>
        <span className="text-2xl font-bold text-primary">₹{sweet.price}</span>
      </div>

      {sweet.description && (
        <p className="text-gray-600 text-sm mb-4">{sweet.description}</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-gray-500" />
          <span
            className={`font-semibold ${
              sweet.quantity === 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            {sweet.quantity === 0
              ? "Out of Stock"
              : `${sweet.quantity} in stock`}
          </span>
        </div>
      </div>

      {!isAdmin && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQty}
              onChange={(e) => setPurchaseQty(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              disabled={sweet.quantity === 0}
            />
            <button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Purchase</span>
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(sweet._id)}
              className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleRestock}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Package className="h-4 w-4" />
              <span>Restock</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SweetCard;
