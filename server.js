const express = require('express');

const path = require('path');
// const port = process.env.PORT || '0.0.0.0' || 9001;

const app = express();

// app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.static(__dirname + '/node_modules/@orange-games/phaser-input/build/phaser-input.js/'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, '0.0.0.0', function(err) {
  console.log("Started listening on %s", app.url);
});