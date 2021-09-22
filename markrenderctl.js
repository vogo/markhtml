function loadScript(id, url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript'
    if (id !== "") {
        script.id = id;
    }
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);

    return 0;
}

function initialMarkPage() {
    // call init page functions
    marktitle();
    markmenu(3);
    markhighlight();
    markgittalk();

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

loadScript("", "//cdn.staticfile.org/highlight.js/11.2.0/highlight.min.js", function () {
    loadScript("MathJax-script", "//cdn.staticfile.org/mathjax/3.2.0/es5/tex-mml-chtml.min.js", function () {
        loadScript("", "//cdn.staticfile.org/gitalk/1.7.2/gitalk.min.js", function () {
            initialMarkPage();
        })
    })
});
