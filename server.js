const express = require('express');
const fileUpload = require('express-fileupload');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const fileRouter = require('./files');

const PORT = 3030;

const app = express();

app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());
app.use(
  cookieSession({
    name: 'session',
    keys: ['auth'],
  })
);

app.use('/file', fileRouter);

app.listen(PORT, () => console.log(`Server host on http://localhost:${PORT}!`));
