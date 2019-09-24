import uuid from 'uuid/v4';

/**
 * Server Request ID Generator
 * @returns {function(*, *, *): *}
 */
const requestIdMiddleware = () => (req, res, next) => {
  req.serverRequestId = uuid();
  res.set({ 'X-Server-Request-Id': req.serverRequestId });
  return next();
};

export default requestIdMiddleware;