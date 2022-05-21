$(readyNow)

function readyNow() {
    $('#calculator-form-input').on('submit', onSubmit)
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
        $('#second-input-number').append($(this).text())
    }
    else if(mathOp === '+' || '-' || '*' || '/'){
        $('#first-input-number').prepend($(this).text())
    }
}

function onSubmit(evt) {
    evt.preventDefault();

    let data = {
        firstInputNumber: $('#first-input-number').val(),
        secondInputNumber: $('#second-input-number').val(),
        mathOperator: mathOp,
        mathAnswer: 0
    }

    emptyInputs();

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