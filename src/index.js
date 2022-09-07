const express = require('express');
const app = express();

require('./database');

app.use(express.json());

app.use('/api', require('./routes/index'));

app.listen(4000);

console.log('Server on port: ', 4000);