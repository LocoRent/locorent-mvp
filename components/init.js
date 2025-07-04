const supabase = window.supabase.createClient(
  'https://flnjalgqtkqycsaymmbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbmphbGdxdGtxeWNzYXltbWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTkwOTAsImV4cCI6MjA2NDQzNTA5MH0.pPDeWCrjDrOGeHVJy5YmMQFYUGl7nvAyx3uxhQYNH_Q'
);

let userSession = null;

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  userSession = session;
  updateNav();
}

function updateNav() {
  const nav = document.getElementById('nav-links');
  nav.innerHTML = userSession?.user ? `
    <a href="index.html">Start</a>
    <a href="profil.html">Mein Profil</a>
    <a href="nachrichten-inbox.html">📨 Nachrichten</a>
    <a href="favoriten.html">Meine Favoriten</a>
    <a href="inserate.html">Meine Inserate</a>
    <a href="#" onclick="logout(event)">Logout</a>
  ` : `
    <a href="index.html">Start</a>
    <a href="login.html">Einloggen</a>
    <a href="register.html">Registrieren</a>
  `;
}

async function logout(event) {
  event.preventDefault();
  await supabase.auth.signOut();
  window.location.href = "login.html";
}
