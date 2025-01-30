// Game State
let currency = 0;
let upgrades = {
    autoClicker: {
        count: 0,
        baseCost: 10,
        production: 1
    }
};

// DOM Elements
const currencyDisplay = document.getElementById('currency');
const mainButton = document.getElementById('main-button');
const autoClickerBtn = document.querySelector('[data-cost="10"]');

// Main Click Handler
mainButton.addEventListener('click', () => {
    currency += 1;
    updateDisplay();
});

// Auto-Production Loop
setInterval(() => {
    currency += upgrades.autoClicker.count * upgrades.autoClicker.production;
    updateDisplay();
}, 1000);

// Upgrade Purchase System
autoClickerBtn.addEventListener('click', () => {
    const cost = upgrades.autoClicker.baseCost * (upgrades.autoClicker.count + 1);
    
    if (currency >= cost) {
        currency -= cost;
        upgrades.autoClicker.count++;
        updateDisplay();
    }
});

// Update Display Function
function updateDisplay() {
    currencyDisplay.textContent = Math.floor(currency);
    document.getElementById('auto-count').textContent = upgrades.autoClicker.count;
    
    // Update button states
    const nextCost = upgrades.autoClicker.baseCost * (upgrades.autoClicker.count + 1);
    autoClickerBtn.textContent = `Buy (${nextCost} points)`;
    autoClickerBtn.disabled = currency < nextCost;
}

// Initial Display Update
updateDisplay();
