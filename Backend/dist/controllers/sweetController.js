"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockSweet = exports.purchaseSweet = exports.deleteSweet = exports.updateSweet = exports.searchSweets = exports.getAllSweets = exports.addSweet = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const Sweet_1 = __importDefault(require("../models/Sweet"));
// @desc    Add new sweet
// @route   POST /api/sweets
// @access  Protected
exports.addSweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, category, price, quantity, description, imageUrl } = req.body;
    const sweet = await Sweet_1.default.create({
        name,
        category,
        price,
        quantity,
        description,
        imageUrl,
    });
    return (0, response_1.sendSuccess)(res, 201, 'Sweet added successfully', { sweet });
});
// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Protected
exports.getAllSweets = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sweets = await Sweet_1.default.find().skip(skip).limit(limit);
    const total = await Sweet_1.default.countDocuments();
    return (0, response_1.sendSuccess)(res, 200, 'Sweets fetched successfully', {
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
exports.searchSweets = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        query.category = category;
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = Number(minPrice);
        if (maxPrice)
            query.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet_1.default.find(query);
    return (0, response_1.sendSuccess)(res, 200, 'Search results', { sweets });
});
// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Protected
exports.updateSweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, category, price, quantity, description, imageUrl } = req.body;
    const sweet = await Sweet_1.default.findByIdAndUpdate(id, { name, category, price, quantity, description, imageUrl }, { new: true, runValidators: true });
    if (!sweet) {
        return (0, response_1.sendError)(res, 404, 'Sweet not found');
    }
    return (0, response_1.sendSuccess)(res, 200, 'Sweet updated successfully', { sweet });
});
// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Protected (Admin only)
exports.deleteSweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const sweet = await Sweet_1.default.findByIdAndDelete(id);
    if (!sweet) {
        return (0, response_1.sendError)(res, 404, 'Sweet not found');
    }
    return (0, response_1.sendSuccess)(res, 200, 'Sweet deleted successfully', { sweet });
});
// @desc    Purchase sweet (decrease quantity)
// @route   POST /api/sweets/:id/purchase
// @access  Protected
exports.purchaseSweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return (0, response_1.sendError)(res, 400, 'Quantity must be greater than 0');
    }
    const sweet = await Sweet_1.default.findById(id);
    if (!sweet) {
        return (0, response_1.sendError)(res, 404, 'Sweet not found');
    }
    if (sweet.quantity < quantity) {
        return (0, response_1.sendError)(res, 400, 'Insufficient stock available');
    }
    sweet.quantity -= quantity;
    await sweet.save();
    return (0, response_1.sendSuccess)(res, 200, 'Purchase successful', { sweet });
});
// @desc    Restock sweet (increase quantity)
// @route   POST /api/sweets/:id/restock
// @access  Protected (Admin only)
exports.restockSweet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return (0, response_1.sendError)(res, 400, 'Quantity must be greater than 0');
    }
    const sweet = await Sweet_1.default.findById(id);
    if (!sweet) {
        return (0, response_1.sendError)(res, 404, 'Sweet not found');
    }
    sweet.quantity += quantity;
    await sweet.save();
    return (0, response_1.sendSuccess)(res, 200, 'Restock successful', { sweet });
});
//# sourceMappingURL=sweetController.js.map