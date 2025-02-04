const observer = new MutationObserver(() => {
    addAnalysisButton('.jobs-description__container', '#job-details');
});

observer.observe(document.body, {childList: true, subtree: true});