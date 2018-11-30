function dom(id) {
    return document.getElementById(id)
}

function ndom(n) {
    return document.createElement(n)
}

function endwith(s, c) {
    return s.indexOf(c, s.length - c.length) != -1;
}

function hformt(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}
(function(level) {

    var mh = {
        level: level,

        v: function(s) {
            if (s == "") {
                s = "找不到你要访问的页面!";
            }
            app = dom('app');
            app.innerHTML = s;
            h1 = document.getElementsByTagName("h1");
            mainTitle = ""
            if (h1.length > 0) {
                mainTitle = h1[0];
                mh.buildmenu()
            }
            if (mainTitle == "") {
                mainTitle = "Markdown To HTML"
            }
            document.title = mainTitle.innerText;
            if (callbackAfterShow && typeof callbackAfterShow == "function") {
                callbackAfterShow()
            }
        },
        loadmark: function() {
            url = window.location.pathname;
            if (url.length < 10) {
                dom("editor").style.display = ""
                return
            }
            url = "http://" + url
            if (!endwith(url, ".markdown") && !endwith(url, ".md")) {
                mh.v("不支持的markdown地址: " + url);
                return;
            }
            mh.loadurl(url)
        },
        loadurl: function(url) {
            dom("menu").innerHTML = ""
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    mh.v(marked(xmlhttp.responseText));
                    return
                }
                if (xmlhttp.status == 404) {
                    mh.v("")
                    return
                }
                if (xmlhttp.status >= 400) {
                    mh.v("无法加载请求页面")
                }
            }
            xmlhttp.onerror = function(err) {
                mh.v(err)
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },
        buildmenu: function() {
            var html = dom("app").innerHTML;
            var pattern = new RegExp("<h([1-" + mh.level + "]) id=\"([^\"]+)\"", "g");

            var previousLi = dom("menu");
            var previousLevel = 0;
            var previousUl;

            while ((matchArr = pattern.exec(html))) {
                level = parseInt(matchArr[1])
                id = matchArr[2]
                h = dom(id)
                link = mh.makeLink(h)

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
        },

        makeLink: function(h) {
            var link = ndom('li')
            window.arst = h
            var text = [].slice.call(h.childNodes).map(function(node) {
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
                hformt(text) +
                '</a>'
            return link
        },

    };

    window.markhtml = mh;
})(3);
window.onload = window.markhtml.loadmark;
