var message_history;
var message_field;
var incoming_cipher;
var incoming_key;
var outgoing_cipher;
var outgoing_key;


window.addEventListener('load', function()
{
    message_history = document.getElementById('message_history');
    message_field = document.getElementById('message_field');
    incoming_cipher = document.getElementById('incoming_cipher');
    incoming_key = document.getElementById('incoming_key');
    outgoing_cipher = document.getElementById('outgoing_cipher');
    outgoing_key = document.getElementById('outgoing_key');

    // Adding cipher options
    for (let cipher of CIPHERS) {
        let name = cipher['name'];
        let title = cipher['title'];
        let cipher_option = `<option value='${name}'>${title}</option>`;

        incoming_cipher.innerHTML += cipher_option;
        outgoing_cipher.innerHTML += cipher_option;
    }

    update_chat();
    setInterval(update_chat, 10000);
});


async function update_chat()
{
    let response = await fetch('/chat/message/get');
    let messages = await response.json();
    write_messages(messages);
}

async function post_message()
{
    // Preparing payload
    let message = {
        text: ''
    };
    message['text'] = encrypt(message_field.value, outgoing_cipher.value, outgoing_key.value);

    // Resetting message field
    message_field.value = '';
    message_field.focus();

    // Posting message
    await fetch('/chat/message/post', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)});

    update_chat();
}


function write_messages(messages)
{
    message_history.innerHTML = '';

    for (let message of messages) {
        let body = decrypt(message, incoming_cipher.value, incoming_key.value);

        message_history.innerHTML += `<p>${body}</p>`;
    };
}

function update_cipher_options(cipher)
{
    let key;

    // Getting key field
    if (cipher.id.startsWith('incoming')) {
        key = incoming_key;
    } else {
        key = outgoing_key;
    }

    // Updating key field
    key.value = '';
    if (cipher.value == 'none') {
        key.style.display = 'none';
    } else {
        key.style.display = 'block';
    }

    // Setting key hint
    for (let cipher_option of CIPHERS) {
        if (cipher_option['name'] == cipher.value) {
            key.placeholder = cipher_option['hint'];
            break;
        }
    }
}
