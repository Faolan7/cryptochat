var message_history;
var message_field;

window.onload = function ()
{
    message_history = document.getElementById('message_history');
    message_field = document.getElementById('message_field');

    update_chat();
}

async function update_chat()
{
    let response = await fetch('/chat/message/get');
    let messages = await response.json();
    write_messages(messages);

    setTimeout(update_chat, 5000);
}

async function post_message()
{
    const message = {
        text: message_field.value
    };

    // Resetting message field
    message_field.value = '';
    message_field.focus();

    fetch('/chat/message/post', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)});
}

function write_messages(messages)
{
    message_history.innerHTML = '';

    for (let message of messages) {
        message_history.innerHTML += `${message}<br>`;
    };
}
