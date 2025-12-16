const urlToNameMap = {
  "patrick-mahomes": "Patrick Mahomes",
  "josh-allen": "Josh Allen",
  "lamar-jackson": "Lamar Jackson"
};
const params = new URLSearchParams(window.location.search);
const urlKey = params.get("name");           // e.g., "patrick-mahomes"
const playerKey = urlToNameMap[urlKey];      // converts to "Patrick Mahomes"

if (!playerKey || !playerData[playerKey]) {
  document.body.innerHTML = `<h2>Player not found</h2>`;
  throw new Error("Invalid player key");
}

const player = playerData[playerKey];

// Populate header
document.getElementById("player-title").textContent = `${playerKey} MVP Options`;
document.getElementById("player-image").src = player.image;

// ===== RENDER TABLE FUNCTION =====
const tbody = document.getElementById("options-body");

function renderTable(options) {
  tbody.innerHTML = "";

  options.forEach(opt => {
    const tr = document.createElement("tr");
   tr.innerHTML = `
  <td class="option-cell" data-price="${opt.callBid}" data-strike="${opt.strike}" data-type="CALL">${opt.callBid}</td>
  <td class="option-cell" data-price="${opt.callAsk}" data-strike="${opt.strike}" data-type="CALL">${opt.callAsk}</td>
  <td>${opt.strike}</td>
  <td class="option-cell" data-price="${opt.putBid}" data-strike="${opt.strike}" data-type="PUT">${opt.putBid}</td>
  <td class="option-cell" data-price="${opt.putAsk}" data-strike="${opt.strike}" data-type="PUT">${opt.putAsk}</td>
`;
    tbody.appendChild(tr);
  });
// ===== MARKET DIRECTION =====
const avgCall = player.options.reduce((sum, o) => sum + o.callAsk, 0) / player.options.length;
const avgPut = player.options.reduce((sum, o) => sum + o.putAsk, 0) / player.options.length;

const direction = avgCall < avgPut ? "Bullish" : "Bearish";
const directionEl = document.getElementById("market-direction");
directionEl.textContent = `Market Sentiment: ${direction}`;
directionEl.className = direction.toLowerCase();

  attachOptionClickHandlers();
}

// ===== PANEL LOGIC =====
const panel = document.getElementById("option-panel");
const panelStrike = document.getElementById("panel-strike");
const panelPrice = document.getElementById("panel-price");
const buyBtn = document.getElementById("buy-option-btn");
const closeBtn = document.getElementById("close-panel-btn");

function attachOptionClickHandlers() {
document.querySelectorAll(".option-cell").forEach(cell => {
  cell.addEventListener("click", () => {
    const price = parseFloat(cell.dataset.price);
    const strike = cell.dataset.strike;
    const type = cell.dataset.type;

    // implied probability (decimal odds)
    const impliedProb = (1 / price * 100).toFixed(1);

    panelStrike.textContent = `${type} @ ${strike}`;
    panelPrice.innerHTML = `
      Price: $${price}<br>
      Implied Probability: ${impliedProb}%
    `;

    panel.classList.remove("hidden");
  });
});
}

closeBtn.addEventListener("click", () => {
  panel.classList.add("hidden");
});

buyBtn.addEventListener("click", () => {
  alert("Order placed!");
  panel.classList.add("hidden");
});

// ===== STRIKE SORTING =====
const sortAscBtn = document.getElementById("sort-asc");
const sortDescBtn = document.getElementById("sort-desc");

sortAscBtn.addEventListener("click", () => {
  player.options.sort((a, b) => {
    return parseInt(a.strike.replace("+", "")) - parseInt(b.strike.replace("+", ""));
  });
  renderTable(player.options);
});

sortDescBtn.addEventListener("click", () => {
  player.options.sort((a, b) => {
    return parseInt(b.strike.replace("+", "")) - parseInt(a.strike.replace("+", ""));
  });
  renderTable(player.options);
});

// ===== INITIAL RENDER =====
renderTable(player.options);

