import app from './express';

const { APP_PORT, APP_ADMIN_PORT } = process.env;

app.runServer(APP_PORT || 4000)
  .then(() => {
    console.log('Server started');
  });
