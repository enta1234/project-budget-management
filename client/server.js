const path = require('path');
const express = require('express');
require('dotenv').config({
  path: path.join(__dirname, '..', 'env', `${process.env.NODE_ENV || 'local'}.env`)
});

const app = express();
app.use(express.static(path.join(__dirname)));

const PORT = process.env.CLIENT_PORT || 8080;
app.listen(PORT, () => console.log(`Client running on port ${PORT}`));
