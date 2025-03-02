*markhtml* is a collection of markdown render utilities, includes features:
- convert markdown to html
- html outline menu
- render math expression using mathjax
- comment system using gittalk
- highlight
- render mind map 

## How to Use

1. install commands
```bash
sudo npm install marked -g

# install markhtml command tool
go install github.com/vogo/markhtml/cmd/markhtml@master
```

2. create markdown with following headers, like [mind.md](/examples/mind.md)
```
<!---
markmeta_author: wongoo
markmeta_date: 2019-12-27
markmeta_title: markdown to html example
markmeta_categories: guide
markmeta_tags: markdown,html,example
-->
```

4. convert markdown
```bash
markhtml <markdown_dir> <html_dir>
```

5. then you can view your html pages, like [mind.html](https://vogo.github.io/markhtml/examples/mind.html)
