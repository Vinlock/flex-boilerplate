import { GraphQLObjectType } from 'graphql';

const RootMutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Mutations',
  fields: () => ({}),
});

export default RootMutation;
