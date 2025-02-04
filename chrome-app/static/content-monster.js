const observer = new MutationObserver(() => {
    addAnalysisButton('[class*="description-styles__DescriptionContainerOuter"]', '[class*="description-styles__DescriptionContainerInner-sc-78eb761c-2"]');
});

observer.observe(document.body, {childList: true, subtree: true});