import db from '../../db/db';

const dbMiddleware = () => (req, res, next) => {
  req.db = db;
  next();
};