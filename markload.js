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

function loadmark() {
    var url = getParameterByName("url")
    if (!endwith(url, "/") && !endwith(url, ".markdown") && !endwith(url, ".md")) {
        alert("不支持的markdown地址: " + url);
        return;
    }

    if (endwith(url, "/")) {
        url = url + "README.md"
    }
    dom("menu").innerHTML = ""
    ajaxget(url, function (xmlhttp) {
        var app;
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var s = marked(xmlhttp.responseText);
            if (s === "") {
                alert( "找不到你要访问的页面!");
                return
            }
            app = dom('app');
            app.innerHTML = s;

            marktitle();
            mark_adjustUrl(url);
            markmenu(4);
            markhighlight();
            // markgittalk();

            return
        }
        if (xmlhttp.status === 404) {
            alert( "找不到你要访问的页面!");
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

