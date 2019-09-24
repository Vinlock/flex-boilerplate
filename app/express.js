import http from 'http';
import express from 'express';
import helmetMiddleware from './lib/ExpressMiddleware/helmetMiddleware';
import routers from './routers';

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

    /** Helmet Middleware */
    app.use(helmetMiddleware());

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