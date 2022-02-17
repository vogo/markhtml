package main

import _ "embed"

//go:embed index-template-prefix.html
var indexTemplatePrefixHTML []byte

//go:embed index-template-suffix.html
var indexTemplateSuffixHTML []byte
