function dom(id) {
    return document.getElementById(id)
}

function ndom(n) {
    return document.createElement(n)
}

function endwith(s, c) {
    return s.indexOf(c, s.length - c.length) != -1;
}

function hfmt(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function ajaxget(url, success_callback, error_callback) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        success_callback(xmlhttp)
    };
    xmlhttp.onerror = error_callback;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function NewGitalk() {
    return new Gitalk({
        clientID: gitalk_client_id,
        clientSecret: gitalk_client_secret,
        repo: gitalk_repo,
        owner: gitalk_user,
        admin: [gitalk_user],
        id: GenPageId(),
        language: 'zh-CN',
        distractionFreeMode: true
    });
}

function GenPageId() {
    let gid = document.location.href;
    gid = gid.replace("http://", "");
    gid = gid.replace("https://", "");
    gid = gid.replace(gitalk_enable_host, "");
    gid = gid.replace(".html", "");
    gid = gid.replace(".md", "");
    gid = gid.replace(".markdown", "");

    if (gid[gid.length - 1] == '/') {
        gid = gid.substr(0, gid.length - 1);
    }
    let len = gid.lastIndexOf("/");
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

function markhtml(level) {
    let mh = {
        level: level,
        mdurl: "",
        loadsuccess: false,
        v: function(s) {
            if (s == "") {
                s = "找不到你要访问的页面!";
            }
            app = dom('app');
            app.innerHTML = s;
            h1 = document.getElementsByTagName("h1");
            mainTitle = ""
            if (h1.length <= 0) {
                h1 = document.getElementsByTagName("h2");
            }
            if (h1.length > 0) {
                mainTitle = h1[0];
                mh.buildmenu()
            }
            if (mainTitle == "") {
                mainTitle = "Markdown To HTML"
            }
            document.title = mainTitle.innerText;

            if (!mh.loadsuccess) {
                return
            }

            // ----> mathjax
            MathJax.Hub.Queue(
                ["Typeset", MathJax.Hub, dom('app')], [
                    "resetEquationNumbers", MathJax.InputJax.TeX
                ]
            );

            // ----> image url
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

            // ----> navbar
            // navurl = mdUrlPrefix + "/" + "_navbar.md"
            // ajaxget(navurl, function(xmlhttp) {
            //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //         dom('navbar').innerHTML = marked(xmlhttp.responseText)
            //         return
            //     }

            // }, function(err) {
            //     console.log(err)
            // })

            // ----> high lighting
            hljs.initHighlightingOnLoad();

            // ----> gitalk
            if (mh.mdurl.indexOf(gitalk_enable_host) > 0) {
                NewGitalk().render('gitalk');
            }
        },

        loadmark: function() {
            url = getParameterByName("url")
            if (!endwith(url, "/") && !endwith(url, ".markdown") && !endwith(url, ".md")) {
                mh.v("不支持的markdown地址: " + url);
                return;
            }
            mh.loadurl(url)
        },
        loadurl: function(url) {
            mh.mdurl = url
            if (endwith(url, "/")) {
                mh.mdurl = mh.mdurl + "README.md"
            }
            dom("menu").innerHTML = ""
            mh.loadsuccess = false
            ajaxget(mh.mdurl, function(xmlhttp) {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    mh.loadsuccess = true
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
            }, function(err) {
                console.log(err)
                mh.v(err)
            })
        },
        buildmenu: function() {
            if(window.innerWidth < 900){
                return
            }
            let html = dom("app").innerHTML;
            let pattern = new RegExp("<h([1-" + mh.level + "]) id=\"([^\"]+)\"", "g");

            let previousLi = dom("menu");
            let previousLevel = 0;
            let previousUl;

            while ((matchArr = pattern.exec(html))) {
                level = parseInt(matchArr[1])
                id = matchArr[2]
                h = dom(id)
                link = mh.makeLink(h)

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
        },

        makeLink: function(h) {
            let link = ndom('li')
            window.arst = h
            let text = [].slice.call(h.childNodes).map(function(node) {
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
        },
    };
    return mh;
}

mh = markhtml(3);
window.onload = mh.loadmark;
