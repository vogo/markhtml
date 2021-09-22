package main

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/vogo/vogo/vos"
)

var exeModTime time.Time

var ignoreFiles = [...]string{"Makefile", "index.md"}

func isIgnoreFile(f string) bool {
	for _, s := range ignoreFiles {
		if s == f {
			return true
		}
	}
	return false
}

func main() {
	exe, err := os.Executable()
	if err != nil {
		panic(err)
	}

	stat, statErr := os.Stat(exe)
	if statErr != nil {
		panic(statErr)
	}
	exeModTime = stat.ModTime()

	markdownDir := os.Args[1]
	targetHTMLDir := os.Args[2]

	vos.LoadUserEnv()

	if err := convertDir(markdownDir, targetHTMLDir); err != nil {
		panic(err)
	}
}

// convertDir 转化目录
func convertDir(src string, target string) error {
	d, err := os.Open(src)
	if err != nil {
		return err
	}

	_ = os.Mkdir(target, os.ModePerm)

	files, dirErr := d.Readdir(-1)
	if dirErr != nil {
		return dirErr
	}

	var indexLinks []string

	for _, f := range files {
		name := f.Name()

		// ignore self/parent and hidden directory.
		if name[0] == '.' {
			continue
		}

		if f.IsDir() {
			subDir := filepath.Join(src, name)
			subTargetDir := filepath.Join(target, name)
			if err = convertDir(subDir, subTargetDir); err != nil {
				return err
			}

			indexLinks = append(indexLinks, "- ["+name+"]("+name+")")

			continue
		}

		if isIgnoreFile(name) {
			continue
		}

		from := filepath.Join(src, name)
		to := ""
		isMarkdown := false

		if strings.HasSuffix(name, ".md") || strings.HasSuffix(name, ".MD") {
			htmlName := name[:len(name)-2] + "html"
			to = filepath.Join(target, htmlName)
			isMarkdown = true

			link, indexErr := parseIndexLink(htmlName, from)
			if indexErr != nil {
				return indexErr
			}
			indexLinks = append(indexLinks, link)

		} else {
			to = filepath.Join(target, name)
		}

		if err = doCopyOrConvert(from, f.ModTime(), isMarkdown, to); err != nil {
			return err
		}
	}

	if indexErr := buildIndexMarkdown(src, target, indexLinks); indexErr != nil {
		return indexErr
	}

	return nil
}

// buildIndexMarkdown 生成索引页面
func buildIndexMarkdown(src string, target string, indexLinks []string) error {
	srcIndexMd := filepath.Join(src, "index.md")
	indexBuf := bytes.NewBuffer(nil)
	for _, link := range indexLinks {
		indexBuf.WriteString(link)
		indexBuf.WriteByte('\n')
	}
	if writeErr := os.WriteFile(srcIndexMd, indexBuf.Bytes(), os.ModePerm); writeErr != nil {
		return writeErr
	}

	targetIndexHtml := filepath.Join(target, "index.html")

	if err := markdown2html(srcIndexMd, targetIndexHtml); err != nil {
		return err
	}

	return nil
}

// doCopyOrConvert 拷贝或转换生成html
func doCopyOrConvert(from string, fromModTime time.Time, isMarkdown bool, to string) error {
	stat, statErr := os.Stat(to)
	if statErr != nil {
		if !os.IsNotExist(statErr) {
			return statErr
		}
	} else {
		if stat.ModTime().After(fromModTime) {
			if !isMarkdown || stat.ModTime().After(exeModTime) {
				// not need to copy again if the mod time is after that of the source file.
				return nil
			}
		} else {
			_ = os.Remove(to)
		}
	}

	if !isMarkdown {
		if err := copyTo(from, to); err != nil {
			return err
		}
		return nil
	}

	if err := markdown2html(from, to); err != nil {
		return err
	}

	return nil
}

var NoMarkMetaFound = errors.New("no markmeta found")

// parseIndexLink 解析索引连接
func parseIndexLink(htmlName string, markName string) (string, error) {
	fromFile, fileErr := os.Open(markName)
	if fileErr != nil {
		return "", fileErr
	}

	scanner := bufio.NewScanner(fromFile)

	if !scanner.Scan() || !strings.HasPrefix(scanner.Text(), "<!--") {
		return "", fmt.Errorf("%v: %s", NoMarkMetaFound, markName)
	}

	markmeta := make(map[string]string, 8)
	var line string
	for scanner.Scan() {
		line = scanner.Text()
		if !strings.HasPrefix(line, "markmeta_") {
			break
		}
		arr := strings.SplitN(line, ":", 2)
		if len(arr) != 2 {
			break
		}
		markmeta[strings.TrimSpace(arr[0])] = strings.TrimSpace(arr[1])
	}

	var ok bool
	var title, author, date string

	title, ok = markmeta["markmeta_title"]
	if !ok {
		return "", fmt.Errorf("%v: %s in %s", NoMarkMetaFound, "markmeta_title", markName)
	}
	author, ok = markmeta["markmeta_author"]
	if !ok {
		return "", fmt.Errorf("%v: %s in %s", NoMarkMetaFound, "markmeta_author", markName)
	}
	date, ok = markmeta["markmeta_date"]
	if !ok {
		return "", fmt.Errorf("%v: %s in %s", NoMarkMetaFound, "markmeta_date", markName)
	}

	link := "- " + date + ", [" + title + "](" + htmlName + "), " + author

	return link, nil

}

// copyTo 文件拷贝
func copyTo(from string, to string) error {
	fmt.Printf("copy %s to %s\n", from, to)

	target, createErr := os.Create(to)
	if createErr != nil {
		return createErr
	}

	src, openErr := os.Open(from)
	if openErr != nil {
		return openErr
	}

	_, err := io.Copy(src, target)

	return err

}

// markdown2html markdown转化为html
func markdown2html(from string, to string) error {
	fmt.Printf("markdown2html %s to %s\n", from, to)

	buf := new(bytes.Buffer)
	buf.WriteString(Files["index-template-prefix.html"])

	markBuf, err := bash("marked " + from)
	if err != nil {
		return err
	}

	buf.Write(markBuf)
	buf.WriteString(Files["index-template-suffix.html"])

	if err = ioutil.WriteFile(to, buf.Bytes(), os.ModePerm); err != nil {
		return err
	}

	return nil
}

func bash(fullCommand string) ([]byte, error) {
	cmd := exec.Command("/bin/sh", "-c", fullCommand)
	return cmd.CombinedOutput()
}
