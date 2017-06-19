
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
let storedLang = localStorage.getItem('lang');
if(storedLang) {
    languageWithoutRegionCode = storedLang;
}

function getDesc(descriptions) {
    const desc = descriptions[languageWithoutRegionCode];
    if(!desc) {
        return descriptions["en"];
    }
    return desc;
}


function getLang() {
    return languageWithoutRegionCode;
}

function setLang(lang) {
    languageWithoutRegionCode = lang;
    localStorage.setItem('lang', lang);
}

export {getDesc};
export {setLang};
export {getLang};
