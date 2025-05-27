import Wheel from './wheel.js';

class Game {
    constructor() {
        this.wheel = new Wheel('wheelCanvas');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Spin button
        document.getElementById('spinButton').addEventListener('click', () => {
            this.wheel.spin();
        });
        
        // Listen for wheel stop event
        document.addEventListener('wheelStopped', (e) => {
            const result = e.detail;
            this.handleWheelResult(result);
        });
    }
    
    handleWheelResult(result) {
        console.log('Wheel landed on:', result);
        // We'll implement the game logic for handling the result in the next step
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});