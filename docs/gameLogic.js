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
    { type: 'dirt', hp: 10, value: 5, color: '#8B4513', unlocked: true },
    { type: 'sand', hp: 20, value: 10, color: '#F4A460', unlocked: false },
    { type: 'grass', hp: 30, value: 15, color: '#567D46', unlocked: false },
    { type: 'stone', hp: 50, value: 25, color: '#808080', unlocked: false }
];

// Track blocks broken
let blocksBroken = { dirt: 0, sand: 0, grass: 0, stone: 0 };

// Initialize game
generateBlocks();
updateDisplay();
updateUpgradeButtons();

// Game Functions
function generateBlocks() {
    const container = document.getElementById('blocks-container');
    container.innerHTML = '';
    
    blockTypes.forEach((block, index) => {
        if (block.unlocked) {
            const div = document.createElement('div');
            div.className = `block ${block.type}`;
            div.innerHTML = `
                <div>${block.type.toUpperCase()}</div>
                <div>HP: ${block.hp}</div>
                <div>Value: $${block.value}</div>
            `;
            div.addEventListener('click', () => mineBlock(block));
            container.appendChild(div);
        }
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
        // Add money based on block value and fortune
        money += block.value * pickaxe.fortune;
        
        // Reset the block's HP to its original value
        const originalBlock = blockTypes.find(b => b.type === block.type);
        block.hp = originalBlock.hp;
        
        // Track blocks broken
        blocksBroken[block.type]++;
        
        // Unlock the next block if conditions are met
        unlockNextBlock(block.type);
        
        // Update the display
        updateDisplay();
    }
    
    // Update the block's display
    updateBlockDisplay(block);
}

function unlockNextBlock(currentBlockType) {
    const blockIndex = blockTypes.findIndex(b => b.type === currentBlockType);
    if (blockIndex < blockTypes.length - 1) {
        const nextBlock = blockTypes[blockIndex + 1];
        if (!nextBlock.unlocked && blocksBroken[currentBlockType] >= 5) { // Unlock after 5 breaks
            nextBlock.unlocked = true;
            generateBlocks(); // Regenerate blocks to show the newly unlocked one
        }
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

// Carousel Navigation
function moveCarousel(direction) {
    const container = document.querySelector('.blocks-container');
    const scrollAmount = 200; // Adjust as needed
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}
