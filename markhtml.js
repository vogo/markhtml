(function(level) {
    var mh = {
        level: level,
        v: function(s) {
            if (s == "") {
                s = "<h1>404!</h1>找不到你要访问的页面!";
            }
            app = document.getElementById('app');
            app.innerHTML = s;
            h1 = document.getElementsByTagName("h1");
            if (h1.length > 0) {
                mainTitle = h1[0];
                document.title = mainTitle.innerText;
                document.body.insertBefore(this.buildmenu(), app)
            }
            if (callbackAfterShow && typeof callbackAfterShow == "function") {
                callbackAfterShow()
            }
        },

        loadmark: function() {
            url = window.location.pathname;
            if (url.length < 6 || url.indexOf(".html", url.length - 5) == -1) {
                mh.v("");
                return;
            }
            url = "http://doc.sisopipo.com/" + url.substr(0, url.length - 5) + ".md";
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    mh.v(marked(xmlhttp.responseText));
                }
            }
            xmlhttp.onerror = function() {
                mh.v("")
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },
        buildmenu: function() {
            var m = document.createElement('div')
            m.style.cssText = "float:left;position:fixed;"
            var content = document.querySelector('.markdown-body');

            var html = content.innerHTML;
            var pattern = /<h([1-3]) id="([^"]+)">/g


            var previousLi = m;
            var previousLevel = 0;
            var previousUl;

            while ((matchArr = pattern.exec(html))) {
                level = parseInt(matchArr[1])
                id = matchArr[2]
                console.log(level + ":" + id)
                h = document.getElementById(id)
                link = mh.makeLink(h)

                var ul;

                if (level > previousLevel) {
                    ul = document.createElement('ul')
                    previousLi.appendChild(ul)
                } else if (level == previousLevel) {
                    ul = previousUl;
                } else {
                    ul = previousUl.parentNode.parentNode
                }
                ul.appendChild(link)

                previousLi = link
                previousUl = ul
                previousLevel = level
            }

            return m
        },

        makeLink: function(h) {
            var link = document.createElement('li')
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
                mh.htmlEscape(text) +
                '</a>'
            return link
        },
        htmlEscape: function(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
        }
    };

    window.markhtml = mh;
})(3);
window.onload = window.markhtml.loadmark;
