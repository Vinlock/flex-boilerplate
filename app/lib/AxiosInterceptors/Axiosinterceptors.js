/**
 * Apply Axios Interceptors
 * @param {Object} instance Axios instance
 * @param {Logger} logger Logger Instance
 * @param {String} label Label
 * @return void
 */
export default (instance, logger, label = null) => {
  /**
   * Get Log Type with Label
   * @param {String} logType Log Type
   * @returns {String}
   * @private
   * @function
   */
  const _type = (logType) => {
    if (label !== null) {
      return `${label}.${logType}`;
    }
    return logType;
  };

  /**
   * Log Requests
   * @param {AxiosRequestConfig} request Axios Request
   * @returns {AxiosRequestConfig}
   * @private
   * @function
   */
  const _logRequest = (request) => {
    // Build Request Log
    const requestLog = {
      timeout: request.timeout || null,
      headers: request.headers || null,
      method: request.method || null,
      baseURL: request.baseURL || null,
      path: request.url || null,
      url: `${request.baseURL}${request.url}` || null,
      params: request.params || null,
    };

    // If data exists then parse it out.
    if (request.data) {
      try {
        requestLog.data = JSON.parse(request.data);
      } catch (err) {
        requestLog.data = request.data || null;
      }
    }

    // Log out the request
    logger.log(_type('request'), {
      request: requestLog,
    });

    // Return the request
    return request;
  };

  /**
   * Log Request Errors
   * @param {Promise} error Request Error
   * @param {AxiosResponse} error.response Axios Response
   * @param {AxiosRequestConfig} error.request Axios Request Config
   * @returns {Promise}
   * @private
   * @function
   */
  const _logRequestError = (error) => {
    // Build Request Error Log
    const requestErrorLog = {
      response: {
        data: error.response.data || null,
        status: error.response.status || null,
        headers: error.response.headers || null,
      },
      request: {
        headers: error.request.headers || null,
        url: error.request.url || null,
        data: error.request.data || null,
      },
      error: {
        message: error.message || null,
      },
    };

    // Log Request Error
    logger.err(_type('request.error'), {
      error: requestErrorLog,
    });

    // Return the originally rejected promise.
    return Promise.reject(error);
  };

  /**
   * Log Responses
   * @param {AxiosResponse} response Axios Response
   * @returns {AxiosResponse}
   * @private
   * @function
   */
  const _logResponse = (response) => {
    // Build Response Log
    const responseLog = {
      response: {
        status: response.status || null,
        statusText: response.statusText || null,
        headers: response.headers || null,
        data: response.data || null,
        time: response.time || null,
      },
      request: {
        headers: response.request.headers || null,
        method: response.config.method || null,
        baseURL: response.config.baseURL || null,
        url: response.config.url || null,
        data: response.config.data || null,
      },
    };

    // Log Response
    logger.log(_type('response'), {
      response: responseLog,
    });

    // Return original response
    return response;
  };

  /**
   * Log Response Errors
   * @param {Promise} error Response Error
   * @param {AxiosResponse} error.response Axios Response
   * @param {AxiosRequestConfig} error.config Axios Request
   * @param {AxiosRequestConfig} error.request Axios Request
   * @returns {Promise}
   * @private
   * @function
   */
  const _logResponseError = (error) => {
    // Build Response Error Log
    const responseErrorLog = {};

    if (error.response !== undefined) {
      responseErrorLog.response = {
        data: error.response.data || null,
        status: error.response.status || null,
        headers: error.response.headers || null,
        time: error.response.time || null,
      };
    }

    responseErrorLog.request = {};
    if (error.request) {
      responseErrorLog.request = {
        headers: error.request.headers || error.config.headers || null,
        host: error.config.baseURL || null,
        url: error.config.url || null,
        path: error.request.path || null,
        method: error.config.method || null,
        timeout: error.config.timeout || null,
      };
      try {
        responseErrorLog.request.data = JSON.parse(error.config.data);
      } catch (err) {
        responseErrorLog.request.data = error.config.data || null;
      }
    }

    responseErrorLog.error = {
      message: error.message || null,
    };

    // Log Response Errors
    logger.err(_type('response.error'), {
      error: responseErrorLog,
    });

    // Return originally rejected Promise.
    return Promise.reject(error);
  };

  // Implement Axios Interceptors
  instance.interceptors.request.use(_logRequest, _logRequestError);
  instance.interceptors.response.use(_logResponse, _logResponseError);
};