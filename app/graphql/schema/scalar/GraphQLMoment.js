import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import moment from 'moment';

const DEFAULT_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const GraphQLMoment = new GraphQLObjectType({
  name: 'GraphQLMoment',
  description: 'GraphQL Moment Extension',
  fields: {
    format: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Format Function\nhttps://momentjs.com/docs/#/displaying/format/',
      args: {
        format: {
          type: GraphQLString,
          description: 'Output Date Format',
          defaultValue: DEFAULT_FORMAT,
        },
      },
      resolve: (parentValue, args) => {
        const { date, fromFormat } = parentValue;
        const { format } = args;
        return moment(date, fromFormat).format(format);
      },
    },
    timeFromNow: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Time from now\nhttps://momentjs.com/docs/#/displaying/fromnow/',
      args: {
        withoutSuffix: {
          type: GraphQLBoolean,
          defaultValue: false,
        },
      },
      resolve: (parentValue, args) => {
        const { date, fromFormat } = parentValue;
        const { withoutSuffix } = args;
        return moment(date, fromFormat).fromNow(withoutSuffix);
      },
    },
    timeFromX: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Time from X\nhttps://momentjs.com/docs/#/displaying/from/',
      args: {
        X: {
          type: GraphQLString,
          defaultValue: 'NOW',
        },
        withoutSuffix: {
          type: GraphQLBoolean,
          defaultValue: false,
        },
      },
      resolve: (parentValue, args) => {
        const { date, fromFormat } = parentValue;
        const { withoutSuffix } = args;
        let { X } = args;
        if (X === 'NOW') X = moment();
        return moment(date, fromFormat).from(X, withoutSuffix);
      },
    },
    // difference: {
    //   type: GraphQLNonNull(GraphQLInt),
    //   description: 'Difference\nhttps://momentjs.com/docs/#/displaying/difference/',
    //   args: {
    //     from: {
    //       type: GraphQLString,
    //       defaultValue: 'NOW',
    //     },
    //     measurement: {
    //       type: TimeMeasurement,
    //       defaultValue: 'DAYS',
    //     },
    //     float: {
    //       type: GraphQLBoolean,
    //       defaultValue: false,
    //     },
    //   },
    //   resolve: (parentValue, args) => {
    //     const { date, fromFormat } = parentValue;
    //     const { measurement, float } = args;
    //     let { from } = args;
    //     if (from === 'NOW') from = moment();
    //     return moment(date, fromFormat).diff(from, measurement, float);
    //   },
    // },
    unixTimestamp: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'UNIX Timestamp (Seconds)\nhttps://momentjs.com/docs/#/displaying/unix-timestamp/',
      args: {
        milliseconds: {
          type: GraphQLBoolean,
          defaultValue: false,
        },
      },
      resolve: (parentValue, args) => {
        const { date, fromFormat } = parentValue;
        const { milliseconds } = args;
        const dateInstance = moment(date, fromFormat);
        if (milliseconds) {
          return dateInstance.valueOf();
        }
        return dateInstance.unix();
      },
    },
  },
});

export default GraphQLMoment;