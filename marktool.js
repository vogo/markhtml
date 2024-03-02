function dom(id) {
  return document.getElementById(id)
}

function ndom(n) {
  return document.createElement(n)
}

function endwith(s, c) {
  return s.indexOf(c, s.length - c.length) != -1;
}

function hfmt(text) {
  return text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
}

function validvar(v) {
  return typeof v !== 'undefined' && v !== null
}