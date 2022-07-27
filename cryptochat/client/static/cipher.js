const CHARACTER_TABLE = ' abcdefghijklmnopqrstuvwxyz0123456789';
const CHARACTER_RANGE = CHARACTER_TABLE.length;

const CIPHERS = {
    none: {
        display: 'None',
        hint: null,
        sanitizers: [],
        encrypt: (text, _) => text,
        decrypt: (text, _) => text
    },
    caesar: {
        display: 'Caesar',
        hint: 'shift (int or char)',
        sanitizers: [int, char],
        encrypt: caesar,
        decrypt: (text, key) => caesar(text, -key)
    }
}


function sanitize_key(raw_key, cipher)
{
    let key;
    for (let sanitizer of CIPHERS[cipher].sanitizers) {
        key = sanitizer(raw_key);
        if (key != null) {
            break;
        }
    }
    return key;
}

function sanitize_text(raw_text)
{
    let text = [];
    for (let char of raw_text.toLowerCase()) {
        if (CHARACTER_TABLE.includes(char) || char == '\n') {
            text.push(char);
        }
    }
    return text.join('')
}

function char(raw_key)
{
    return raw_key.length == 1 ? raw_key.charCodeAt(0) : null;
}
function int(raw_key)
{
    return /^-?\d+$/.test(raw_key) ? parseInt(raw_key) : null;
}


function shift(char, shift)
{
    let char_code = CHARACTER_TABLE.indexOf(char);
    if (char_code == -1) {
        return char;
    } else {
        char_code = (((char_code + shift) % CHARACTER_RANGE) + CHARACTER_RANGE) % CHARACTER_RANGE; // Getting positive number within range
        return CHARACTER_TABLE[char_code];
    }
}

function caesar(plaintext, key)
{
    let ciphertext = [];
    for (let char of plaintext) {
        ciphertext.push(shift(char, key));
    }
    return ciphertext.join('');
}
