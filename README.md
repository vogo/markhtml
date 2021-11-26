*markhtml* is a collection of markdown render utilities, includes features:
- convert markdown to html
- html outline menu
- render math expression using mathjax
- comment system using gittalk
- highlight
- render mind map 

## how to use

1. install commands
```bash
# install markhtml command tool
make install

# generate markdown render javascript library markrender.min.js
make markrender_min
```

2. copy the following files to website:
- markrender.min.js
- markhtml.css
- lib/markmind_render.js

3. create markdown with following headers, like [mind.md](/examples/mind.md)
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

5. then you can view your html pages, like [okr.html](https://wongoo.github.io/note/okr/okr.html)
