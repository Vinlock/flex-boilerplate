import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString, GraphQLInt
} from 'graphql'

const User = new GraphQLObjectType({
  name: 'User',
  description: 'Base user information',
  fields: () => ({
    username: {
      type: GraphQLNonNull(GraphQLString),
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    discriminator: {
      type: GraphQLNonNull(GraphQLInt),
    },
    fullUsername: {
      type: GraphQLNonNull(GraphQLString),
      resolve: async (parent) => {
        const { username, discriminator } = parent;
        return `${username}#${discriminator}`;
      },
    }
  }),
})

export default User;
