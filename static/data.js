async function getResumeFile() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('resume-file', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['resume-file']);
            }
        });
    });
}

async function getResumeContent(resumeFile) {

    const blob = new Blob([resumeFile], {type: 'text/plain'});

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(blob);
    });
}

async function getApiKeyOpenAI() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('api-key-openai', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['api-key-openai']);
            }
        });
    });
}

async function getApiKeyGoogle() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('api-key-google', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['api-key-google']);
            }
        });
    });
}

async function getApiKeyAnt() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('api-key-ant', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['api-key-ant']);
            }
        });
    });
}

async function getApiKeyDeepSeek() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('api-key-deepseek', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['api-key-deepseek']);
            }
        });
    });
}


async function getModel() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('model', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['model']);
            }
        });
    });
}