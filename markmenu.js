function markmenu(level) {
    if (window.innerWidth < 900) {
        return
    }
    var h1 = document.getElementsByTagName("h1");
    if (h1.length <= 0) {
        h1 = document.getElementsByTagName("h2");
    }
    if (h1.length <= 0) {
        return;
    }
    var menuWidth = (window.innerWidth - 860) / 2;
    var html = dom("app").innerHTML;
    var pattern = new RegExp("<h([1-" + level + "]) id=\"([^\"]+)\"", "g");

    var previousLi = dom("menu");
    var previousLevel = 0;
    var previousUl;

    var matchArr;
    var level;
    var id;
    var h;
    var link;
    while ((matchArr = pattern.exec(html))) {
        level = parseInt(matchArr[1])
        id = matchArr[2]
        h = dom(id)
        link = makeLink(h, menuWidth)

        var ul;

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
    var link = ndom('li')
    link.style.width = menuWidth;
    window.arst = h
    var text = [].slice.call(h.childNodes).map(function (node) {
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


