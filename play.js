window.addEventListener('message', function (event) {
    const message = event.data
    if (message?.type === '__trackocity-iframe_') {
        sendData(message.data)
    }
})


function sendData(inputValues) {
    console.log('function inputValues ', inputValues)
}