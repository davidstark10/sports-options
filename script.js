// Select all buttons
const buttons = document.querySelectorAll('button');

// Add click listener to each
buttons.forEach(button => {
  button.addEventListener('click', () => {
    button.textContent = "Order Placed!";
    button.style.backgroundColor = "#22c55e"; // green to indicate success
    button.style.cursor = "default";
  });
});
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  const oddsElement = card.querySelector('.odds');
  const badge = card.querySelector('.badge');
  
  let odds = parseInt(oddsElement.textContent.replace(/\D/g,'')); // extract number

  setInterval(() => {
    const change = Math.floor(Math.random() * 101) - 50; // random change -50 to +50
    const newOdds = Math.max(100, odds + change);

    // Update badge based on change
    if (newOdds > odds) {
      badge.textContent = "▲";
      badge.classList.remove("down");
      badge.classList.add("up");
    } else if (newOdds < odds) {
      badge.textContent = "▼";
      badge.classList.remove("up");
      badge.classList.add("down");
    }

    odds = newOdds;
    oddsElement.textContent = `Current MVP Odds: +${odds}`;
  }, 2000); // updates every 2 seconds
});

