var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

const FILE_ROOT_PATH = './files/';

if (!fs.existsSync(FILE_ROOT_PATH)) {
  fs.mkdirSync(FILE_ROOT_PATH, 0744);
}

// Use very simple way to manage access
// before run server, we need to put the password into the file /apps/password
let password;
fs.readFile('/apps/password', 'utf8', function(err, data) {
  if (err) {
    // Set a default password for local
    password = 'admin';
  } else {
    password = data.replace(/[\n\r]/g, '');
  }
});

function loginSuccess(req) {
  return req.body.password === password;
}

function getUniqueFilename(filename) {
  return filename;
}

function getFilePath(filename) {
  return `./files/${filename}`;
}

function isAuth(req) {
  return req.session.auth;
}

function setAuth(req, auth) {
  req.session.auth = true;
}

router.get('/', function(req, res, next) {
  if (isAuth(req)) {
    next();
  } else {
    res.redirect(req.originalUrl + 'login');
  }
});

router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/login.html'));
});

router.post('/login', function(req, res) {
  if (loginSuccess(req)) {
    setAuth(req, true);
    res.redirect(req.originalUrl.replace('/login', ''));
  } else {
    res.redirect(req.originalUrl);
  }
});

router.use(function(req, res, next) {
  if (isAuth(req)) {
    next();
  } else {
    res.status(401).send('');
  }
});

router.get('/filelist', function(req, res) {
  fs.readdir(FILE_ROOT_PATH, function(err, items) {
    if (err) return res.status(500).send(err);

    res.send(
      items.filter(item => !/(^|\/)\.[^\/\.]/g.test(item)).map(item => ({
        filename: item,
      }))
    );
  });
});

router.get('/download/:filename', function(req, res) {
  res.download(getFilePath(req.params.filename));
});

router.post('/upload', function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  const filepond = req.files.filepond;

  // TODO: create files folder if it is not exist
  const filename = getUniqueFilename(filepond.name);
  filepond.mv(getFilePath(filename), function(err) {
    if (err) return res.status(500).send(err);

    res.send(filename);
  });
});

router.delete('/upload', function(req, res) {
  const filename = req.body;

  fs.unlink(getFilePath(filename), function(err) {
    if (err) return res.status(500).send(err);

    res.send('success!');
  });
});

router.use(express.static('public'));

module.exports = router;
