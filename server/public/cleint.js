$(readyNow)

function readyNow() {
    $('#calculator-form-input').on('submit', onSubmit)
}

function onSubmit(evt) {
    evt.preventDefault();

    let data = {
        firstInputNumber: $('#first-input-number').val(),
        secondInputNumber: $('#second-input-number').val()
    }

    $.ajax({
        url: '/calculator-objects',
        method: 'POST',
        data: data
    }).then(() => {
        console.log('Inputs Posted')
    }).catch(() => {
        console.log(`Not posted, error`)
    })
}