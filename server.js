const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const bodyParser = require('body-parser');

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

app.listen(3000, () => console.log('Example app listening on port 3000!'));
