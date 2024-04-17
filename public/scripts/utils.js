const h = document.getElementById("actual-hour");
function u() {
  const d = new Date();
  const hr = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();

  const fm = m.toString().padStart(2, "0");

  h.textContent = `${hr}:${fm}:${s}`;
}
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    u();
  }
});
u();
setInterval(u, 1000);
