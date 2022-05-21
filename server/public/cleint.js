$(readyNow)

function readyNow() {
    $('#calculator-form-input').on('submit', onSubmit)
    $('.math-operators').on('click', mathOperatorSelect)
    gatherInputs();
}

let mathOp = '';

function mathOperatorSelect() {
    mathOp = $(this).text();
    console.log(mathOp);
}


function onSubmit(evt) {
    evt.preventDefault();

    let data = {
        firstInputNumber: $('#first-input-number').val(),
        secondInputNumber: $('#second-input-number').val(),
        mathOperator: mathOp
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

function renderToDOM(calc) {
    let el = $('#calculator-history')
    el.empty();
    for(let input of calc){
    el.append(`
        <li>${input.firstInputNumber} ${input.secondInputNumber}</li>
    `)
    }
}