import Logger from '../Logger/Logger';
import Utilities from '../Utilities';

/* todo: this needs documentation */

/**
 * Logs the Server Request ID
 * @param request
 */
const logServerRequestId = (request) => {
  if (Object.prototype.hasOwnProperty.call(request, 'serverRequestId')) {
    request.logger.addMetadata('serverRequestId', request.serverRequestId);
  }
};

/**
 * Logs the Express Request
 * @param request
 */
const logRequest = (request) => {
  if (Object.prototype.hasOwnProperty.call(request.headers, 'x-request-id')) {
    request.logger.addMetadata('clientRequestId', request.headers['x-request-id']);
  }

  request.logger.log('client.request', {
    headers: request.headers,
    method: request.method,
    params: request.params || request.parameters,
    query: request.query,
    body: request.body,
    path: request.path,
    signedCookies: request.signedCookies,
    originalUrl: request.originalUrl,
    url: request.url,
    protocol: request.protocol,
    baseUrl: request.baseUrl,
    ip: Utilities.ipFromRequest(request),
    route: request.route,
    secure: request.secure,
  });
};

/**
 * Logs the Express Response
 * @param request
 * @param response
 */
const logResponse = (request, response) => {
  // On finish, commit logs
  response.on('finish', () => {
    request.logger.log('client.response', {
      body: response.body,
      headers: response.getHeaders(),
      status: response.statusCode,
    });
  });

  const oldWrite = response.write;
  const oldEnd = response.end;
  const chunks = [];

  // Proxy res.write
  response.write = function (...args) {
    chunks.push(Buffer.from(args[0]));
    oldWrite.apply(response, args);
  };

  // Proxy res.end
  response.end = function(...args) {
    if (args[0]) {
      chunks.push(Buffer.from(args[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');
    let jsonBody = null;
    try {
      jsonBody = JSON.parse(body);
    } catch (err) {
      jsonBody = body || null;
    }

    response.body = jsonBody;
    oldEnd.apply(response, args);
  };
};

/**
 * IF buGSNAG
 * @param request
 */
const bugsnagLogging = (request) => {
  if (Object.hasOwnProperty.call(request, 'bugsnag')) {
    request.bugsnag.config.beforeSend.push((report) => {
      request.logger.log('bugsnag.report', report);
    });
  }
};

const logMiddleware = (name = null, options = {}) => (req, res, next) => {
  const defaults = {
    withRequestAndResponse: true,
    withBugsnag: true,
  };

  options = { ...defaults, ...options };

  // Get and set logger
  req.logger = new Logger({ name });

  // Log Request ID to Log MetaData
  logServerRequestId(req);

  if (options.withRequestAndResponse) {
    // Log Request
    logRequest(req);

    // On Complete
    logResponse(req, res);
  }

  if (options.withBugsnag) {
    // Bugsnag logging
    bugsnagLogging(req);
  }

  return next();
};

export default logMiddleware;