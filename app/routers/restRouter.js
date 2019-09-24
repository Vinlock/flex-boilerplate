import { Router } from 'express';
import middleware from '../lib/ExpressMiddleware';

const restRouter = Router();

restRouter.use(middleware({
  cors: true,
  jsonParser: true,
  urlEncodedParser: true,
  requestIdGenerator: true,
  logging: 'rest_api',
}));

restRouter.get('/test', async (req, res) => res.json({ ping: 'pong' }));

export default restRouter;