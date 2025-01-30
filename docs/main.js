// Game State
let money = 0;
let pickaxe = {
    efficiency: 1,
    fortune: 1,
    luck: 0,
    power: 2,
    costs: {
        efficiency: 100,
        fortune: 200,
        luck: 300,
        power: 400
    }
};

// Block Types Configuration
const blockTypes = [
    { type: 'dirt', hp: 10, value: 5, color: '#8B4513' },
    { type: 'sand', hp: 20, value: 10, color: '#F4A460' },
    { type: 'grass', hp: 30, value: 15, color: '#567D46' },
    { type: 'stone', hp: 50, value: 25, color: '#808080' }
];

// Initialize game
generateBlocks();
updateDisplay();
updateUpgradeButtons();

// Game Functions
function generateBlocks() {
    const container = document.getElementById('blocks-container');
    container.innerHTML = '';
    
    blockTypes.forEach(block => {
        const div = document.createElement('div');
        div.className = `block ${block.type}`;
        div.innerHTML = `
            <div>${block.type.toUpperCase()}</div>
            <div>HP: ${block.hp}</div>
            <div>Value: $${block.value}</div>
        `;
        div.addEventListener('click', () => mineBlock(block));
        container.appendChild(div);
    });
}

function mineBlock(block) {
    let damage = pickaxe.efficiency;
    
    // Check for critical hit
    if (Math.random() < pickaxe.luck / 100) {
        damage *= pickaxe.power;
    }

    block.hp -= damage;
    
    if (block.hp <= 0) {
        money += block.value * pickaxe.fortune;
        block.hp = blockTypes.find(b => b.type === block.type).hp; // Reset HP
        updateDisplay();
    }
    
    updateBlockDisplay(block);
}

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

function updateDisplay() {
    document.getElementById('money').textContent = `Money: $${money}`;
    document.getElementById('efficiency').textContent = `Efficiency: ${pickaxe.efficiency}`;
    document.getElementById('fortune').textContent = `Fortune: ${pickaxe.fortune}x`;
    document.getElementById('luck').textContent = `Luck: ${pickaxe.luck}%`;
    document.getElementById('power').textContent = `Critical Power: ${pickaxe.power}x`;
}

function updateBlockDisplay(block) {
    const blocks = document.getElementsByClassName(block.type);
    Array.from(blocks).forEach(element => {
        element.innerHTML = `
            <div>${block.type.toUpperCase()}</div>
            <div>HP: ${Math.max(0, block.hp)}</div>
            <div>Value: $${block.value}</div>
        `;
    });
}

function updateUpgradeButtons() {
    Object.keys(pickaxe.costs).forEach(type => {
        const btn = document.getElementById(`${type}-btn`);
        btn.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ($${pickaxe.costs[type]})`;
        btn.disabled = money < pickaxe.costs[type];
    });
}

// Save System
function saveGame() {
    localStorage.setItem('blockBreakerSave', JSON.stringify({
        money,
        pickaxe
    }));
}

function loadGame() {
    const save = localStorage.getItem('blockBreakerSave');
    if (save) {
        const data = JSON.parse(save);
        money = data.money;
        pickaxe = data.pickaxe;
        updateDisplay();
        updateUpgradeButtons();
    }
}

// Auto-save every 30 seconds
setInterval(saveGame, 30000);
window.onload = loadGame;
