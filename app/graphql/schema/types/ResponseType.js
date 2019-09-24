import { GraphQLUnionType } from 'graphql';
import * as yup from 'yup';

/**
 * Response Type
 * @param {Object} options Options
 * @param {String} options.name Type Name
 * @param {String} options.description Type Decsription
 * @param {Object} options.responseType Response Type
 * @param {Object} options.errorType Error Type
 * @function
 */
const ResponseType = (options) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    responseType: yup.mixed().required(),
    errorType: yup.mixed().required(),
  });

  schema.validateSync(options);

  return new GraphQLUnionType({
    name: options.name,
    description: options.description,
    types: [ options.responseType, options.errorType ],
    resolveType: (value) => {
      if (Object.prototype.hasOwnProperty.call(value, 'errorCode')) {
        return options.errorType;
      }
      return options.responseType;
    }
  });
};

export default ResponseType;