import express from 'express';
import { addToCart, clearCart, getCartItems, removeCartItem } from '@/controllers/cart.controller';
import { isAuthenticated } from '@/middlewares/auth/isAuthenticated';
import { updateAccessToken } from '@/controllers/user.controller';

const router = express.Router();

router.post('/add-to-cart', updateAccessToken, isAuthenticated, addToCart);

router.post('/clear-cart', updateAccessToken, isAuthenticated, clearCart);

router.get('/cart-items', updateAccessToken, isAuthenticated, getCartItems);

router.delete('/remove-item', updateAccessToken, isAuthenticated, removeCartItem);

export default router;
