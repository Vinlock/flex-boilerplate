const {
  APP_DEBUG_MODE,
  APP_CLIENT_IP_OVERRIDE,
} = process.env;

const ipFromRequest = (request) => {
  // Get IP Address
  let ip = (APP_DEBUG_MODE !== 'true' && APP_CLIENT_IP_OVERRIDE && APP_CLIENT_IP_OVERRIDE !== '') ? request.connection.remoteAddress : APP_CLIENT_IP_OVERRIDE;
  if (Object.prototype.hasOwnProperty.call(request.headers, 'x-forwarded-for')) {
    ip = request.headers['x-forwarded-for'].split(',')[0].trim();
  }
  return ip;
};

export default ipFromRequest;