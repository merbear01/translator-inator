document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (document.getElementById('languageSelect')) {
        populateLanguageOptions();
    }
});

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const registerError = document.getElementById('registerError');

    if (localStorage.getItem(username)) {
        registerError.textContent = 'Username already exists. Please choose a different username.';
    } else {
        localStorage.setItem(username, password);
        alert('Registration successful! You can now log in.');
        window.location.href = 'index.html';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    const storedPassword = localStorage.getItem(username);
    if (storedPassword && storedPassword === password) {
        alert('Login successful!');
        window.location.href = 'translate.html';
    } else {
        loginError.textContent = 'Invalid username or password';
    }
}

// Translation and speech recognition functions
const languagesDict = {
    'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian',
    'az': 'Azerbaijani', 'eu': 'Basque', 'be': 'Belarusian', 'bn': 'Bengali', 'bs': 'Bosnian',
    'bg': 'Bulgarian', 'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh': 'Chinese',
    'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish', 'nl': 'Dutch', 'en': 'English',
    'eo': 'Esperanto', 'et': 'Estonian', 'tl': 'Filipino', 'fi': 'Finnish', 'fr': 'French', 'fy': 'Frisian',
    'gl': 'Galician', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gu': 'Gujarati', 'ht': 'Haitian Creole',
    'ha': 'Hausa', 'haw': 'Hawaiian', 'he': 'Hebrew', 'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian',
    'is': 'Icelandic', 'ig': 'Igbo', 'id': 'Indonesian', 'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese',
    'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh', 'km': 'Khmer', 'ko': 'Korean', 'ku': 'Kurdish',
    'ky': 'Kyrgyz', 'lo': 'Lao', 'la': 'Latin', 'lv': 'Latvian', 'lt': 'Lithuanian', 'lb': 'Luxembourgish',
    'mk': 'Macedonian', 'mg': 'Malagasy', 'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori',
    'mr': 'Marathi', 'mn': 'Mongolian', 'my': 'Myanmar (Burmese)', 'ne': 'Nepali', 'no': 'Norwegian', 'or': 'Odia',
    'ps': 'Pashto', 'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian',
    'ru': 'Russian', 'sm': 'Samoan', 'gd': 'Scots Gaelic', 'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona',
    'sd': 'Sindhi', 'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish',
    'su': 'Sundanese', 'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai',
    'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu', 'ug': 'Uyghur', 'uz': 'Uzbek', 'vi': 'Vietnamese',
    'cy': 'Welsh', 'xh': 'Xhosa', 'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu'
};

const languageSelect = document.getElementById('languageSelect');

if (languageSelect) {
    // Populate language select options
    for (const [code, name] of Object.entries(languagesDict)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        languageSelect.appendChild(option);
    }
}

function startRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        document.getElementById('inputText').value = spokenText;
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        alert('Error occurred during recognition: ' + event.error);
    };

    recognition.start();
}

function startCommandRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        processCommand(command);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        alert('Error occurred during recognition: ' + event.error);
    };

    recognition.start();
}

function processCommand(command) {
    if (command.includes('translate')) {
        translateText();
    } else {
        const foundLanguage = Object.entries(languagesDict).find(([code, name]) => command.includes(name.toLowerCase()));
        if (foundLanguage) {
            languageSelect.value = foundLanguage[0];
            alert(`Language set to ${foundLanguage[1]}`);
        } else {
            alert('Command not recognized.');
        }
    }
}

async function translateText() {
    const text = document.getElementById('inputText').value;
    const targetLanguage = languageSelect.value;

    if (!text || !targetLanguage) {
        alert('Please provide text and select a target language.');
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`);
        const data = await response.json();
        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails);
        }
        const translatedText = data.responseData.translatedText;
        document.getElementById('outputText').textContent = translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation failed. Please try again.');
    }
}

function speakText() {
    const translatedText = document.getElementById('outputText').textContent;

    if (!translatedText) {
        alert('Please translate text first.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = languageSelect.value;
    speechSynthesis.speak(utterance);
}
