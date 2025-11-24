import { Router } from 'express';
import {
  getOrdersByCustomer,
  createOrder,
  getCustomerRevenue,
  getAllOrders
} from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware)
router.get('/', getAllOrders);
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/customer/:customerId/revenue', getCustomerRevenue);
router.post('/', createOrder);

export default router;
