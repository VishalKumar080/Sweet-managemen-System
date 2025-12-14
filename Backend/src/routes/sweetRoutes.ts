import express from 'express';
import {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController';
import { protect, adminOnly } from '../middlewares/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Sweet CRUD routes
router.post('/', addSweet);
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.put('/:id', updateSweet);
router.delete('/:id', adminOnly, deleteSweet);

// Inventory routes
router.post('/:id/purchase', purchaseSweet);
router.post('/:id/restock', adminOnly, restockSweet);

export default router;