import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql';
import ResponseType from './ResponseType';

describe('ResponseType', function() {
  test('should create a union of two types', function() {
    const response = ResponseType({
      name: 'Test',
      description: 'Test',
      responseType: new GraphQLObjectType({
        name: 'TestResponse',
        fields: () => ({
          name: {
            type: GraphQLString,
          },
        })
      }),
      errorType: new GraphQLObjectType({
        name: 'TestError',
        fields: () => ({
          error: {
            type: GraphQLString,
          },
        }),
      })
    });

    return expect(response).toBeInstanceOf(GraphQLUnionType);
  });
});