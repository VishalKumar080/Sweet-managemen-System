import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import Sweet from '../models/Sweet';
import { AuthRequest } from '../middlewares/auth';

// @desc    Add new sweet
// @route   POST /api/sweets
// @access  Protected
export const addSweet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, category, price, quantity, description, imageUrl } = req.body;

  const sweet = await Sweet.create({
    name,
    category,
    price,
    quantity,
    description,
    imageUrl,
  });

  return sendSuccess(res, 201, 'Sweet added successfully', { sweet });
});

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Protected
export const getAllSweets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const sweets = await Sweet.find().skip(skip).limit(limit);
  const total = await Sweet.countDocuments();

  return sendSuccess(res, 200, 'Sweets fetched successfully', {
    sweets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Protected
export const searchSweets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, category, minPrice, maxPrice } = req.query;

  const query: any = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query);

  return sendSuccess(res, 200, 'Search results', { sweets });
});

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Protected
export const updateSweet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, category, price, quantity, description, imageUrl } = req.body;

  const sweet = await Sweet.findByIdAndUpdate(
    id,
    { name, category, price, quantity, description, imageUrl },
    { new: true, runValidators: true }
  );

  if (!sweet) {
    return sendError(res, 404, 'Sweet not found');
  }

  return sendSuccess(res, 200, 'Sweet updated successfully', { sweet });
});

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Protected (Admin only)
export const deleteSweet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const sweet = await Sweet.findByIdAndDelete(id);

  if (!sweet) {
    return sendError(res, 404, 'Sweet not found');
  }

  return sendSuccess(res, 200, 'Sweet deleted successfully', { sweet });
});

// @desc    Purchase sweet (decrease quantity)
// @route   POST /api/sweets/:id/purchase
// @access  Protected
export const purchaseSweet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return sendError(res, 400, 'Quantity must be greater than 0');
  }

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return sendError(res, 404, 'Sweet not found');
  }

  if (sweet.quantity < quantity) {
    return sendError(res, 400, 'Insufficient stock available');
  }

  sweet.quantity -= quantity;
  await sweet.save();

  return sendSuccess(res, 200, 'Purchase successful', { sweet });
});

// @desc    Restock sweet (increase quantity)
// @route   POST /api/sweets/:id/restock
// @access  Protected (Admin only)
export const restockSweet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return sendError(res, 400, 'Quantity must be greater than 0');
  }

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return sendError(res, 404, 'Sweet not found');
  }

  sweet.quantity += quantity;
  await sweet.save();

  return sendSuccess(res, 200, 'Restock successful', { sweet });
});