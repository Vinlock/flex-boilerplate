import winston from 'winston';
import stringify from 'json-stringify-safe';
import CloudWatchTransport from 'winston-aws-cloudwatch';
import os from 'os';

// ENVIRONMENT VARIABLES
const {
  APP_LOGGING_CLOUDWATCH_ENABLE,
  APP_LOGGING_CLOUDWATCH_LOG_GROUP_NAME,
  AWS_REGION,
  APP_DEBUG_MODE,
} = process.env;
let { APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME } = process.env;

if (!APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME || APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME === '') {
  APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME = os.hostname();
}

/**
 * Logger Class
 */
class Logger {
  /**
   * CloudWatch Transport for Winston
   * @returns {CloudWatchTransport}
   * @function
   * @private
   */
  _cloudWatchTransport = () => {
    if (!APP_LOGGING_CLOUDWATCH_LOG_GROUP_NAME) {
      throw new Error('LOGGING_CLOUDWATCH_LOG_GROUP_NAME is undefined. It must be defined if CloudWatch is enabled.');
    }
    if (!APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME) {
      throw new Error('LOGGING_CLOUDWATCH_LOG_STREAM_NAME is undefined. It must be defined if CloudWatch is enabled.');
    }
    return new CloudWatchTransport({
      logGroupName: APP_LOGGING_CLOUDWATCH_LOG_GROUP_NAME,
      logStreamName: APP_LOGGING_CLOUDWATCH_LOG_STREAM_NAME,
      createLogGroup: true,
      createLogStream: true,
      formatLog: this._logFormat(),
      awsConfig: {
        region: AWS_REGION,
      },
    });
  };

  /**
   * Log Format Function for Winston
   * @returns {function(*): string}
   * @private
   * @function
   */
  _logFormat = () => (info) => {
    let { message } = info;
    message = stringify(message);
    let formattedMessage = `${info.level}: ${message}`;
    if (this.name !== null) {
      formattedMessage = `${this.name} - `.concat(formattedMessage);
    }
    return formattedMessage;
  };

  /**
   * Update the Log Name
   * @param name
   * @function
   * @public
   */
  updateName = (name) => {
    this.name = name;
  };

  /**
   * Logger Constructor
   * @param {Object} options Logger Options
   * @param {String|null} [options.name=null] Logger Default Name
   * @param {Object} [options.metadata={}] Logger Default MetaData
   * @param {Array<function>} [options.transports=[]] Logger Winston Transports
   * @param {Boolean} [options.disableConsoleLog=false] Disable Console Log Transport in Winston
   * @constructor
   */
  constructor(options) {
    if (typeof options === 'string') {
      this.name = options;
    } else {
      const defaults = {
        name: null,
        metadata: {},
        transports: [],
        disableConsoleLog: false,
      };
      options = Object.assign(defaults, options);
      this.metadata = Object.assign(defaults.metadata, options.metadata);
      this.name = options.name;
    }
    this.debugMode = APP_DEBUG_MODE === 'true';

    // Console Log Transport
    if (!options.disableConsoleLog) {
      const consoleTransport = new winston.transports.Console();
      if (!options.transports.includes(consoleTransport)) {
        options.transports.push(consoleTransport);
      }
    }

    this.winston = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.printf(this._logFormat())),
      transports: [
        ...options.transports,
      ],
    });

    if (APP_LOGGING_CLOUDWATCH_ENABLE === 'true') {
      this.winston.add(this._cloudWatchTransport());
    }
  }

  /**
   * Add Metadata
   * @param {String} key Metadata Key
   * @param {*} value Metadata Value
   * @returns {Logger}
   * @public
   * @function
   */
  addMetadata = (key, value) => {
    if (typeof key === 'object') {
      this.metadata = Object.assign(this.metadata, key);
    } else {
      this.metadata[String(key)] = value;
    }
    return this;
  };

  /**
   * Remove Metadata
   * @param {String} key Metadata Key
   * @returns {Logger}
   * @public
   * @function
   */
  removeMetaData = (key) => {
    delete this.metadata[String(key)];
    return this;
  };

  /**
   * Message Format
   * @param {String} type Message Type
   * @param {*} message Message
   * @returns {{name: String, type: String, message: *, meta: *}}
   * @private
   * @function
   */
  _messageFormat = (type, message) => ({
    name: this.name,
    type,
    message,
    meta: this.metadata,
  });

  /**
   * Log Info
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  log = (type, message) => this.winston.log({
    level: 'info',
    message: this._messageFormat(type, message),
  });

  /**
   * Log Info
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  info = this.log;

  /**
   * Log Warn
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  warn = (type, message) => this.winston.log({
    level: 'warn',
    message: this._messageFormat(type, message),
  });

  /**
   * Log Error
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  error = (type, message) => this.winston.log({
    level: 'error',
    message: this._messageFormat(type, message),
  });

  /**
   * Log Error
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  err = this.error;

  /**
   * Log Debug Info (Only if DebugMode is on)
   * @param {String} type Log Type
   * @param {String} message Log Message
   * @returns {winston.Logger}
   * @public
   * @function
   */
  debug = (type, message) => {
    if (this.debugMode) {
      this.winston.log({
        level: 'info',
        message: this._messageFormat(type, message),
      });
    }
  };

  /**
   * Retrieve Winston Instance
   * @returns {winston.Logger | *}
   */
  getLogger = () => this.winston;
}

export default Logger;
