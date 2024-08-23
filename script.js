class Shape {
    constructor(element, initialLeft = 0, initialTop = 0) {
        this.element = element;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.dragCoefficient = 0.98;
        this.timeBounced = 0;


        this.element.style.left = `${initialLeft}px`;
        this.element.style.top = `${initialTop}px`;

        this.init();
    }

    init() {
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.offsetX = event.clientX - this.element.getBoundingClientRect().left;
        this.offsetY = event.clientY - this.element.getBoundingClientRect().top;
        this.element.style.transition = 'none';
        this.velocityX = 0;
        this.velocityY = 0;
        this.timeBounced = 0;
    }

    onMouseMove(event) {
        if (this.isDragging) {
            this.element.style.left = `${event.clientX - this.offsetX}px`;
            this.element.style.top = `${event.clientY - this.offsetY}px`;
        }
    }

    onMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const boxRect = this.element.getBoundingClientRect();
            const midX = boxRect.left + boxRect.width / 2;
            const midY = boxRect.top + boxRect.height / 2;

            this.velocityX = (mouseX - midX) * 0.1;
            this.velocityY = (mouseY - midY) * 0.1;

            requestAnimationFrame(this.animateProjectile.bind(this));
        }
    }

    animateProjectile() {
        const groundTop = document.querySelector('.ground').offsetTop;

        this.velocityY += this.gravity;

        let newLeft = parseFloat(this.element.style.left) + this.velocityX;
        let newTop = parseFloat(this.element.style.top) + this.velocityY;

        this.velocityX *= this.dragCoefficient;

        if (newTop + this.element.offsetHeight >= groundTop) {
            newTop = groundTop - this.element.offsetHeight;
            this.velocityY *= -0.7;
            this.timeBounced += 1;
            

            if(Math.abs(this.velocityY) < 0.1) {
                this.velocityY = 0;
            }

            this.velocityX *= 0.95;

            if (Math.abs(this.velocityX) < 0.1) {
                this.velocityX = 0;
            }
        }

        if(this.timeBounced > 2) {
            this.velocityX = 0;
            this.velocityY = 0;
        }

        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;

        if (Math.abs(this.velocityY) > 0.1 || Math.abs(this.velocityX) > 0.1) {
            requestAnimationFrame(this.animateProjectile.bind(this));
        }

        
    }

    // rebound() {
    //     if(newTop + this.element.offsetHeight > groundTop && this.timeBounced < 4) {
    //         this.velocityY *= -0.7;
    //         this.velocityX *= -0.95;
    //         this.timeBounced += 1;
    //     }

    // }
}

const squareElement = document.getElementById("square");
const square = new Shape(squareElement, 50, 100); 

const circleElement = document.getElementById("circle");
const circle = new Shape(circleElement, 150, 100); 
