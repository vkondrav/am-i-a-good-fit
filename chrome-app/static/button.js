function createAnalysisButton(id) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = 'Am I a Good Fit?';
    button.style.cssText = `
        background-color: #6200ea;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        margin-bottom: 10px;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s, box-shadow 0.3s;
        position: relative;
        overflow: hidden;
    `;

    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -150%;
        width: 200%;
        height: 100%;
        background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 2s infinite;
    `;
    button.appendChild(shimmer);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% {
                transform: translateX(-150%);
            }
            50% {
                transform: translateX(-50%);
            }
            100% {
                transform: translateX(150%);
            }
        }
    `;
    document.head.appendChild(style);

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#3700b3';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#6200ea';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    });

    return button;
}

function cleanResult(result) {
    return removeTripleBacktickLines(result)
}

function removeTripleBacktickLines(input) {
    return input.split('\n').filter(line => !line.includes('```')).join('\n');
}

function addAnalysisButton(jobDescriptionContainerSelector, jobDescriptionDetailsSelector) {
    let id = `analysis-button`

    if (document.getElementById(id)) return

    let button = createAnalysisButton(id);

    const jobDescriptionContainer = document.querySelector(jobDescriptionContainerSelector);
    jobDescriptionContainer.insertBefore(button, jobDescriptionContainer.firstChild);

    button.addEventListener('click', async () => {

        displayModal();

        const modalAnalysis = document.getElementById('modal-analysis');

        try {

            const jobDescription = document.querySelector(jobDescriptionDetailsSelector).textContent;

            const resumeFile = await getResumeFile();

            if (!resumeFile) {
                modalAnalysis.innerHTML = 'Please upload a resume';
                return;
            }

            const model = await getModel();

            if (!model) {
                modalAnalysis.innerHTML = 'Please select a model';
                return;
            }

            let apikey;
            let errorMessage;
            let compareFunction;

            if (model.startsWith('gpt-')) {

                apikey = await getApiKeyOpenAI();
                compareFunction = compareContentOpenAI;
                errorMessage = 'Please enter an OpenAI API key';

            } else if (model.startsWith('gemini-')) {

                apikey = await getApiKeyGoogle();
                compareFunction = compareContentGoogle;
                errorMessage = 'Please enter a Google API key';

            } else if (model.startsWith('claude-')) {

                apikey = await getApiKeyAnt();
                compareFunction = compareContentAnt;
                errorMessage = 'Please enter an Anthropic API key';

            } else if (model.startsWith('deepseek-')) {

                apikey = await getApiKeyDeepSeek();
                compareFunction = compareContentDeepSeek;
                errorMessage = 'Please enter a DeepSeek API key';

            } else {

                modalAnalysis.innerHTML = 'Invalid model';
                return;
            }

            if (!apikey) {
                modalAnalysis.innerHTML = errorMessage;
                return;
            }

            modalAnalysis.innerHTML = 'Analyzing...';

            const resumeContent = await getResumeContent(resumeFile);

            await compareFunction(
                jobDescription,
                resumeContent,
                apikey,
                model,
                (result) => {

                    modalAnalysis.innerHTML = cleanResult(result);
                }
            );

        } catch (e) {
            console.error(e);
            modalAnalysis.innerHTML = 'An error occurred. Please try again.';
        }
    });
}