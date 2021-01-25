const ENCODE_MIN = 32;
const ENCODE_MAX = 126;

const CIPHERS = [
    {
        'name': 'none',
        'title': 'None',
        'hint': '',
        'function': function(text, key, reverse_key) {return text}
    },
    {
        'name': 'caesar',
        'title': 'Caesar',
        'hint': 'shift (int or char)',
        'function': caesar_cipher
    }
];


function encrypt(text, cipher, key)
{
    let encrypted_text;

    for (let cipher_option of CIPHERS) {
        if (cipher_option['name'] == cipher) {
            encrypted_text = cipher_option['function'](text, key, false);
            break;
        }
    }

    return encrypted_text;
}

function decrypt(text, cipher, key)
{
    let decrypted_text;

    for (let cipher_option of CIPHERS) {
        if (cipher_option['name'] == cipher) {
            decrypted_text = cipher_option['function'](text, key, true);
            break;
        }
    }

    return decrypted_text;
}

function encode(char)
{
    // Using the explicit index is supposedly faster
    return char.charCodeAt(0) - ENCODE_MIN;
}

function decode(value)
{
    return String.fromCharCode(value + ENCODE_MIN);
}

function shift(char, shift)
{
    let value = encode(char);
    let range = ENCODE_MAX - ENCODE_MIN + 1;

    if (!(0 <= value < range)) {
        return char;
    } else {
        return decode((value + shift) % range);
    }
}


function caesar_cipher(text, key, reverse_key)
{
    // Checking key
    let key_as_num = Number(key);
    if (key.length == 1 && key_as_num == NaN) {
        key = encode(key);
    } else if (Number.isInteger(key_as_num)) {
        key = key_as_num;
    } else {
        throw TypeError(`Invalid key [${key}]!`);
    }

    if (reverse_key) {
        key = -key;
    }

    // Ciphering
    let cipher_text = [];
    for (let char of text) {
        cipher_text.push(shift(char, key));
    }

    return cipher_text.join('');
}
