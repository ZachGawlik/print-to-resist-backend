const express = require('express');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];
const routes = require('./routes');

const app = express();
app.set('json spaces', 4);

app.use('/api', routes);

app.listen(config.server.port, () => {
  console.log(`Listening on port ${config.server.port}`);
});
