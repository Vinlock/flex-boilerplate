import createMongo from '../utils/createMongo';

const { APP_MONGO_DATABASE } = process.env;

const db = createMongo(APP_MONGO_DATABASE);

export default db;
