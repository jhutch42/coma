// server.js
const express = require('express');

// Define Express App
const app = express();
app.use(express.static('./src/public'));
app.use('/echarts', express.static(__dirname + './node_modules/echarts'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Server connected at:', PORT);
});
