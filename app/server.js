import app from './express';

const { APP_PORT } = process.env;

app.runServer(APP_PORT || 4000)
  .then(() => {
    console.log('Server started');
  });
