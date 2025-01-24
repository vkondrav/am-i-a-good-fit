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

async function getApiKey(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key]);
            }
        });
    });
}

async function getApiKeyOpenAI() {
    return getApiKey('api-key-openai');
}

async function getApiKeyGoogle() {
    return getApiKey('api-key-google');
}

async function getApiKeyAnt() {
    return getApiKey('api-key-ant');
}

async function getApiKeyDeepSeek() {
    return getApiKey('api-key-deepseek');
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