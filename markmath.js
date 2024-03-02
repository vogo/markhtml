function markmath() {
    MathJax = {
        showProcessingMessages: false,
        messageStyle: "none",
        "HTML-CSS": {
            linebreaks: {
                automatic: false
            },
            availableFonts: ["STIX", "TeX"]
        },
        tex2jax: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]],
            processEscapes: true,
            skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"]
        },
        tex: {
            Macros: {
                tr: "{\\scriptscriptstyle\\mathrm{T}}",
            }
        }
    };
}

loadScript("MathJax-script", "//cdn.staticfile.org/mathjax/3.2.2/es5/tex-mml-chtml.min.js", function () {
    markmath();
})
