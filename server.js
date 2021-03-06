// server.js
const express = require('express');
const https = require('https')
const JobManager = require('./customModules/jobManager');
const req = require('express/lib/request');


// Define Express App
const app = express();
app.use(express.json())
app.use(express.static('./src/public'));
app.use('/echarts', express.static(__dirname + './node_modules/echarts'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server connected at:', PORT);
});

const JM = new JobManager();

app.post('/', function (req, res) {
  res.set({
     "Content-Type": "application/json",
     "Access-Control-Allow-Origin": "*",
  });
  const data = JM.addJob(req.body);
  res.end(JSON.stringify({response: data}));
});

app.get('/', function (req, res) {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  const data = handleIncomingPost(req.body);
  res.end(JSON.stringify({ response: data }));
});