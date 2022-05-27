$(readyNow)
//Function to run these or have event listeners ready when page loads
function readyNow() {
    $('#equal-button').on('click', onSubmit)
    $('.math-operators').on('click', mathOperatorSelect)
    $('#clear-button').on('click', emptyInputs)
    $('.number-buttons').on('click', enterInputs)
    $('#clear-history').on('click', clearHistory)
    $('#calculator-history').on('click', '.calc-history-li', calculateHistoryItem)
    console.log(mathOp)
    gatherInputs();
}


//Variable for my math operator 
let mathOp = '';
//function to change the mathOp value depending on what button is clicked
function mathOperatorSelect() {
    mathOp = $(this).text();
    $('#math-operator').empty();
    $('#math-operator').append(mathOp)
    console.log(mathOp);
}
//This function will check if we chose a math operator if we didn't it will enter values into the first input area
//if we have chose a math operator it will enter values in the second input area
function enterInputs() {
    if(mathOp === ''){
        $('#first-input-number').append($(this).text())
    }
    else if(mathOp === '+' || '-' || '*' || '/'){
        $('#second-input-number').append($(this).text())
    }
}

//This is the function ran when we click the equals buttons
function onSubmit(evt) {
    evt.preventDefault();
    //Setting up my object before sending it to the server
    let data = {
        firstInputNumber: $('#first-input-number').text(),
        secondInputNumber: $('#second-input-number').text(),
        mathOperator: mathOp,
        mathAnswer: 0
    }
    //This checks that all we have all inputs needed to run a calculation
    if($('#first-input-number').text() === '' || $('#second-input-number').text() === '' ) {
        alert(`Missing Inputs, can't calculate a single or no Number!`)
        return false;
    }
    
    //This is sending our object to the server, then letting us know it has been created
    $.ajax({
        url: '/calculator-objects',
        method: 'POST',
        data: data
    }).then((response) => {
        console.log('Inputs Posted', response)
        //once we have our object sent to the array on the server we run this 
        //function to get bring the complete object back.
        gatherInputs();
    }).catch((err) => {
        console.log(`Not posted, error ${err}`)
    });
    
   
}
//Our function to GET our object back with our calculations being complete
function gatherInputs() {
    //Our HTTP request for our array of Objects, .then calling our render function to put them on the DOM
    $.ajax({
        url:'/calculator-objects',
        method: 'GET'
    }).then((response) => {
        console.log(`Did the GET`);
        renderToDOM(response)

    }).catch((err) => {
        console.log(`GET failed ${err}`)
    })
}
//Our function to empty our inputs and reset our math operator to a default value.
function emptyInputs() {
    $('.user-input').empty();
    $('#math-operator').empty();
    mathOp = '';
    console.log(`mathOp= ${mathOp}`);
}
//Function that allows us to take out list of objects and put the object properties where we want them to go on the DOM
function renderToDOM(calc) {
    //Setting our current answer to a variable then appending it to the DOM
    let answer = calc[0].mathAnswer;
    $('#render-answer').empty()
    $('#render-answer').append(answer)
    //This part is rendering our calculator history by looping through our list we got from the server and rendering it to the DOM
    //Also has a variable to count the number of items on the list so when we click on the history item it grabs it from the list and 
    //re-renders the answer from that calculation in the history
    let el = $('#calculator-history')
    el.empty();
    let dataCounter = 0;
    for(let input of calc){
        el.append(`
                <li data-counter="${dataCounter}" class="calc-history-li">
                    ${input.firstInputNumber} ${input.mathOperator} ${input.secondInputNumber}
                </li>
        `)
        dataCounter ++;
    }
}
//This function does a DELETE request to the server and then it gets rid of the list of calculations in our history on the DOM
function clearHistory() {


    $.ajax({
        url: '/clear-history',
        method: 'DELETE'
    }).then((response) => {
        console.log(response)
        gatherInputs(response)
        $('#calculator-history').empty();
        $('#render-answer').empty();
    }).catch((err) => {
        console.log('DELETE didn\'t work', err)
    })

}
//This is the function that allows us to click on the history items and sends a request to the server for the object that matched the index 
//by using the dataCounter variable to grab the correct item in our array.
function calculateHistoryItem() {
    let index = $(this).data()
    console.log(`Clickin`, index)

    //sends the request for the object in the array
    $.ajax({
        url:'/calculate-history-item',
        method: 'POST',
        data: index
        //receives the server response which is the object we want and renders it to the DOM
    }).then((response) => {
        console.log(`In calc history`, response.mathAnswer )
        $('#render-answer').empty()
        $('#render-answer').append(`${response.mathAnswer}`)
    }).catch((err) => {
        console.log(`You don messed up`, err)
    })
}