document.addEventListener('DOMContentLoaded', function() {
    let recommendations = [];
  
    // Fetch and flatten recommendations
    fetch('travel_recommendation_api.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        recommendations = flattenRecommendations(data);
      })
      .catch(error => {
        console.error('Error fetching travel recommendations:', error);
        document.getElementById('results').innerHTML = '<p>Error loading recommendations.</p>';
      });
  
    // Flatten the JSON structure into a flat array for searching
    function flattenRecommendations(data) {
      let flat = [];
      // Add all cities from countries
      if (data.countries) {
        data.countries.forEach(country => {
          if (country.cities) {
            country.cities.forEach(city => {
              flat.push({
                name: city.name,
                imageUrl: city.imageUrl,
                description: city.description,
                type: 'city',
                country: country.name
              });
            });
          }
        });
      }
      // Add all temples
      if (data.temples) {
        data.temples.forEach(temple => {
          flat.push({
            name: temple.name,
            imageUrl: temple.imageUrl,
            description: temple.description,
            type: 'temple'
          });
        });
      }
      // Add all beaches
      if (data.beaches) {
        data.beaches.forEach(beach => {
          flat.push({
            name: beach.name,
            imageUrl: beach.imageUrl,
            description: beach.description,
            type: 'beach'
          });
        });
      }
      return flat;
    }
  
    // Keyword variations mapping
    const keywordMap = {
      beach: ['beach', 'beaches'],
      temple: ['temple', 'temples'],
      country: ['country', 'countries'],
      city: ['city', 'cities']
    };
  
    // Function to match input with variations
    function matchKeyword(input) {
      input = input.toLowerCase().trim();
      for (const key in keywordMap) {
        if (keywordMap[key].includes(input)) {
          return key;
        }
      }
      return input;
    }
  
    // Function to display results
    function displayResults(results) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';
      if (!results || results.length === 0) {
        resultsDiv.innerHTML = '<p>No recommendations found.</p>';
        return;
      }
      results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" style="width:150px;height:100px;object-fit:cover;">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          ${item.country ? `<p><strong>Country:</strong> ${item.country}</p>` : ''}
          <p><em>Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</em></p>
        `;
        resultsDiv.appendChild(card);
      });
    }
  
    // Search form event handler
    document.getElementById('searchForm').addEventListener('submit', function(event) {
      event.preventDefault();
      if (recommendations.length === 0) {
        displayResults([]);
        return;
      }
      const userInput = document.getElementById('searchInput').value;
      const normalizedKeyword = matchKeyword(userInput);
  
      // Search by type, name, description, or country
      const matched = recommendations.filter(item =>
        (item.type && item.type.toLowerCase() === normalizedKeyword) ||
        (item.name && item.name.toLowerCase().includes(normalizedKeyword)) ||
        (item.description && item.description.toLowerCase().includes(normalizedKeyword)) ||
        (item.country && item.country.toLowerCase().includes(normalizedKeyword))
      );
  
      displayResults(matched);
    });
  
    // Optional: Reset button handler
    window.resetSearch = function() {
      document.getElementById('searchInput').value = '';
      document.getElementById('results').innerHTML = '';
    };
  });
  