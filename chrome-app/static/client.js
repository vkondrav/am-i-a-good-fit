async function compareContent(
    jobDescription,
    resumeContent,
    resultCallback
) {

    const response = await fetch('https://fit.vkondrav.dev', {
        method: 'POST',
        body: JSON.stringify({
            job_description: jobDescription,
            resume_content: resumeContent,
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
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, {stream: true});

        console.log(chunk);

        result += chunk;
        resultCallback(result);
    }
}