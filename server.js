const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  let filepond = req.files.filepond;

  // TODO: create files folder if it is not exist
  filepond.mv(`./files/${filepond.name}`, function(err) {
    if (err) return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.use(express.static('public'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
