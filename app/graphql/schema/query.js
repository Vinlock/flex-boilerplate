import {
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';

/**
 * RootQuery
 * @type {GraphQLObjectType}
 */
const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Query',
  fields: {
    test: {
      type: GraphQLBoolean,
      resolve: () => true,
    },
  },
});

export default Query;
