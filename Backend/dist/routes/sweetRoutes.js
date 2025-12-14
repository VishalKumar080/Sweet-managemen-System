"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sweetController_1 = require("../controllers/sweetController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.protect);
// Sweet CRUD routes
router.post('/', sweetController_1.addSweet);
router.get('/', sweetController_1.getAllSweets);
router.get('/search', sweetController_1.searchSweets);
router.put('/:id', sweetController_1.updateSweet);
router.delete('/:id', auth_1.adminOnly, sweetController_1.deleteSweet);
// Inventory routes
router.post('/:id/purchase', sweetController_1.purchaseSweet);
router.post('/:id/restock', auth_1.adminOnly, sweetController_1.restockSweet);
exports.default = router;
//# sourceMappingURL=sweetRoutes.js.map