import { GraphQLObjectType } from 'graphql';
import createAccount from './createAccount';

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutations',
  fields: () => ({
    createAccount,
  }),
});

export default RootMutation;
