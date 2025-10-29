// Get player name from URL (e.g., player.html?name=Patrick+Mahomes)
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get("name");

document.getElementById("player-name").textContent = playerName + " Options";

// Example fake options data (you’ll replace this later)
const mockData = [
  { strike: 100, callBid: 2.3, callAsk: 2.6, putBid: 1.9, putAsk: 2.2 },
  { strike: 110, callBid: 1.5, callAsk: 1.8, putBid: 2.9, putAsk: 3.1 },
  { strike: 120, callBid: 0.9, callAsk: 1.1, putBid: 3.8, putAsk: 4.0 }
];

// Render table rows
const tableBody = document.getElementById("options-data");
mockData.forEach(row => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.strike}</td>
    <td>${row.callBid}</td>
    <td>${row.callAsk}</td>
    <td>${row.putBid}</td>
    <td>${row.putAsk}</td>
  `;
  tableBody.appendChild(tr);
});
// script.js
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById('option-panel');
  const panelStrike = document.getElementById('panel-strike');
  const panelPrice = document.getElementById('panel-price');
  const closeBtn = document.getElementById('close-panel-btn');
  const buyBtn = document.getElementById('buy-option-btn');

  // Close button
  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  // Select all bid and ask cells
  document.querySelectorAll('.options-table tbody td').forEach(cell => {
    cell.addEventListener('click', () => {
      const row = cell.closest('tr');
      const strike = row.querySelector('td:nth-child(3)').textContent; // middle column is Strike
      const price = cell.textContent;

      panelStrike.textContent = `Strike Price: ${strike}`;
      panelPrice.textContent = `Option Price: $${price}`;
      panel.classList.remove('hidden');
    });
  });

  // Buy button logic
  buyBtn.addEventListener('click', () => {
    alert(`Bought option at ${panelPrice.textContent}!`);
    panel.classList.add('hidden');
  });
});