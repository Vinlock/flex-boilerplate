import createMongo from '../../utils/createMongo';

const db = createMongo('dev');

const dbMiddleware = () => (req, res, next) => {
  req.db = db;
  next();
};