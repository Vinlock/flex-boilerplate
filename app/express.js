import http from 'http';
import express from 'express';
import helmet from 'helmet';
import routers from './routers';

/** ENVIRONMENT VARIABLES */
const {
  APP_DISABLE_HELMET,
  APP_DISABLE_HELMET_HSTS,
  APP_DISABLE_HELMET_CACHE_CONTROL,
  APP_DISABLE_HELMET_CROSS_DOMAIN,
  APP_DISABLE_HELMET_HIDE_POWERED_BY,
} = process.env;

export default {
  /**
   * Run Express Server
   * @param {Number} [port=4000] Port
   */
  runServer: async (port = 4000) => {
    /**
     * Express Application
     * @type {Function|*}
     */
    const app = express();

    /** Middleware */
    // Helmet Middleware
    if (APP_DISABLE_HELMET !== 'true') {
      if (APP_DISABLE_HELMET_HSTS !== 'true') {
        app.use(helmet.hsts());
      }
      if (APP_DISABLE_HELMET_CACHE_CONTROL !== 'true') {
        app.use(helmet.noCache());
      }
      if (APP_DISABLE_HELMET_CROSS_DOMAIN !== 'true') {
        app.use(helmet.permittedCrossDomainPolicies());
      }
      if (APP_DISABLE_HELMET_HIDE_POWERED_BY !== 'true') {
        app.use(helmet.hidePoweredBy());
      }
    }

    /** Express Routers */
    routers(app);

    const server = http.createServer(app);
    return new Promise((resolve) => {
      server.listen(port, () => {
        console.log(`Client Server ready on Port ${port}.`);
        resolve(app);
      });
    });
  },
};