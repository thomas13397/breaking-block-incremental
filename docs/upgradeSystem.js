// Upgrade Functions
function buyUpgrade(type) {
    const cost = pickaxe.costs[type];
    
    if (money >= cost) {
        money -= cost;
        pickaxe[type] += type === 'luck' ? 5 : 1;
        pickaxe.costs[type] = Math.floor(cost * 1.5);
        updateDisplay();
        updateUpgradeButtons();
    }
}

function updateUpgradeButtons() {
    Object.keys(pickaxe.costs).forEach(type => {
        const btn = document.getElementById(`${type}-btn`);
        btn.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ($${pickaxe.costs[type]})`;
        btn.disabled = money < pickaxe.costs[type];
    });
}
