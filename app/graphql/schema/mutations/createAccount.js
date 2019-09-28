import { GraphQLNonNull, GraphQLString } from 'graphql'
import createMutation from '../../lib/createMutation';
import ExpectedError from '../../utils/ExpectedError'
import User from '../types/User';
import { User as UserModel } from '../../../db';

export default createMutation({
  name: 'CreateAccount',
  desc: 'Create a new user account.',
  error: {
    codes: [
      {
        code: 'PASSWORD_NO_MATCH',
        desc: 'Password and Confirm Password does not match.',
      },
    ],
  },
  input: {
    fields: {
      username: {
        type: GraphQLNonNull(GraphQLString),
        desc: 'Account Username',
      },
      password: {
        type: GraphQLNonNull(GraphQLString),
        desc: 'Account Password',
      },
      confirmPassword: {
        type: GraphQLNonNull(GraphQLString),
        desc: 'Account Confirm Password',
      },
      email: {
        type: GraphQLNonNull(GraphQLString),
        desc: 'Account E-Mail Address',
      },
    },
  },
  response: {
    type: User,
  },
  resolve: async (parent, args) => {
    const { username, password, confirmPassword, email } = args.input;
    if (password !== confirmPassword) {
      throw new ExpectedError('PASSWORD_NO_MATCH');
    }
    const user = await UserModel.createAccount(username, password, email);
    return {
      username: user.username,
      email: user.email,
      discriminator: user.discriminator,
    };
  },
});
