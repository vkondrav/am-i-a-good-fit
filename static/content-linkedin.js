function addAnalysisButton(applyButton, i) {
    let id = `analysis-button-${i}`

    if (document.getElementById(id)) return

    const button = document.createElement('button');
    button.id = id;
    button.textContent = 'Am I a Good Fit?';
    button.className = `
            artdeco-button 
            artdeco-button--3 
            artdeco-button--primary
            mr2
        `;
    button.style.cssText = `
            background-color: purple;
        `;

    const analysisContainer = document.createElement('p');
    analysisContainer.id = 'analysis-container';
    analysisContainer.innerHTML = '';
    analysisContainer.className = `
            jobs-box__html-content
            t-14 
            t-normal
            jobs-description-content__text--stretch
            mb2
        `;
    analysisContainer.style.cssText = `
            display: none;
            background-color: #f9f9f9;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

    const buttonsContainer = applyButton.parentElement;

    buttonsContainer.insertBefore(button, buttonsContainer.firstChild);

    const jobDescriptionContainer = document.querySelector('.jobs-description__container');
    jobDescriptionContainer.insertBefore(analysisContainer, jobDescriptionContainer.firstChild);

    button.addEventListener('click', async () => {
        analysisContainer.style.display = 'block';

        try {

            const jobDescription = document.getElementById('job-details').textContent;

            const resumeFile = await getResumeFile();

            if (!resumeFile) {
                analysisContainer.innerHTML = 'Please upload a resume';
                return;
            }

            const apikey = await getApiKey();

            if (!apikey) {
                analysisContainer.innerHTML = 'Please enter an Open AI API key';
                return;
            }

            const model = await getModel();

            if (!model) {
                analysisContainer.innerHTML = 'Please select a model';
                return;
            }

            analysisContainer.innerHTML = 'Analyzing...';

            const resumeContent = await getResumeContent(resumeFile);

            await compareContent(
                jobDescription,
                resumeContent,
                apikey,
                model,
                (result) => {
                    analysisContainer.innerHTML = result;
                }
            );

        } catch (e) {
            console.error(e);
            analysisContainer.innerHTML = 'An error occurred. Please try again.';
        }
    });
}

function addAnalysisButtons() {

    const applyButtons = document.querySelectorAll('.jobs-s-apply');

    applyButtons.forEach((applyButton, i) => {
        addAnalysisButton(applyButton, i);
    });
}

const observer = new MutationObserver(() => {
    if (window.location.href.includes('linkedin.com/jobs/')) {
        addAnalysisButtons();
    }
});

observer.observe(document.body, {childList: true, subtree: true});