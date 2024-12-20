async function compareContentGoogle(
    jobDescription,
    resumeContent,
    apiKey,
    model,
    resultCallback
) {


    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=" + apiKey;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `Job Description: ${jobDescription}` }]
                },
                {
                    role: 'user',
                    parts: [{ text: `Resume: ${resumeContent}` }]
                },
                {
                    role: 'model',
                    parts: [{ text: prompt }]
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
                const contentParts = parsedLine.candidates[0].content.parts;

                for (const part of contentParts) {
                    if (part.text) {
                        result += part.text;
                        resultCallback(result);
                    }
                }
            }
        }
    }
}