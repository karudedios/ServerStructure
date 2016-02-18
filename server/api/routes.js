import { Router } from 'express';
import UserRoutes from './User/routes';
import ProductRoutes from './Product/routes';

export default Router()
	.use('/user', UserRoutes)
	.use('/product', ProductRoutes);
