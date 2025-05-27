class Wheel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 0.9;  // Changed from 0.45 to 0.9 for better scaling
        
        // Wheel segments with values and colors
        this.segments = [
            { text: '$300', value: 300, color: '#FF5252' },
            { text: '$350', value: 350, color: '#FFD740' },
            { text: '$400', value: 400, color: '#69F0AE' },
            { text: '$450', value: 450, color: '#40C4FF' },
            { text: '$500', value: 500, color: '#E040FB' },
            { text: '$550', value: 550, color: '#FF5252' },
            { text: 'BANKRUPT', value: 'bankrupt', color: '#212121' },
            { text: '$600', value: 600, color: '#FFD740' },
            { text: '$650', value: 650, color: '#69F0AE' },
            { text: '$700', value: 700, color: '#40C4FF' },
            { text: '$750', value: 750, color: '#E040FB' },
            { text: '$800', value: 800, color: '#FF5252' },
            { text: 'LOSE A TURN', value: 'loseTurn', color: '#FF3D00' },
            { text: '$850', value: 850, color: '#FFD740' },
            { text: '$900', value: 900, color: '#69F0AE' },
            { text: '$950', value: 950, color: '#40C4FF' },
            { text: '$1000', value: 1000, color: '#E040FB' },
            { text: 'BANKRUPT', value: 'bankrupt', color: '#212121' },
            { text: '$1100', value: 1100, color: '#FF5252' },
            { text: '$1200', value: 1200, color: '#FFD740' },
            { text: 'FREE PLAY', value: 'freePlay', color: '#69F0AE' },
            { text: 'MYSTERY', value: 'mystery', color: '#E040FB' },
            { text: 'PRIZE', value: 'prize', color: '#FFD700' },
            { text: 'WILD CARD', value: 'wild', color: '#9C27B0' }
        ];
        
        this.numSegments = this.segments.length;
        this.angle = 0;
        this.rotationSpeed = 0;
        this.isSpinning = false;
        this.currentResult = null;
        
        // Bind methods
        this.spin = this.spin.bind(this);
        this.animate = this.animate.bind(this);
        
        // Draw initial wheel
        this.draw();
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw wheel segments
        const segmentAngle = (2 * Math.PI) / this.numSegments;
        
        this.segments.forEach((segment, index) => {
            const startAngle = this.angle + (index * segmentAngle);
            const endAngle = startAngle + segmentAngle;
            
            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = segment.color;
            this.ctx.fill();
            
            // Draw segment border
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw text
            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY);
            this.ctx.rotate(startAngle + (segmentAngle / 2));
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#fff';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 0;
            const baseFontSize = Math.max(16, Math.min(24, this.radius * 0.08));  // Adjust these values as needed
            this.ctx.font = `bold ${baseFontSize}px Arial`;
            
            // Draw text with outline for better visibility
            this.ctx.strokeText(segment.text, this.radius * 0.6, 0);
            this.ctx.fillText(segment.text, this.radius * 0.6, 0);
            
            this.ctx.restore();
        });
        
        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.3, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#FFA700';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Draw pointer
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - this.radius - 30);
        this.ctx.lineTo(this.centerX - 20, this.centerY - this.radius + 5);
        this.ctx.lineTo(this.centerX + 20, this.centerY - this.radius + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#FF3D00';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.currentResult = null;
        
        // Increase initial speed for faster spin
        this.rotationSpeed = 0.3 + Math.random() * 0.2;  // Faster initial spin
        this.baseDeceleration = 0.0005;  // Base deceleration rate
        this.decelerationVariance = 0.0002;  // Random variation in deceleration
        this.currentDeceleration = this.baseDeceleration + (Math.random() * this.decelerationVariance);

         // Target rotations with some randomness
        this.targetRotations = 5 + Math.floor(Math.random() * 8);  // 5-12 rotations
        this.rotations = 0;
        
        // Use requestAnimationFrame with timestamp for smoother animation
        this.lastFrameTime = performance.now();
        this.animate();
    }
    
    animate() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;
        
        // Update angle based on time delta for smooth animation
        const frameRate = 30; // Target FPS
        const frameTime = 1000 / frameRate;
        const timeScale = deltaTime / frameTime;

        // Update angle
        this.angle += this.rotationSpeed * timeScale;
        
        // Apply more realistic deceleration that increases as the wheel slows
        // This creates the "weighted" feel of a real wheel
        const decelerationFactor = 1.0 + (0.5 * (1.0 - (this.rotationSpeed / 0.3))); // More deceleration as it slows
        this.rotationSpeed = Math.max(0, this.rotationSpeed - (this.currentDeceleration * decelerationFactor * timeScale));
        
            // Add slight random variation to deceleration for more natural feel
        if (Math.random() > 0.95) {
        this.currentDeceleration = this.baseDeceleration + 
            (Math.random() * this.decelerationVariance * 2) - 
            this.decelerationVariance;
        }

        // Check for full rotation
        if (this.angle >= Math.PI * 2) {
            this.angle -= Math.PI * 2;
            this.rotations++;
        }
        
        // Redraw wheel
        this.draw();
        
        // Check if wheel should stop
        const isStopped = this.rotationSpeed <= 0.001;
        const hasCompletedRotations = this.rotations >= this.targetRotations;
        const shouldStop = !this.isSpinning || (isStopped && hasCompletedRotations);
        
        if (shouldStop) {
            if (isStopped) {
                this.isSpinning = false;
                this.rotationSpeed = 0;
                this.calculateResult();
            } else {
                // If we're stopping but not fully stopped, continue decelerating
                requestAnimationFrame(this.animate);
            }
        } else {
            requestAnimationFrame(this.animate);
        }
    }
    
    calculateResult() {
        // Calculate which segment is at the top
        const segmentAngle = (2 * Math.PI) / this.numSegments;
        let normalizedAngle = ((2 * Math.PI) - this.angle) % (2 * Math.PI);
        if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
        
        const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
        this.currentResult = this.segments[segmentIndex];
        
        // Dispatch event with result
        const event = new CustomEvent('wheelStopped', { 
            detail: { 
                value: this.currentResult.value,
                text: this.currentResult.text
            } 
        });
        document.dispatchEvent(event);
    }
    
    // Public method to get current result
    getCurrentResult() {
        return this.currentResult;
    }
}

// Export the Wheel class for use in other modules
export default Wheel;