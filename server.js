const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const bodyParser = require('body-parser');

const PORT = 3000;
const FILE_ROOT_PATH = './files/';

const app = express();

app.use(bodyParser.text({ type: 'text/plain' }));

// default options
app.use(fileUpload());

function getUniqueFilename(filename) {
  return filename;
}

function getFilePath(filename) {
  return `./files/${filename}`;
}

app.get('/filelist', function(req, res) {
  fs.readdir(FILE_ROOT_PATH, function(err, items) {
    if (err) return res.status(500).send(err);

    res.send(
      items.filter(item => !/(^|\/)\.[^\/\.]/g.test(item)).map(item => ({
        filename: item,
      }))
    );
  });
});

app.get('/download/:filename', function(req, res) {
  res.download(getFilePath(req.params.filename));
});

app.post('/upload', function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  const filepond = req.files.filepond;

  // TODO: create files folder if it is not exist
  const filename = getUniqueFilename(filepond.name);
  filepond.mv(getFilePath(filename), function(err) {
    if (err) return res.status(500).send(err);

    res.send(filename);
  });
});

app.delete('/upload', function(req, res) {
  const filename = req.body;

  fs.unlink(getFilePath(filename), function(err) {
    if (err) return res.status(500).send(err);

    res.send('success!');
  });
});

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server host on http://localhost:${PORT}!`));
