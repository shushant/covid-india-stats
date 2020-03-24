var express = require("express");
var path = require("path");
var history = require("connect-history-api-fallback");

app = express();

const cheerio = require('cheerio');
const TableParser = require('cheerio-tableparser');
const axios = require('axios');

app.use("/", express.static(path.join(__dirname + "/dist")));

var port = process.env.PORT || 5000;

app.get('/analytics', async(req, res) => {

  let body = await axios.get('https://www.mohfw.gov.in/',{ responseType: 'arraybuffer' })
  var buffer = new Buffer(body.data, 'binary');
  const $ = cheerio.load(buffer.toString());

  TableParser($);
  let dataSets = $('#cases .table-responsive').parsetable(true, true, true)
  let stats = [];
  for (let i=1; i < dataSets[0].length; i++){
    stats.push({
      'state': dataSets[1][i],
      confirmed_india: dataSets[2][i],
      confirmed_foreign: dataSets[3][i],
      cured: dataSets[4][i],
      death: dataSets[5][i]
    })
  }
  
  res.json(stats)
})
app.use(
    history({
      index: "/"
    })
  );

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

app.listen(port);
console.log("server started " + port);
