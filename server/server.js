//Importing express
const express = require('express');
//Importing body-parser
const bodyParser = require('body-parser');
//Creating express app
const app = express();
//Setting up port to run on
const PORT = 5000;
//Setting up body-parser to read objects on server side
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
//Setting files for client machines
app.use(express.static('server/public'));
//importing CalcObjects Array
let calculatorObjects = require('./modules/calcObject');
console.log(calculatorObjects);

app.get('/calculator-objects', (req, res) => {
    res.send(calculatorObjects)
})

app.post('/calculator-objects',(req, res) => {
    calculatorObjects.push(req.body)
    console.log(calculatorObjects)
    res.sendStatus(201)
})



//Setting up the listener for PORT 5000
app.listen(PORT, () => {
    console.log(`Server is running on`, PORT)
})