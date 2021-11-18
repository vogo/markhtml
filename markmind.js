function markmind() {
    let minds = document.getElementsByClassName("language-mindmap");
    for (let i = 0; i < minds.length; i++) {
        let mind = minds[i];
        let data = mind.innerText;

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "mindmap_" + i);
        svg.setAttribute('style', 'width: 100%;');
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");

        let preTagNode = mind.parentNode;
        preTagNode.parentNode.insertBefore(svg, preTagNode);

        renderMindmap(svg, data);

        preTagNode.style.display = 'none';

        // https://www.codegrepper.com/code-examples/css/svg+auto+height
        // auto height
        let bbox = svg.getBBox();
        svg.setAttribute("width", bbox.width + "px");
        svg.setAttribute("height", bbox.height + "px");
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    }
}

loadScript("", "/lib/markmind_render.js", function () {
    markmind();
})
