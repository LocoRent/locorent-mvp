    const supabase = window.supabase.createClient(
      'https://flnjalgqtkqycsaymmbd.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbmphbGdxdGtxeWNzYXltbWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTkwOTAsImV4cCI6MjA2NDQzNTA5MH0.pPDeWCrjDrOGeHVJy5YmMQFYUGl7nvAyx3uxhQYNH_Q'
    );


let userSession = null;

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  userSession = session;
  updateNav();
  await loadNewestOffers();
  await loadPopularOffers();
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

async function loadNewestOffers() {
  const container = document.getElementById('newest-offers');
  container.innerHTML = '⏳ Lade Angebote…';
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error || !data.length) {
    container.innerHTML = '<p>Keine Angebote gefunden.</p>';
    return;
  }
  renderOffers(data, container);
}

async function loadPopularOffers() {
  const container = document.getElementById('popular-offers');
  container.innerHTML = '⏳ Lade Angebote…';
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('views', { ascending: false })
    .limit(5);
  if (error || !data.length) {
    container.innerHTML = '<p>Keine Angebote gefunden.</p>';
    return;
  }
  renderOffers(data, container);
}

function renderOffers(data, container) {
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${item.image_urls?.[0] || 'https://via.placeholder.com/400x200'}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p><strong>Kategorie:</strong> ${item.category}</p>
      <p><strong>Preis:</strong> ${item.price_per_day} € / Tag</p>
      <button onclick="window.location.href='mietobjekt.html?id=${item.id}'">Details ansehen</button>
    `;
    container.appendChild(card);
  });
}
