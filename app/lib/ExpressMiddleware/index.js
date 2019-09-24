import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import corsMiddleware from './corsMiddleware';
import logMiddleware from './logMiddleware';
import requestIdMiddleware from './requestIdMiddleware';
import Validation from '../Validation/Validation';

/**
 * Express Middleware Centralization
 * @param {Object} options Middleware Options
 * @param {Boolean} [options.jsonParser=false] Enable JSON Body Parser
 * @param {Boolean} [options.urlEncodedParser=false] Enable Body Parser
 * @param {Object|Boolean} [options.cookieParser=false] Enable Cookie Parser
 * @param {Boolean} [options.requestIdGenerator=false] Enable Request ID Generator
 * @param {Boolean|Object} [options.logging=false] Enable Logging
 * @param {String|null} [options.logging.name=null] Logging Options
 * @param {Boolean} [options.cors=false] Enable CORS
 * @returns {Array<Object>}
 */
export default (options = {}) => {
  const defaults = {
    jsonParser: false,
    urlEncodedParser: false,
    cookieParser: false,
    requestIdGenerator: false,
    logging: false,
    cors: false,
  };

  options = { ...defaults, ...options };

  const middleware = [];

  // JSON Body Parser
  if (options.jsonParser) middleware.push(bodyParser.json());

  // URL Encoded Body Parser
  if (options.urlEncodedParser) middleware.push(bodyParser.urlencoded({ extended: true }));

  // Cookie Parser
  if (options.cookieParser) {
    if (Validation.isObject(options.cookieParser)) {
      middleware.push(cookieParser(options.cookieParser));
    } else {
      middleware.push(cookieParser());
    }
  }

  // Request ID Generator
  if (options.requestIdGenerator) middleware.push(requestIdMiddleware());

  // Logging Middleware Instance
  if (options.logging) {
    if (Validation.isString(options.logging)) {
      middleware.push(logMiddleware(options.logging));
    } else if (Validation.isObject(options.logging)) {
      middleware.push(logMiddleware(options.logging.name, options.logging.options));
    } else {
      middleware.push(logMiddleware());
    }
  }

  // CORS Middleware
  if (options.cors) middleware.push(corsMiddleware());

  return middleware;
};