$(readyNow)

function readyNow() {
    $('#equal-button').on('click', onSubmit)
    $('.math-operators').on('click', mathOperatorSelect)
    $('#clear-button').on('click', emptyInputs)
    $('.number-buttons').on('click', enterInputs)
    console.log(mathOp)
    gatherInputs();
}

let mathOp = '';

function mathOperatorSelect() {
    mathOp = $(this).text();
    $('#math-operator').append(mathOp)
    console.log(mathOp);
}

function enterInputs() {
    if(mathOp === ''){
        $('#first-input-number').append($(this).text())
    }
    else if(mathOp === '+' || '-' || '*' || '/'){
        $('#second-input-number').append($(this).text())
    }
}

function onSubmit(evt) {
    evt.preventDefault();

    let data = {
        firstInputNumber: $('#first-input-number').text(),
        secondInputNumber: $('#second-input-number').text(),
        mathOperator: mathOp,
        mathAnswer: 0
    }

    if($('#first-input-number').text() === '' || $('#second-input-number').text() === '' ) {
        alert(`Missing Inputs, can't calculate a single or no Number!`)
        return false;
    }
    

    $.ajax({
        url: '/calculator-objects',
        method: 'POST',
        data: data
    }).then(() => {
        console.log('Inputs Posted')
    }).catch(() => {
        console.log(`Not posted, error`)
    });
    gatherInputs();
}

function gatherInputs() {
    $.ajax({
        url:'/calculator-objects',
        method: 'GET'
    }).then((response) => {
        console.log(`Did the GET`);
        renderToDOM(response)

    })
}

function emptyInputs() {
    $('.user-input').empty();
    $('#math-operator').empty();
    mathOp = '';
    console.log(`mathOp= ${mathOp}`);
}

function renderToDOM(calc) {
    $('#render-answer').empty()
    $('#render-answer').append(calc[calc.length - 1].mathAnswer)
    let el = $('#calculator-history')
    el.empty();
    for(let input of calc){
    el.prepend(`
        <li>${input.firstInputNumber} ${input.mathOperator} ${input.secondInputNumber} = ${input.mathAnswer}</li>
    `)
    }
}