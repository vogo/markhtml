// ----> high lighting
function markhighlight() {
    hljs.highlightAll();
}

loadScript("", "//cdn.staticfile.org/highlight.js/11.9.0/highlight.min.js", function () {
    markhighlight()
});