//Importing express
const express = require('express');

//Importing body-parser
const bodyParser = require('body-parser');

//Creating express app
const app = express();

//Setting up port to run on
//process.env.PORT is the port heroku want you to liston on
const PORT = process.env.PORT || 5000;

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

//My function to calculate the answers
//By checking the math operators and plugging the inputs into the correct function
function doingCalculations(calcs) {
     if(calcs.mathOperator === '/'){
       calcs.mathAnswer = divide.divideNum(calcs.firstInputNumber, calcs.secondInputNumber);
    }
    else if(calcs.mathOperator === '*'){
        calcs.mathAnswer = multiplication.multiplication(calcs.firstInputNumber, calcs.secondInputNumber)
    }
    else if(calcs.mathOperator === '+'){
        calcs.mathAnswer = sum.sumOf(Number(calcs.firstInputNumber), Number(calcs.secondInputNumber))
    }
    else if(calcs.mathOperator === '-'){
        calcs.mathAnswer = subtract.subtract(Number(calcs.firstInputNumber), Number(calcs.secondInputNumber))
    }
    else{
        return false;
    }
}
//Server endpoint for adding calculation objects to array
app.post('/calculate-history-item', (req, res) => {
    console.log('In calculate history', req.body.counter);
    res.send(calculatorObjects[req.body.counter])
})


//server endpoint to send back our array of objects to the client to then be rendered.
app.get('/calculator-objects', (req, res) => {
    console.log(`Inside calc GET`)
    res.send(calculatorObjects)
})
//Server endpoint to take in the object from the client and add it to our list
app.post('/calculator-objects',(req, res) => {
    let mathObject = req.body
    doingCalculations(mathObject);
    calculatorObjects.unshift(mathObject)
    console.log(calculatorObjects)
    res.sendStatus(201)
})

//Delete request to splice our array so the user can start fresh with a clean history
app.delete('/clear-history', (req, res) => {
    calculatorObjects.splice(0, calculatorObjects.length)
    console.log(calculatorObjects)
    res.send(calculatorObjects)
})



//Setting up the listener for PORT 5000
app.listen(PORT, () => {
    console.log(`Server is running on`, PORT)
})