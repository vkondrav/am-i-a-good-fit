const observer = new MutationObserver(() => {
    addAnalysisButton('#jobDescriptionTitle', '#jobDescriptionText');
});

observer.observe(document.body, {childList: true, subtree: true});