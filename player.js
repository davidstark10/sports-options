// ================= PLAYER NAME MAP =================
const urlToNameMap = {
  "patrick-mahomes": "Patrick Mahomes",
  "josh-allen": "Josh Allen",
  "lamar-jackson": "Lamar Jackson"
};

// ================= URL & PLAYER DATA =================
const params = new URLSearchParams(window.location.search);
const urlKey = params.get("name");           // e.g., "patrick-mahomes"
const playerKey = urlToNameMap[urlKey];      // converts to "Patrick Mahomes"

if (!playerKey || !playerData[playerKey]) {
  document.body.innerHTML = `<h2>Player not found</h2>`;
  throw new Error("Invalid player key");
}

const player = playerData[playerKey];

// ================= DOM ELEMENTS =================
const tbody = document.getElementById("options-body");
const panel = document.getElementById("option-panel");
const panelStrike = document.getElementById("panel-strike");
const buyBtn = document.getElementById("buy-option-btn");
const closeBtn = document.getElementById("close-panel-btn");

// ================= POPULATE HEADER =================
document.getElementById("player-title").textContent = `${playerKey} MVP Options`;
document.getElementById("player-image").src = player.image;

// ================= UTILITY FUNCTIONS =================

// Convert American odds (+800) → implied probability (0–1)
function impliedProbFromOdds(odds) {
  const o = parseInt(odds.toString().replace("+", ""));
  return 100 / (o + 100);
}

// Calculate option value (cash-settled, $1 max)
function optionValue({ type, strikeOdds, currentOdds }) {
  const strikeProb = impliedProbFromOdds(strikeOdds);
  const currentProb = impliedProbFromOdds(currentOdds);

  if (type === "CALL") return Math.max(0, currentProb - strikeProb);
  else return Math.max(0, strikeProb - currentProb);
}

// Max possible payout for this option ($1 settlement)
function maxPayout({ type, strikeOdds }) {
  const strikeProb = impliedProbFromOdds(strikeOdds);
  return type === "CALL" ? 1 - strikeProb : strikeProb;
}

// ================= RENDER OPTIONS TABLE =================
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

  attachOptionClickHandlers(); // attach click handlers after table is rendered
}

// ================= PANEL LOGIC =================
function attachOptionClickHandlers() {
  document.querySelectorAll(".option-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const entryPrice = parseFloat(cell.dataset.price);
      const strikeOdds = cell.dataset.strike;
      const type = cell.dataset.type;

      // LIVE dynamic odds
      const currentOddsValue = currentOdds[playerKey];

      // Calculations
      const value = optionValue({ type, strikeOdds, currentOdds: currentOddsValue });
      const max = maxPayout({ type, strikeOdds });
      const roi = ((value - entryPrice) / entryPrice) * 100;

      // Populate panel
      panelStrike.textContent = `${type} @ ${strikeOdds}`;
      document.getElementById("panel-entry").textContent = `Entry Price: $${entryPrice.toFixed(2)}`;
      document.getElementById("panel-current").textContent = `Current Odds: +${currentOddsValue}`;
      document.getElementById("panel-value").textContent = `Current Value: $${value.toFixed(2)}`;
      document.getElementById("panel-max").textContent = `Max Payout: $${max.toFixed(2)}`;
      document.getElementById("panel-roi").textContent = `ROI: ${roi.toFixed(1)}%`;

      panel.classList.remove("hidden");
    });
  });
}

// Close & Buy buttons
closeBtn.addEventListener("click", () => panel.classList.add("hidden"));
buyBtn.addEventListener("click", () => {
  alert("Order placed!");
  panel.classList.add("hidden");
});

// ================= SORT BUTTONS =================
document.getElementById("sort-asc").addEventListener("click", () => {
  player.options.sort((a, b) => parseInt(a.strike.replace("+", "")) - parseInt(b.strike.replace("+", "")));
  renderTable(player.options);
});

document.getElementById("sort-desc").addEventListener("click", () => {
  player.options.sort((a, b) => parseInt(b.strike.replace("+", "")) - parseInt(a.strike.replace("+", "")));
  renderTable(player.options);
});

// ================= INITIAL RENDER =================
renderTable(player.options);

// ================= DYNAMIC ODDS UPDATER =================
document.addEventListener("DOMContentLoaded", () => {
  function updateCurrentOdds() {
    const oddsValueEl = document.getElementById("current-odds-value");
    const playerOdds = currentOdds[playerKey];
    if (oddsValueEl) oddsValueEl.textContent = `+${playerOdds}`;

    // Update panel if open
    if (!panel.classList.contains("hidden")) {
      document.getElementById("panel-current").textContent = `Current Odds: +${playerOdds}`;
    }

    // Update options table values dynamically
    document.querySelectorAll(".option-cell").forEach(cell => {
      // Recalculate ROI / value if needed
      const entryPrice = parseFloat(cell.dataset.price);
      const strikeOdds = cell.dataset.strike;
      const type = cell.dataset.type;
      const value = optionValue({ type, strikeOdds, currentOdds: playerOdds });
      const roi = ((value - entryPrice) / entryPrice) * 100;

      // Optional: update a small tooltip or visual if you want
      // cell.title = `ROI: ${roi.toFixed(1)}%`; // Example
    });
  }

  // Start simulation
  setInterval(() => {
    const change = Math.random() < 0.5 ? -50 : 50;
    const newValue = Math.max(100, currentOdds[playerKey] + change);
    currentOdds[playerKey] = newValue;

    updateCurrentOdds();
  }, 3000);
});
