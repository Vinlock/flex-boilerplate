import cors from 'cors';

const corsMiddleware = () => cors((req, callback) => {
  callback(null, true);
});

export default corsMiddleware;
