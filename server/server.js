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

//Importing divide function
const divide = require('./modules/divide')

//Importing multiplication function
const multiplication = require('./modules/multi')

//Importing subtract function
const subtract = require('./modules/subtract');

//Importing addition function
const sum = require('./modules/sum');

function doingCalculations () {
    for(let calcs of calculatorObjects){
        if(calcs.mathOperator === '/'){
             divide.divideNum(calcs.firstInputNumber, calcs.secondInputNumber);
        }
    }
}




app.get('/calculator-objects', (req, res) => {
    console.log(`Inside calc GET`)
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