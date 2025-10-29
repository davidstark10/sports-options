document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    const oddsElements = document.querySelectorAll('.odds');
    oddsElements.forEach(el => {
      const oddsNum = el.querySelector('.odds-num');
      if (!oddsNum) return;

      // Find number
      const match = oddsNum.textContent.match(/\+(\d+)/);
      if (!match) return;
      const currentValue = parseInt(match[1]);
      const change = Math.random() < 0.5 ? -50 : 50;
      const newValue = Math.max(100, currentValue + change);
      const improved = change < 0;

      oddsNum.textContent = `+${newValue}`;
      oddsNum.classList.remove('odds-up', 'odds-down');
      void oddsNum.offsetWidth;
      oddsNum.classList.add(improved ? 'odds-up' : 'odds-down');
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
