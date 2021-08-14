class CipherSettings
{
    constructor(direction)
    {
        this.cipher_element = document.getElementById(`${direction}-cipher`);
        this.key_element = document.getElementById(`${direction}-key`);
        this.error_element = document.getElementById(`${direction}-error`);
        this.error_timeout;
        this.cipher = CIPHERS['none'];
        this.key = null;
    }

    encrypt = (plaintext) => this.cipher.encrypt(plaintext, this.key);
    decrypt = (plaintext) => this.cipher.decrypt(plaintext, this.key);

    add_option(cipher)
    {
        this.cipher_element.innerHTML += `<option value="${cipher}"> ${CIPHERS[cipher].display} </option>`;
    }

    select_option(cipher)
    {
        let hint = CIPHERS[cipher].hint;

        // Updating key field
        this.key_element.value = '';
        this.key_element.placeholder = hint;
        if (hint) {
            this.key_element.classList.remove('hidden');
        } else {
            this.key_element.classList.add('hidden');
        }
    }

    save()
    {
        let cipher_code = this.cipher_element.value;
        let key = sanitize_key(this.key_element.value.trim(), cipher_code);

        // Checking key
        if (key == null && cipher_code != 'none') {
            this.show_error('Invalid key!');
            return false;
        }

        // Savings settings
        this.cipher = CIPHERS[cipher_code];
        this.key = key;
        return true;
    }

    show_error(message)
    {
        // Showing error
        this.error_element.innerText = message;
        this.error_element.classList.remove('hidden');

        // Hiding error
        clearTimeout(this.error_timeout);
        this.error_timeout = setTimeout(() =>
        {
            console.log('woah!');
            this.error_element.classList.add('hidden');
        }, 2000);
    }
}


var message_field;
var message_history;
var incoming_cipher;
var outgoing_cipher;
var refresh_button;


window.addEventListener('load', () =>
{
    message_history = document.getElementById('message-history');
    message_field = document.getElementById('message-field');
    incoming_cipher = new CipherSettings('incoming');
    outgoing_cipher = new CipherSettings('outgoing');
    refresh_button = document.getElementById('incoming-refresh');

    // Loading cipher options
    for (let cipher in CIPHERS) {
        incoming_cipher.add_option(cipher);
        outgoing_cipher.add_option(cipher);
    }

    // Preparing messages
    update_message_history();
    setInterval(update_message_history, 10000);
});


async function send_message()
{
    if (!outgoing_cipher.save()) {
        return;
    }

    // Creating payload
    let message = {
        text: outgoing_cipher.encrypt(message_field.value.trim())
    };

    // Resetting message field
    message_field.value = '';
    message_field.focus();

    // Sending message
    await fetch('/api/message', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    });

    update_message_history();
}

async function update_message_history()
{
    // Getting messages
    let response = await fetch('/api/message');
    let messages = await response.json();

    // Clearing message history
    message_history.innerHTML = '';

    // Displaying messages
    let body;
    for (let message of messages) {
        body = incoming_cipher.decrypt(message);
        message_history.innerHTML += `<p> ${body} </p>`;
    };
}

function save_incoming_settings()
{
    if (incoming_cipher.save()) {
        refresh_button.disabled = true;
        update_message_history();

        setTimeout(() =>
        {
            refresh_button.disabled = false;
        }, 5000);
    }
}
