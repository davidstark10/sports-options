// oddsUpdater.js

/**
 * Randomly update odds for all players, update DOM elements, and trigger flash animations.
 * @param {Object} currentOdds - shared odds object
 * @param {string} selectorPrefix - prefix for querySelector targeting odds elements (optional)
 */
function startOddsSimulation(currentOdds, selectorPrefix = '') {
  function updateDOM(player, change) {
    // Update any matching DOM element for this player
    const el = document.querySelector(`${selectorPrefix}.odds[data-player="${player}"] .odds-num`);
    if (el) {
      el.textContent = `+${currentOdds[player]}`;
      el.classList.remove('odds-up', 'odds-down');
      void el.offsetWidth; // force reflow for CSS animation
      el.classList.add(change < 0 ? 'odds-up' : 'odds-down');
    }
  }

  setInterval(() => {
    Object.keys(currentOdds).forEach(player => {
      const change = Math.random() < 0.5 ? -50 : 50;
      currentOdds[player] = Math.max(100, currentOdds[player] + change);
      updateDOM(player, change);
    });
  }, 3000);
}
