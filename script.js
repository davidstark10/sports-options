document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    Object.keys(currentOdds).forEach(player => {
      // Random change
      const change = Math.random() < 0.5 ? -50 : 50;
      const newValue = Math.max(100, currentOdds[player] + change);
      currentOdds[player] = newValue;

      // Update DOM on main page
      const el = document.querySelector(`.odds[data-player="${player}"] .odds-num`);
      if (el) {
        el.textContent = `+${newValue}`;
        el.classList.remove('odds-up', 'odds-down');
        void el.offsetWidth;
        el.classList.add(change < 0 ? 'odds-up' : 'odds-down');
      }
    });
  }, 3000);
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
document.querySelectorAll('.options-table tbody tr').forEach(row => {
  // Call and Put bid/ask cells
  const clickableCells = [
    row.querySelector('td:nth-child(1)'), // Call Bid
    row.querySelector('td:nth-child(2)'), // Call Ask
    row.querySelector('td:nth-child(4)'), // Put Bid
    row.querySelector('td:nth-child(5)')  // Put Ask
  ];

  clickableCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const strike = row.querySelector('td:nth-child(3)').textContent;
      const price = cell.textContent;

      document.getElementById('panel-strike').textContent = `Strike Price: ${strike}`;
      document.getElementById('panel-price').textContent = `Option Price: $${price}`;
      document.getElementById('option-panel').classList.remove('hidden');
    });
  });
});

  // Buy button logic
  buyBtn.addEventListener('click', () => {
    alert(`Bought option at ${panelPrice.textContent}!`);
    panel.classList.add('hidden');
  });
});
