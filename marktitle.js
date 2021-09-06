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

