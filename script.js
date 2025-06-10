const dummyData = [
  {
    title: 'E-Bike zu vermieten',
    category: 'fahrzeuge',
    location: 'Berlin',
    description: 'Leistungsstarkes E-Bike für Ausflüge oder tägliches Pendeln.'
  },
  {
    title: 'Akkubohrer Bosch 18V',
    category: 'werkzeuge',
    location: 'Hamburg',
    description: 'Zuverlässiger Akkubohrer mit Ladegerät und Koffer.'
  },
  {
    title: 'Beamer FullHD',
    category: 'elektronik',
    location: 'München',
    description: 'Ideal für Filmabende oder Präsentationen.'
  },
  {
    title: 'SUP Board aufblasbar',
    category: 'freizeit',
    location: 'Köln',
    description: 'Für entspannte Stunden auf dem Wasser.'
  }
];

function renderResults(items) {
  const results = document.getElementById('results');
  results.innerHTML = '';

  if (items.length === 0) {
    results.innerHTML = '<p>Keine passenden Angebote gefunden.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Ort:</strong> ${item.location}</p>
      <p>${item.description}</p>
    `;
    results.appendChild(card);
  });
}

function search() {
  const keyword = document.getElementById('search-input').value.toLowerCase();
  const category = document.getElementById('category-select').value;
  const location = document.getElementById('location-input').value.toLowerCase();

  const filtered = dummyData.filter(item =>
    (!keyword || item.title.toLowerCase().includes(keyword)) &&
    (!category || item.category === category) &&
    (!location || item.location.toLowerCase().includes(location))
  );

  renderResults(filtered);
}

function filterByCategory(cat) {
  document.getElementById('category-select').value = cat;
  search();
}
