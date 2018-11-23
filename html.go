package main

var HTML = `<!doctype html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" />
  <title>Index</title>
</head>
<body>
  <div class="markdown-body" id="app" style="width:900px;margin: 0 auto;"></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    function v(s){
      if(s==""){
        s = "<h1>404!</h1>找不到你要访问的页面!";
      }
      app=document.getElementById('app');
      app.innerHTML = s;
      h1=document.getElementsByTagName("h1");
      if(h1.length>0){
        mainTitle = h1[0];
        document.title = mainTitle.innerText;
        document.body.insertBefore(buildmenu(),app)
      }
    }

    function loadmark(){
      url = window.location.pathname;
      if(url.length<6 || url.indexOf(".html", url.length - 5) == -1){
        v("");
        return;
      }
      url = "http://doc.sisopipo.com/" + url.substr(0,url.length -5) + ".md";
      if (window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
      } else {
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
          v(marked(xmlhttp.responseText));
        }
      }
      xmlhttp.onerror = function () {
        v("")
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  };

  function buildmenu(){
    var m = document.createElement('ul')
    m.style.cssText="float:left;position:fixed;"
    var each = [].forEach
    var content = document.querySelector('.markdown-body')
    var headers = content.querySelectorAll('h2')
    each.call(headers, function (h) {
      m.appendChild(makeLink(h))
    })
    return m
  }

  function makeLink (h) {
   var link = document.createElement('li')
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
       htmlEscape(text) +
     '</a>'
   return link
  }

  function htmlEscape (text) {
  return text
   .replace(/&/g, '&amp;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
  }

  window.onload = loadmark;
  </script>
</body>
</html>

`
