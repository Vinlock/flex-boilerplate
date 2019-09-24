import { Router } from 'express';
import middleware from '../lib/ExpressMiddleware';

const notFoundRouter = Router();

// Tracks and Logs Not Found Requests
notFoundRouter.use(middleware({
  requestIdGenerator: true,
  logging: true,
}));

notFoundRouter.use((req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

export default notFoundRouter;
