$(readyNow)

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



let mathOp = '';

function mathOperatorSelect() {
    mathOp = $(this).text();
    $('#math-operator').empty();
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
    let answer = calc[0].mathAnswer;
    $('#render-answer').empty()
    $('#render-answer').append(answer)
    let el = $('#calculator-history')
    el.empty();
    let dataCounter = 0;
    for(let input of calc){
        el.prepend(`
                <li data-counter="${dataCounter}" class="calc-history-li">
                    ${input.firstInputNumber} ${input.mathOperator} ${input.secondInputNumber}
                </li>
        `)
        dataCounter ++;
    }
}

function clearHistory() {


    $.ajax({
        url: '/clear-history',
        method: 'DELETE'
    }).then((response) => {
        console.log(response)
        gatherInputs(response)
        $('#calculator-history').empty();
        $('#render-answer').empty();
    }).catch(() => {
        console.log('DELETE didn\'t work')
    })

}

function calculateHistoryItem() {
    let index = $(this).data()
    console.log(`Clickin`, index)


    $.ajax({
        url:'/calculate-history-item',
        method: 'POST',
        data: index
    }).then((response) => {
        console.log(`In calc history`, response.mathAnswer )
        $('#render-answer').empty()
        $('#render-answer').append(`${response.mathAnswer}`)
    }).catch(() => {
        console.log(`You don messed up`)
    })
}