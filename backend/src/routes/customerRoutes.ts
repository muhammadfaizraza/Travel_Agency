import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer } from '../controllers/customerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);

export default router;
