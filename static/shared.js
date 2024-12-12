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

async function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('api-key', (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result['api-key']);
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

let prompt = `
    You are a career coach AI. I will send you a resume and a job description.
    You will quickly decide if the resume is a good fit for the job description.
    
    You are providing feedback to a job seeker on how well their resume matches the job description.
    
    Give a score out of 100 to indicate how well the resume matches the job description.
    Provide ways that their resume can be modified to increase the score.
    
    Format your output as html but only the content inside the <body> tag. 
    Exclude the <body> tag.
    
    very first element should be <h2 class="text-heading-large">Am I a good fit?</h2>
    `

async function compareContent(
    jobDescription,
    resumeContent,
    openaiApiKey,
    model,
    resultCallback
) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
            model: model,
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: `Job Description: ${jobDescription}\nResume Content: ${resumeContent}`
                }
            ]
        })
    });

    if (!response.ok) {
        resultCallback('An error occurred. Please try again.');
        return
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, {stream: true});
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
            if (line.startsWith('data: ')) {

                const jsonString = line.slice(6);
                if (jsonString === '[DONE]') continue;

                const parsedLine = JSON.parse(jsonString);
                const content = parsedLine.choices[0].delta.content;

                if (content) {
                    result += content;
                    resultCallback(result);
                }
            }
        }
    }
}