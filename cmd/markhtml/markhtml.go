package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/vogo/vogo/vos"
)

func main() {
	markdownDir := os.Args[1]
	targetHTMLDir := os.Args[2]

	vos.LoadUserEnv()

	if err := convertDir(markdownDir, targetHTMLDir); err != nil {
		panic(err)
	}
}

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
			continue
		}

		from := filepath.Join(src, name)
		to := ""
		doCopy := false

		if strings.HasSuffix(name, ".md") || strings.HasSuffix(name, ".MD") {
			to = filepath.Join(target, name[:len(name)-2]+"html")
		} else {
			to = filepath.Join(target, name)
			doCopy = true
		}

		stat, statErr := os.Stat(to)
		if statErr != nil {
			if !os.IsNotExist(statErr) {
				return statErr
			}
		} else {
			if stat.ModTime().After(f.ModTime()) {
				// not need to copy again if the mod time is after that of the source file.
				continue
			} else {
				_ = os.Remove(to)
			}
		}

		if doCopy {
			if err = copyTo(from, to); err != nil {
				return err
			}
			continue
		}

		if err = convert(from, to); err != nil {
			return err
		}
	}

	return nil
}

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

func convert(from string, to string) error {
	fmt.Printf("convert %s to %s\n", from, to)

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
