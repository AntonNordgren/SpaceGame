const express = require('express');
const path = require('path');

const app = express();
const port = process.env.port || 9001;

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log('Listening on port', port);
app.listen(port);