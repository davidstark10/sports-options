function impliedProbFromOdds(odds) {
  const o = parseInt(odds.toString().replace("+", ""));
  return 100 / (o + 100);
}

function optionValue({ type, strikeOdds, currentOdds }) {
  const strikeProb = impliedProbFromOdds(strikeOdds);
  const currentProb = impliedProbFromOdds(currentOdds);

  if (type === "CALL") {
    return Math.max(0, currentProb - strikeProb);
  } else {
    return Math.max(0, strikeProb - currentProb);
  }
}

function renderPortfolio() {
  const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
  const tbody = document.getElementById("portfolio-body");
  tbody.innerHTML = "";

  portfolio.forEach(opt => {
    const currentOddsValue = currentOdds[opt.player];

    const value = optionValue({
  type: opt.type,
  strikeOdds: opt.strike,
  currentOdds: currentOddsValue
});

let pnl;
let roi;

if (opt.side === "SHORT") {
  pnl = opt.entryPrice - value;
  roi = (pnl / opt.entryPrice) * 100;
} else {
  pnl = value - opt.entryPrice;
  roi = (pnl / opt.entryPrice) * 100;
}

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${opt.player}</td>
      <td>${opt.type} (${opt.side})</td>
      <td>${opt.strike}</td>
      <td>$${opt.entryPrice.toFixed(2)}</td>
      <td>+${currentOddsValue}</td>
      <td>$${value.toFixed(2)}</td>
      <td class="${roi >= 0 ? "positive" : "negative"}">
        ${roi.toFixed(1)}%
      </td>
      <td>
        <button class="sell-btn" data-id="${opt.id}">
  ${opt.side === "SHORT" ? "Buy to Close" : "Sell"}
</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachSellHandlers();
}

function attachSellHandlers() {
  document.querySelectorAll(".sell-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      let portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
      const position = portfolio.find(p => p.id === id);

      if (!position) return;

      const currentOddsValue = currentOdds[position.player];

      const value = optionValue({
        type: position.type,
        strikeOdds: position.strike,
        currentOdds: currentOddsValue
      });

     let pnl;

if (position.side === "SHORT") {
  pnl = position.entryPrice - value;
} else {
  pnl = value - position.entryPrice;
}

      const confirmSell = confirm(
  `${position.side === "SHORT" ? "Buy to Close" : "Sell"} ` +
  `${position.player} ${position.type} @ ${position.strike}\n\n` +
  `Settlement: $${value.toFixed(2)}\n` +
  `P/L: ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`
);

      if (!confirmSell) return;

      // Remove from portfolio
      portfolio = portfolio.filter(p => p.id !== id);
      localStorage.setItem("portfolio", JSON.stringify(portfolio));

      renderPortfolio();
    });
  });
}

// Initial render
renderPortfolio();

// Re-render every time odds update
setInterval(renderPortfolio, 3000);
