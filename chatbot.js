let bodyParser = require('body-parser');
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbot",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = 3000;
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// INSERT INTO `in/out` (`input`, `output`) VALUES ('Hej', 'Hejsan! Jag är en chatbot. Hur mår du?');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Jag mår bra', 'Det är kul att höra att du mår bra');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Jag mår dåligt', 'Oj vad tråkigt att höra');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Hur mår du?', 'Som en chatbot har jag inga känslor, men om jag skulle kunna ha känslor så skulle jag antagligen att må bra');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Vem är du?', 'Jag är en chatbot som kan svara på dina frågor');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Vem är din favorit lärare på Åva?', 'Som en chatbot kan jag inte välja en favorit lärare, men om jag skulle kunna välja en favorit lärare så skulle jag välja Holger Rosencrantz');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Varför är du en chatbot', 'Jag vet inte');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('2+2', '4');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('1+1', '2');
// INSERT INTO `in/out` (`input`, `output`) VALUES ('Pi', '3.14159265359...');

let table = 
  (`
  <table>
  <thead>
    <tr>
      <th>Input</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Hej"</td>
    </tr>
    <tr>
      <td>"Jag mår bra"</td>
    </tr>
    <tr>
      <td>"Jag mår dåligt"</td>
    </tr>
    <tr>
      <td>"Hur mår du?"</td>
    </tr>
    <tr>
      <td>"Vem är du?"</td>
    </tr>
    <tr>
      <td>"Vem är din favorit lärare på Åva?"</td>
    </tr>
    <tr>
      <td>"Varför är du en chatbot"</td>
    </tr>
    <tr>
      <td>"2+2"</td>
    </tr>
    <tr>
      <td>"1+1"</td>
    </tr>
    <tr>
      <td>"Pi"</td>
    </tr>
  </tbody>
  `)

let form = (`
<form method="POST" action="/chatbot">
<label for="input">Input:</label>
<input type="text" id="input" name="input">
<button type="submit">Skicka</button>
`)

app.get('/', (req, res) => {
  res.send(`
  ${table}
  ${form}
  `);
});

app.post('/chatbot', (req, res) => {
  let input = req.body.input;
  let sql = `SELECT * FROM \`in/out\` WHERE input = '${input}'`;

  con.query(sql, (err, results) => {
    if (err) {
      console.log('Error querying database');
      throw err;
    }

    if (results.length > 0) {  
      let output = results[0].output;
      res.send(`
      ${table}
      ${form}
      <p>Svar: ${output}</p>
      `)
    } else {
      res.send(`
      ${table}
      ${form}
      <p>Svar: Jag förstår inte din fråga. Pröva med en annan fråga</p>
      `);
    }
  });
});


http.listen(port, function () {
  console.log("Server started. Listening on localhost:" + port);
});