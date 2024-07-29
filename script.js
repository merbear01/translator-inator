const languagesDict = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh': 'Chinese',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'or': 'Odia',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'ug': 'Uyghur',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (document.getElementById('sourceLanguageSelect') && document.getElementById('targetLanguageSelect')) {
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

function populateLanguageOptions() {
    const languageSelects = [document.getElementById('sourceLanguageSelect'), document.getElementById('targetLanguageSelect')];
    for (const [code, name] of Object.entries(languagesDict)) {
        languageSelects.forEach(select => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            select.appendChild(option);
        });
    }
}

function startRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        console.log('Recognized text:', spokenText);
        document.getElementById('inputText').value = spokenText;
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        alert('Error occurred during recognition: ' + event.error);
    };

    recognition.start();
}

async function translateText() {
    const text = document.getElementById('inputText').value;
    const sourceLanguage = document.getElementById('sourceLanguageSelect').value;
    const targetLanguage = document.getElementById('targetLanguageSelect').value;

    if (!text || !sourceLanguage || !targetLanguage) {
        alert('Please provide text and select both source and target languages.');
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`);
        const data = await response.json();
        console.log('Translation data:', data);
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
    const targetLanguage = document.getElementById('targetLanguageSelect').value;

    if (!translatedText) {
        alert('Please translate text first.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = getCompatibleLanguageCode(targetLanguage);
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror:', event.error);
        alert('Speech synthesis failed. Please try again.');
    };
    speechSynthesis.speak(utterance);
}

function getCompatibleLanguageCode(languageCode) {
    const languageMapping = {
        'af': 'af-ZA', // Afrikaans
        'sq': 'sq-AL', // Albanian
        'am': 'am-ET', // Amharic
        'ar': 'ar-SA', // Arabic
        'hy': 'hy-AM', // Armenian
        'az': 'az-AZ', // Azerbaijani
        'eu': 'eu-ES', // Basque
        'be': 'be-BY', // Belarusian
        'bn': 'bn-BD', // Bengali
        'bs': 'bs-BA', // Bosnian
        'bg': 'bg-BG', // Bulgarian
        'ca': 'ca-ES', // Catalan
        'ceb': 'ceb-PH', // Cebuano
        'ny': 'ny-MW', // Chichewa
        'zh': 'zh-CN', // Chinese
        'zh-CN': 'zh-CN', // Chinese (Simplified)
        'zh-TW': 'zh-TW', // Chinese (Traditional)
        'co': 'co-FR', // Corsican
        'hr': 'hr-HR', // Croatian
        'cs': 'cs-CZ', // Czech
        'da': 'da-DK', // Danish
        'nl': 'nl-NL', // Dutch
        'en': 'en-US', // English
        'eo': 'eo-EO', // Esperanto
        'et': 'et-EE', // Estonian
        'tl': 'fil-PH', // Filipino
        'fi': 'fi-FI', // Finnish
        'fr': 'fr-FR', // French
        'fy': 'fy-NL', // Frisian
        'gl': 'gl-ES', // Galician
        'ka': 'ka-GE', // Georgian
        'de': 'de-DE', // German
        'el': 'el-GR', // Greek
        'gu': 'gu-IN', // Gujarati
        'ht': 'ht-HT', // Haitian Creole
        'ha': 'ha-NG', // Hausa
        'haw': 'haw-US', // Hawaiian
        'he': 'he-IL', // Hebrew
        'hi': 'hi-IN', // Hindi
        'hmn': 'hmn-CN', // Hmong
        'hu': 'hu-HU', // Hungarian
        'is': 'is-IS', // Icelandic
        'ig': 'ig-NG', // Igbo
        'id': 'id-ID', // Indonesian
        'ga': 'ga-IE', // Irish
        'it': 'it-IT', // Italian
        'ja': 'ja-JP', // Japanese
        'jw': 'jw-ID', // Javanese
        'kn': 'kn-IN', // Kannada
        'kk': 'kk-KZ', // Kazakh
        'km': 'km-KH', // Khmer
        'ko': 'ko-KR', // Korean
        'ku': 'ku-TR', // Kurdish
        'ky': 'ky-KG', // Kyrgyz
        'lo': 'lo-LA', // Lao
        'la': 'la-LA', // Latin
        'lv': 'lv-LV', // Latvian
        'lt': 'lt-LT', // Lithuanian
        'lb': 'lb-LU', // Luxembourgish
        'mk': 'mk-MK', // Macedonian
        'mg': 'mg-MG', // Malagasy
        'ms': 'ms-MY', // Malay
        'ml': 'ml-IN', // Malayalam
        'mt': 'mt-MT', // Maltese
        'mi': 'mi-NZ', // Maori
        'mr': 'mr-IN', // Marathi
        'mn': 'mn-MN', // Mongolian
        'my': 'my-MM', // Myanmar (Burmese)
        'ne': 'ne-NP', // Nepali
        'no': 'no-NO', // Norwegian
        'or': 'or-IN', // Odia
        'ps': 'ps-AF', // Pashto
        'fa': 'fa-IR', // Persian
        'pl': 'pl-PL', // Polish
        'pt': 'pt-PT', // Portuguese
        'pa': 'pa-IN', // Punjabi
        'ro': 'ro-RO', // Romanian
        'ru': 'ru-RU', // Russian
        'sm': 'sm-WS', // Samoan
        'gd': 'gd-GB', // Scots Gaelic
        'sr': 'sr-RS', // Serbian
        'st': 'st-ZA', // Sesotho
        'sn': 'sn-ZW', // Shona
        'sd': 'sd-PK', // Sindhi
        'si': 'si-LK', // Sinhala
        'sk': 'sk-SK', // Slovak
        'sl': 'sl-SI', // Slovenian
        'so': 'so-SO', // Somali
        'es': 'es-ES', // Spanish
        'su': 'su-ID', // Sundanese
        'sw': 'sw-KE', // Swahili
        'sv': 'sv-SE', // Swedish
        'tg': 'tg-TJ', // Tajik
        'ta': 'ta-IN', // Tamil
        'te': 'te-IN', // Telugu
        'th': 'th-TH', // Thai
        'tr': 'tr-TR', // Turkish
        'uk': 'uk-UA', // Ukrainian
        'ur': 'ur-PK', // Urdu
        'ug': 'ug-CN', // Uyghur
        'uz': 'uz-UZ', // Uzbek
        'vi': 'vi-VN', // Vietnamese
        'cy': 'cy-GB', // Welsh
        'xh': 'xh-ZA', // Xhosa
        'yi': 'yi-001', // Yiddish
        'yo': 'yo-NG', // Yoruba
        'zu': 'zu-ZA' // Zulu
    };

    return languageMapping[languageCode] || languageCode;
}
