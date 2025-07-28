document.addEventListener('DOMContentLoaded', function() {
  const items = [
    { category: 'Pistol', name: 'Desert Eagle' },
    { category: 'Knives', name: 'Karambit' },
    { category: 'Rifle', name: 'AK-47' },
    { category: 'Gloves', name: 'Sport Gloves' },
    { category: 'Mid-Tier', name: 'UMP-45' }
  ];
  const tbody = document.querySelector('#items-table tbody');
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.category}</td>
      <td>${item.name}</td>
      <td><button onclick="alert('Deleted: ${item.name}')">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
});
