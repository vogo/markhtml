var gitalk_enable_host = "wongoo.github.io";
var gitalk_client_id = "36302f69a92e0bddf32a";
var gitalk_client_secret = "f4bac053e89397b54fcf524b8a399a3ebb09c199";
var gitalk_repo = "wongoo.github.io";
var gitalk_user = "wongoo";

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
    if (validvar(gitalk_enable_host) && validvar(gitalk_client_id) && validvar(gitalk_client_secret) && validvar(gitalk_repo) && validvar(gitalk_user)) {
        let g = ndom("div");
        g.setAttribute("id", "gitalk")
        g.classList.add("main");
        g.classList.add("no-print")
        document.body.append(g);
        NewGitalk().render('gitalk');
    }
}

loadScript("", "//cdn.staticfile.org/gitalk/1.8.0/gitalk.min.js", function () {
    markgittalk();
});
