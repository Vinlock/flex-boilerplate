import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import Query from './query';
import RootMutation from './mutations';
import ExpectedError from '../utils/ExpectedError'

const errorMiddleware = async (resolve, root, args, context, info) => {
  try {
    return await resolve(root, args, context, info);
  } catch (err) {
    if (err instanceof ExpectedError) {
      return {
        errorCode: err.message,
        errorDesc: err.errorDesc ? err.errorDesc : null,
        csCode: err.csCode ? err.csCode : null,
      };
    }
    throw err;
  }
};

const schema = new GraphQLSchema({
  query: Query,
  mutation: RootMutation,
});

export default applyMiddleware(schema, errorMiddleware);