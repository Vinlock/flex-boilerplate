import NoIntrospection from 'graphql-disable-introspection';
import { Router } from 'express';
import graphqlHTTP from 'express-graphql';
import graphqlPlayground from 'graphql-playground-middleware-express';
import { schema } from '../graphql';
import middleware from '../lib/ExpressMiddleware';

const {
  APP_GRAPHQL_ENABLE_INTROSPECTION,
  APP_GRAPHQL_ENABLE_GRAPHIQL,
  APP_GRAPHIQL_POLLING_INTERVAL,
} = process.env;

const graphQLRouter = Router();

graphQLRouter.options('*', middleware({
  cors: true,
  logging: 'graphql',
  requestIdGenerator: true,
}));

// Establish GraphQL Validation Rules
const validationRules = [];
if (APP_GRAPHQL_ENABLE_INTROSPECTION !== 'true') {
  validationRules.push(NoIntrospection);
}

// Attach GraphQL Express
graphQLRouter.post(
  '/',
  middleware({
    cors: true,
    jsonParser: true,
    urlEncodedParser: true,
    requestIdGenerator: true,
    logging: 'graphql',
  }),
  graphqlHTTP(request => ({
    schema,
    customFormatErrorFn: (err) => {
      request.logger.log('graphql.error', err);
      return err;
    },
    graphiql: false,
    context: {
      request,
    },
    validationRules,
  })),
);

// GraphiQL Playground
if (APP_GRAPHQL_ENABLE_GRAPHIQL === 'true') {
  graphQLRouter.get(
    '/',
    middleware({
      requestIdGenerator: true,
      logging: 'graphiql',
    }),
    graphqlPlayground({
      endpoint: '/gql',
      settings: {
        'schema.polling.interval': APP_GRAPHIQL_POLLING_INTERVAL !== undefined ? Number(APP_GRAPHIQL_POLLING_INTERVAL) : 1000,
      },
    }),
  );
}

// On Error
graphQLRouter.use((err, req, res) => res.status(500).json({
  code: err.code || null,
  message: err.message || null,
}));

export default graphQLRouter;