import {
  GraphQLEnumType, GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull,
} from 'graphql';
import * as yup from 'yup';
import utils from '../schema/mutations/utils';
import ErrorType from '../schema/types/ErrorType';
import ResponseType from '../schema/types/ResponseType';
import ExpectedError from '../utils/ExpectedError';

/**
 * @typedef {object} ErrorCode
 * @property {string} code Error Code
 * @property {string} desc Error Description
 * @property {string} value Error Internal Value
 */

/**
 *
 * @param {object} options Options
 * @param {string} options.name Name
 * @param {string} options.desc Description
 * @param {boolean} [options.requireAuth=false] Require Authentication
 * @param {object} options.error Error Options
 * @param {Array<ErrorCode>} options.error.codes Error Codes
 * @param {boolean} [options.error.includeCommonCodes=true] Include Common Error Codes
 * @param {object} options.response Response Options
 * @param {string} options.response.desc Response Description
 * @param {object} options.response.fields Response GraphQL Fields
 * @param {object} options.input Input Options
 * @param {string} options.input.desc Input Description
 * @param {object} options.input.fields GraphQL Input Fields
 * @param {boolean} [options.input.isNullable=false] Input Field is Nullable
 * @param {Function} options.resolve Resolver
 */
const createMutation = (options) => {
  const {
    string, object, array, boolean, mixed,
  } = yup;
  const schema = object().shape({
    name: string().required(),
    desc: string(),
    error: object().shape({
      includeCommonCodes: boolean().default(true),
      codes: array().of(object().shape({
        code: string().required(),
        desc: string().required(),
      })).default([]),
    }),
    response: object().shape({
      description: string(),
      fields: object().required(),
    }),
    input: object().shape({
      desc: string(),
      fields: object(),
      isNullable: boolean().default(false),
    }),
    resolve: mixed().required(),
  });

  if (!schema.isValidSync(options)) {
    throw new Error('INVALID_MUTATION_CONFIG');
  }

  options = schema.cast(options);

  const name = options.name.replace(' ', '');
  const description = options.desc;

  // Error Codes
  let errorCodes = {};
  options.error.codes.forEach((errorCode) => {
    errorCodes[errorCode.code] = {
      description: errorCode.desc,
      value: errorCode.value,
    };
  });
  if (options.error.includeCommonCodes) {
    errorCodes = {
      ...errorCodes,
      ...utils.commonErrorCodes,
    };
  }
  const errorCodesType = new GraphQLEnumType({
    name: `${name}ErrorCodes`,
    values: errorCodes,
  });

  // Create Error Type
  const errorType = ErrorType(`${name}Error`, errorCodesType);

  // Create Response Type
  const responseType = new GraphQLObjectType({
    name: `${name}Response`,
    description: options.response.desc,
    fields: options.response.fields,
  });

  // Response Type
  const mutation = ResponseType({
    name: `${name}Mutation`,
    description,
    responseType,
    errorType,
  });

  const input = new GraphQLInputObjectType({
    name: `${name}Input`,
    description: options.input.desc,
    fields: options.input.fields,
  });

  return {
    type: mutation,
    description,
    args: {
      input: {
        type: (options.input.isNullable) ? input : new GraphQLNonNull(input),
      },
    },
    resolve: options.requireAuth ? async (p, a, c, i) => {
      if (!c.request.user) throw new ExpectedError('INVALID_SESSION');
      return options.resolve(p, a, c, i);
    } : options.resolve,
  };
};

export default createMutation;