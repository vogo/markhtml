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