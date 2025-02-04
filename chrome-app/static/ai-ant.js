async function compareContentAnt(
    jobDescription,
    resumeContent,
    apiKey,
    model,
    resultCallback
) {
    const url = "https://api.anthropic.com/v1/messages";

    const requestBody = {
        model: model,
        messages: [
            { role: "user", content: prompt },
            { role: "user", content: `Job Description: ${jobDescription}` },
            { role: "user", content: `Resume: ${resumeContent}` }
        ],
        max_tokens: 8192,
        stream: true
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
                "anthropic-dangerous-direct-browser-access": "true",
                "x-api-key": apiKey,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error("HTTP error!", response.status, response.statusText)
            resultCallback('An error occurred. Please try again.');
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";
        let currentText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(line => line.trim() !== '');


            for (const line of lines) {
                if (line.startsWith("data:")) {
                    try {
                        const jsonString = line.slice(6);
                        const eventData = JSON.parse(jsonString);

                        if (eventData.type === 'content_block_delta') {
                            if (eventData.delta && eventData.delta.text) {
                                currentText += eventData.delta.text
                                resultCallback(currentText);
                            }
                        }

                        if(eventData.type === 'message_stop'){
                            result = currentText
                        }
                    } catch (e){
                        console.error("Error parsing json", e);
                        console.log("Line that errored:", line)
                    }

                }


            }
        }

        return result;


    } catch (error) {
        console.error("Error during fetch:", error);
        resultCallback('An error occurred. Please try again.');
    }
}