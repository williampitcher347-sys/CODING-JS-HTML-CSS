function runCode() {
  const html = document.getElementById("htmlCode").value;
  const css = "<style>" + document.getElementById("cssCode").value + "</style>";
  const js = "<script>" + document.getElementById("jsCode").value + "<\/script>";

  const output = document.getElementById("output");
  output.srcdoc = html + css + js;
}
