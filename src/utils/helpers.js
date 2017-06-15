
const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

function getDesc(descriptions) {
    const desc = descriptions[languageWithoutRegionCode];
    if(!desc) {
        return descriptions["en"];
    }
    return desc;
}

export {getDesc};
