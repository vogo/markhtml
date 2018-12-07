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

function markhtml(level, host) {
    var mh = {
        level: level,
        defaultHost: host,
        mdurl: "",
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
            mdHostPrefix = mh.mdurl.substr(0, mh.mdurl.indexOf("/", 10))
            mdUrlPrefix = mh.mdurl.substr(0, mh.mdurl.lastIndexOf("/"))
            images = document.getElementsByTagName("img")
            for (i = 0; i < images.length; i++) {
                img = images[i]
                src = img.getAttribute("src")
                if (src.startsWith("http://") || src.startsWith("https://")) {
                    continue
                }
                if (src.startsWith("/")) {
                    img.src = mdHostPrefix + src
                } else {
                    img.src = mdUrlPrefix + "/" + src
                }
            }
        },

        loadmark: function() {
            url = window.location.pathname;
            if (url.length < 10) {
                dom("editor").style.display = ""
                return
            }
            if (url.charAt(0) == '/') {
                url = url.substr(1, url.length - 1)
            }
            if (mh.defaultHost != "") {
                hostIndex = url.indexOf("/")
                if (hostIndex > 0 && url.substr(0, hostIndex).indexOf(".") == -1) {
                    url = mh.defaultHost + "/" + url
                }
            }
            url = "http://" + url
            if (!endwith(url, ".markdown") && !endwith(url, ".md")) {
                mh.v("不支持的markdown地址: " + url);
                return;
            }
            mh.loadurl(url)
        },
        loadurl: function(url) {
            mh.mdurl = url


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
    return mh;
}

function GenPageId() {
    var gid = document.location.href;
    gid = gid.replace("http://", "");
    gid = gid.replace("https://", "");
    gid = gid.replace("sisopipo.com", "");
    gid = gid.replace(".html", "");
    gid = gid.replace(".md", "");
    gid = gid.replace(".markdown", "");

    if (gid[gid.length - 1] == '/') {
        gid = gid.substr(0, gid.length - 1);
    }
    var len = gid.lastIndexOf("/");
    if (gid.length - len > 25) {
        gid = gid.substr(len + 1);
    } else {
        len = gid.lastIndexOf("/", len - 1);
        if (gid.length - len > 25) {
            gid = gid.substr(len + 1);
        }
    }
    if (gid.length > 50) {
        gid = gid.replace(/[\W]/g, "");
    }
    if (gid.length > 50) {
        gid = gid.substr(gid.length - 50);
    }
    return gid;
}
