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

function validvar(v) {
    return typeof v !== 'undefined' && v !== null
}

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

function loadCss(url) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
}

function ajaxget(url, success_callback, error_callback) {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        success_callback(xmlhttp)
    };
    xmlhttp.onerror = error_callback;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function marktitle() {
    var h1 = document.getElementsByTagName("h1");
    var mainTitle = ""
    if (h1.length <= 0) {
        h1 = document.getElementsByTagName("h2");
    }
    if (h1.length > 0) {
        mainTitle = h1[0];
    }
    if (mainTitle === "") {
        mainTitle = "Markdown To HTML"
    }
    document.title = mainTitle.innerText;
}

function markmenu() {
    if (window.innerWidth < 900) {
        return
    }
    let menuWidth = (window.innerWidth - 860) / 2;

    let previousLi = dom("menu");
    previousLi.classList.add("no-print");

    let previousLevel = 0;
    let previousUl;
    let h1Seq = 0;
    let h2Seq = 0;
    let h3Seq = 0;
    let link;

    let headings = document.querySelectorAll('h1, h2, h3');
    if (headings.length <= 0) {
        return
    }

    headings.forEach(heading => {
        if (heading.innerText === "") {
            return;
        }

        let level;
        switch (heading.tagName.toLowerCase()) {
            case 'h1':
                level = 1;
                h1Seq++;
                break;
            case 'h2':
                level = 2;
                h2Seq++;
                break;
            case 'h3':
                level = 3;
                h3Seq++;
                break;
            default:
                level = 0; // or handle other cases if needed
        }

        if (level === 0) {
            return;
        }

        // set id before creating the link
        heading.setAttribute("id", "heading_" + h1Seq + "_" + h2Seq + "_" + h3Seq);

        link = makeLink(heading, menuWidth)

        let ul;

        if (level > previousLevel) {
            ul = ndom('ul')
            previousLi.appendChild(ul)
        } else if (level === previousLevel) {
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
    });
}

function makeLink(h, menuWidth) {
    let link = ndom('li')
    link.style.width = menuWidth;
    window.arst = h
    link.innerHTML =
        '<a class="section-link" data-scroll href="#' + h.id + '">' +
        hfmt( h.innerText) +
        '</a>'
    return link
}

function markhighlight() {
    hljs.highlightAll();
}

function renderHighlight() {
    loadScript("", "//cdn.staticfile.net/highlight.js/11.9.0/highlight.min.js", function () {
        markhighlight()
    });
}

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
        packages: {'[+]': ['ams']}, // 加载 ams 包以支持 align 等环境
        processEscapes: false,
        skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "a"]
    },
    tex: {
        Macros: {
            tr: "{\\scriptscriptstyle\\mathrm{T}}",
        }
    }
};

function renderMath() {
    loadScript("MathJax-script", "//cdn.staticfile.net/mathjax/3.2.2/es5/tex-mml-chtml.min.js", function () {
    })
}

function markmind() {
    let minds = document.getElementsByClassName("language-mindmap");
    for (let i = 0; i < minds.length; i++) {
        let mind = minds[i];
        let data = mind.innerText;
        let height = data.length / 2 > 100 ? data.length / 2 : 100;
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("id", "mindmap_" + i);
        svg.setAttribute('style', 'width: 100%;height:' + height + "px;")
        let preTagNode = mind.parentNode;
        preTagNode.parentNode.insertBefore(svg, preTagNode);
        renderMindmap(svg, data);
        preTagNode.style.display = 'none';
    }
}

function renderMind() {
    loadScript("", "//vogo.github.io/vogo/markhtml/js/lib/markmind_render.js", function () {
        markmind();
    })
}

function NewGitalk() {
    return new Gitalk({
        clientID: gitalk_client_id,
        clientSecret: gitalk_client_secret,
        repo: gitalk_repo,
        owner: gitalk_user,
        admin: [gitalk_user],
        id: GenGitTalkPageId(),
        language: 'zh-CN',
        distractionFreeMode: true
    });
}

function GenGitTalkPageId() {
    var gid = document.location.href;
    gid = gid.replace("http://", "");
    gid = gid.replace("https://", "");
    gid = gid.replace(gitalk_enable_host, "");
    gid = gid.replace(".html", "");
    gid = gid.replace(".md", "");
    gid = gid.replace(".markdown", "");

    if (gid[gid.length - 1] === '/') {
        gid = gid.substr(0, gid.length - 1);
    }
    var index = gid.lastIndexOf("#");
    if (index > 0) {
        gid = gid.substr(0, index);
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

    gid = gid.replaceAll("/", "-");

    return gid;
}

function markgittalk() {
    if (typeof gitalk_enable_host !== 'undefined' &&
        typeof gitalk_client_id !== 'undefined' &&
        typeof gitalk_client_secret !== 'undefined' &&
        typeof gitalk_repo !== 'undefined' &&
        typeof gitalk_user !== 'undefined') {
        let g = ndom("div");
        g.setAttribute("id", "gitalk")
        g.classList.add("main");
        g.classList.add("no-print")
        document.body.append(g);
        NewGitalk().render('gitalk');
    }
}

function renderGitTalk() {
    loadScript("", "//cdn.staticfile.net/gitalk/1.8.0/gitalk.min.js", function () {
        markgittalk();
    });
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function mark_adjustUrl(url) {
    var mdHostPrefix = url.substr(0, url.indexOf("/", 10))
    var mdUrlPrefix = url.substr(0, url.lastIndexOf("/"))
    var images = document.getElementsByTagName("img")
    for (var i = 0; i < images.length; i++) {
        var img = images[i]
        var src = img.getAttribute("src")
        if (src.startsWith("http://") || src.startsWith("https://")) {
            continue
        }
        if (src.startsWith("/")) {
            img.src = mdHostPrefix + src
        } else {
            img.src = mdUrlPrefix + "/" + src
        }
    }
}

function loadmark(url) {
    if (endwith(url, "/")) {
        url = url + "README.md"
    }
    dom("menu").innerHTML = ""
    ajaxget(url, function (xmlhttp) {
        var app;
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var s = marked(xmlhttp.responseText);
            if (s === "") {
                alert("找不到你要访问的页面!");
                return
            }
            app = dom('app');
            app.innerHTML = s;

            marktitle();
            mark_adjustUrl(url);
            markmenu(4);
            renderHighlight();
            return
        }
        if (xmlhttp.status === 404) {
            alert("找不到你要访问的页面!");
            return
        }
        if (xmlhttp.status >= 400) {
            alert("无法加载请求页面")
        }
    }, function (err) {
        console.log(err)
        alert(err)
    })
}

function renderMarkUrl(url) {
    loadScript("", "//cdn.staticfile.net/marked/11.1.1/marked.min.js", function () {
        loadmark(url);
    })
}

function cc40() {
    let cc = ndom("footer");
    cc.innerHTML = '<p>版权声明：本文章采用<a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">知识共享 署名-相同方式共享 4.0 国际许可协议</a>进行许可。</p>';
    dom("app").append(cc);
}

function markhtml() {
    if (dom("app").innerText != "") {
        marktitle();
        markmenu();
        mark_adjustUrl(window.location.href);
        renderHighlight();
        renderMind();
        renderMath();
        cc40();
        renderGitTalk();
        return;
    }

    var url = getParameterByName("url")
    if (!endwith(url, "/") && !endwith(url, ".markdown") && !endwith(url, ".md")) {
        console.log("不支持的markdown地址: " + url);
        return;
    }
    renderMarkUrl(url);
}

markhtml();
