const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
    addToCart,
    getCart,
    updateItem,
    removeItem,
    checkout
} = require('../controllers/cartController');

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.put('/update/:productId', auth, updateItem);
router.delete('/remove/:productId', auth, removeItem);
router.post('/checkout', auth, checkout);

module.exports = router;