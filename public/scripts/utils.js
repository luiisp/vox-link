const h = document.getElementById('actual-hour');
function u() {
    const d = new Date();
    const hr = d.getHours();
    const m = d.getMinutes();

    const fm = m.toString().padStart(2, '0');

    h.textContent = `${hr}:${fm}`;
}

u();
setInterval(u, 60000);
