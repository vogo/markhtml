function markmenu(menuLevel) {
    if (window.innerWidth < 900) {
        return
    }
    let h1 = document.getElementsByTagName("h1");
    if (h1.length <= 0) {
        h1 = document.getElementsByTagName("h2");
    }
    if (h1.length <= 0) {
        return;
    }
    let menuWidth = (window.innerWidth - 860) / 2;
    let html = dom("app").innerHTML;
    let pattern = new RegExp("<h([1-" + menuLevel + "]) id=\"([^\"]+)\"", "g");

    let previousLi = dom("menu");
    previousLi.classList.add("no-print");
    
    let previousLevel = 0;
    let previousUl;

    let matchArr;
    let level;
    let id;
    let h;
    let link;
    while ((matchArr = pattern.exec(html))) {
        level = parseInt(matchArr[1])
        id = matchArr[2]
        h = dom(id)
        link = makeLink(h, menuWidth)

        let ul;

        if (level > previousLevel) {
            ul = ndom('ul')
            previousLi.appendChild(ul)
        } else if (level == previousLevel) {
            ul = previousUl;
        } else {
            while (level < previousLevel--) {
                ul = previousUl.parentNode.parentNode
            }
        }
        ul.appendChild(link)

        previousLi = link
        previousUl = ul
        previousLevel = level
    }
}

function makeLink(h, menuWidth) {
    let link = ndom('li')
    link.style.width = menuWidth;
    window.arst = h
    let text = [].slice.call(h.childNodes).map(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue
        } else if (['CODE', 'SPAN'].indexOf(node.tagName) !== -1) {
            return node.textContent
        } else {
            return ''
        }
    }).join('').replace(/\(.*\)$/, '')
    link.innerHTML =
        '<a class="section-link" data-scroll href="#' + h.id + '">' +
        hfmt(text) +
        '</a>'
    return link
}

markmenu(3);