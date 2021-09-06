
var gitalk_enable_host = "sisopipo.com";
var gitalk_client_id = "eac079c4ec282da19220";
var gitalk_client_secret = "0a7f98ef97c6bedb08214e97811214fd65b8e29c";
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

function markgittalk() {
    NewGitalk().render('gitalk');
}


