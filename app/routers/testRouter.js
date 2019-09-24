import { Router } from 'express';
import middleware from '../lib/ExpressMiddleware';

const testRouter = Router();

testRouter.use(middleware({
  logging: true,
  requestIdGenerator: true,
}));

testRouter.get('/', (req, res) => {
  res.status(200).json({
    ping: 'pong',
  });
});

export default testRouter;
