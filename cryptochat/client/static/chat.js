const ERROR_DURATION = 2000;

var message_history;
var message_submit;
var incoming_cipher;
var outgoing_cipher;
var refresh_button;
var message_count = 0;


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

    encrypt = (plaintext) => this.cipher.encrypt(sanitize_text(plaintext), this.key);
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
            this.error_element.classList.add('hidden');
        }, ERROR_DURATION);
    }
}


window.addEventListener('load', () =>
{
    message_history = document.getElementsByTagName('article')[0];
    message_submit = document.getElementById('message-submit');
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
    setInterval(update_message_history, CONFIG.MESSAGE_UPDATE_INTERVAL);
});

window.addEventListener('keydown', (event) =>
{
    if (event.key == 'Enter' && !event.shiftKey) {
        message_submit.click();
        event.preventDefault();
    }
});


async function send_message(form)
{
    form_data = new FormData(form);
    if (!outgoing_cipher.save() || form_data.get('message') == '') {
        form.elements['message'].focus()
        return;
    }

    // Creating payload
    let message = {
        text: outgoing_cipher.encrypt(form_data.get('message').trim())
    };

    // Resetting form
    form.reset();
    form.elements['message'].focus()

    // Sending message
    await fetch('/api/message', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    });

    update_message_history();
}

async function update_message_history(reset=false)
{
    // Getting messages
    let response = await fetch('/api/message?' + new URLSearchParams({
        '$skip': reset ? 0 : message_count
    }));
    let messages = await response.json();

    // Displaying messages
    if (reset) {
        message_history.innerHTML = '';
        message_count = 0;
    }

    let body;
    for (let message of messages) {
        message_count += 1
        body = incoming_cipher.decrypt(message).replaceAll('\n', '<br>');
        message_history.innerHTML += `<p> ${body} </p>`;
    };

    // Autoscrolling
    message_history.scrollTop = message_history.scrollHeight;
}

function save_incoming_settings()
{
    if (incoming_cipher.save()) {
        refresh_button.disabled = true;
        update_message_history(true);

        setTimeout(() =>
        {
            refresh_button.disabled = false;
        }, CONFIG.KEY_UPDATE_COOLDOWN);
    }
}
