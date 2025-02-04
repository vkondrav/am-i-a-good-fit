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