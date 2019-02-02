const express = require('express');
const path = require('path');

const app = express();
const port = process.env.port || 9001;

app.use(express.static(__dirname));

app.get('/*', (req, res) => {
    res.sendFile('index.html');
});

console.log('Listening on port', port);
app.listen(port);