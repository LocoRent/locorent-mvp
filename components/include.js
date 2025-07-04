async function loadFragment(id, file) {
  const el = document.getElementById(id);
  if (el) {
    const res = await fetch(file);
    const html = await res.text();
    el.innerHTML = html;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadFragment("header", "header.html");
  await loadFragment("footer", "footer.html");
  const script = document.createElement("script");
  script.src = "init.js";
  document.body.appendChild(script);
});
