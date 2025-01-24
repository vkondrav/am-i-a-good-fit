async function compareContentDeepSeek(
    jobDescription,
    resumeContent,
    apiKey,
    model,
    resultCallback
) {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                },
                {
                    role: 'user',
                    content: `Job Description: ${jobDescription}`
                },
                {
                    role: 'user',
                    content: `Resume: ${resumeContent}`
                }
            ]
        })
    });

    if (!response.ok) {
        resultCallback('An error occurred. Please try again.');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonString = line.slice(6);
                if (jsonString === '[DONE]') continue;

                const parsedLine = JSON.parse(jsonString);
                const content = parsedLine.choices[0].delta?.content;

                if (content) {
                    result += content;
                    resultCallback(result);
                }
            }
        }
    }
}