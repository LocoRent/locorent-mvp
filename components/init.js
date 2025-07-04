const supabase = window.supabase.createClient(
  'https://flnjalgqtkqycsaymmbd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbmphbGdxdGtxeWNzYXltbWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTkwOTAsImV4cCI6MjA2NDQzNTA5MH0.pPDeWCrjDrOGeHVJy5YmMQFYUGl7nvAyx3uxhQYNH_Q'
);

let userSession = null;
let selectedAddressData = null;

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
  container.setAttribute('aria-busy', 'true');
  container.innerHTML = '<p>⏳ Lade Angebote…</p>';
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) {
    container.innerHTML = '<p>Fehler beim Laden der neuesten Angebote.</p>';
    console.error('Fehler bei loadNewestOffers:', error);
    return;
  }
  if (data.length === 0) {
    container.innerHTML = '<p>Keine Angebote gefunden.</p>';
    return;
  }
  container.removeAttribute('aria-busy');
  await renderOffers(data, 'newest-offers');
}

async function loadPopularOffers() {
  const container = document.getElementById('popular-offers');
  container.setAttribute('aria-busy', 'true');
  container.innerHTML = '<p>⏳ Lade Angebote…</p>';
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('views', { ascending: false })
    .limit(5);
  if (error) {
    container.innerHTML = '<p>Fehler beim Laden der beliebtesten Angebote.</p>';
    console.error('Fehler bei loadPopularOffers:', error);
    return;
  }
  if (data.length === 0) {
    container.innerHTML = '<p>Keine Angebote gefunden.</p>';
    return;
  }
  container.removeAttribute('aria-busy');
  await renderOffers(data, 'popular-offers');
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

async function renderOffers(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'result-card';
    const isFav = userSession?.user ? await checkIfFavorite(item.id) : false;

    card.innerHTML = `
      <img src="${item.image_urls?.[0] || 'https://via.placeholder.com/400x200'}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p><strong>Kategorie:</strong> ${capitalize(item.category) || 'Unbekannt'}</p>
      <p><strong>Preis pro Tag:</strong> ${item.price_per_day || 'k. A.'} €</p>
      <button onclick="window.location.href='mietobjekt.html?id=${item.id}'">Details ansehen</button>
      <button class="fav-btn">${isFav ? 'Favorit entfernen' : 'Zu Favoriten'}</button>
    `;

    const favBtn = card.querySelector('.fav-btn');
    if (userSession?.user) {
      favBtn.onclick = async (e) => {
        e.preventDefault();
        const nowFav = await toggleFavorite(item.id);
        favBtn.innerText = nowFav ? 'Favorit entfernen' : 'Zu Favoriten';
      };
    } else {
      favBtn.disabled = true;
      favBtn.innerText = "Login erforderlich";
    }

    container.appendChild(card);
  }
}

async function checkIfFavorite(listingId) {
  if (!userSession?.user) return false;
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userSession.user.id)
    .eq('listing_id', listingId)
    .maybeSingle();
  return !!data;
}

async function toggleFavorite(listingId) {
  if (!userSession?.user) return false;
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userSession.user.id)
    .eq('listing_id', listingId)
    .maybeSingle();
  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id);
    return false;
  } else {
    await supabase.from('favorites').insert({ user_id: userSession.user.id, listing_id: listingId });
    return true;
  }
}

document.getElementById('location-input')?.addEventListener('input', async (e) => {
  const value = e.target.value.trim();
  const suggestionsBox = document.getElementById('suggestions');
  if (value.length < 2) return suggestionsBox.innerHTML = '';

  try {
    const res = await fetch(`https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&accept-language=de&countrycodes=de&addressdetails=1&limit=6&q=${encodeURIComponent(value)}`);
    const results = await res.json();
    suggestionsBox.innerHTML = '';

    results.forEach(r => {
      const ort = r.address.city || r.address.town || r.address.village || r.display_name.split(',')[0];
      const bundesland = r.address.state || '';
      const display = [ort, bundesland].filter(Boolean).join(', ');
      const div = document.createElement('div');
      div.textContent = display;
      div.setAttribute('role', 'option');
      div.tabIndex = 0;
      div.onclick = () => {
        document.getElementById('location-input').value = display;
        selectedAddressData = {
          city: ort,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          location: display
        };
        suggestionsBox.innerHTML = '';
      };
      div.onkeydown = (evt) => {
        if(evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          div.click();
        }
      }
      suggestionsBox.appendChild(div);
    });
  } catch(err) {
    console.error("Fehler bei Ortssuche:", err);
  }
});

function search() {
  const keyword = document.getElementById("search-input")?.value.trim();
  const category = document.getElementById("category-select")?.value.trim();
  const location = document.getElementById("location-input")?.value.trim();
  const radius = document.getElementById("radius-select")?.value.trim();
  const params = new URLSearchParams({ keyword, category, location, radius });
  window.location.href = `search_results.html?${params.toString()}`;
}

init();
