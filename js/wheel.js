class Wheel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 1.1;
        
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
            this.ctx.font = 'bold 16px Arial';
            
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
        this.ctx.moveTo(this.centerX, this.centerY - this.radius - 20);
        this.ctx.lineTo(this.centerX - 15, this.centerY - this.radius + 5);
        this.ctx.lineTo(this.centerX + 15, this.centerY - this.radius + 5);
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
        
        // Random speed between 0.1 and 0.2 radians per frame
        this.rotationSpeed = 0.1 + Math.random() * 0.1;
        
        // Random number of full rotations (5-10)
        this.targetRotations = 5 + Math.floor(Math.random() * 6);
        this.rotations = 0;
        
        this.animate();
    }
    
    animate() {
        // Update angle
        this.angle += this.rotationSpeed;
        
        // Apply friction
        this.rotationSpeed *= 0.995;
        
        // Check for full rotation
        if (this.angle >= Math.PI * 2) {
            this.angle -= Math.PI * 2;
            this.rotations++;
        }
        
        // Redraw wheel
        this.draw();
        
        // Check if wheel should stop
        if (this.rotationSpeed < 0.001 && this.rotations >= this.targetRotations) {
            this.isSpinning = false;
            this.rotationSpeed = 0;
            this.calculateResult();
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