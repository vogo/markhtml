function markmind() {
    let minds = document.getElementsByClassName("language-mindmap");
    for (let i = 0; i < minds.length; i++) {
        let mind = minds[i];
        let data = mind.innerText;
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "mindmap_" + i);
        svg.setAttribute('style', 'width: 100%;')
        let preTagNode = mind.parentNode;
        preTagNode.parentNode.insertBefore(svg, preTagNode.nextSibling);
        renderMindmap(svg, data);
    }
}

loadScript("", "/lib/markmind_render.js", function () {
    markmind();
})