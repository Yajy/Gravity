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
        this.angle = 0;

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

        const rect = this.element.getBoundingClientRect();
        this.centerX = rect.left + (rect.width / 2);
        this.centerY = rect.top + (rect.height / 2);

        requestAnimationFrame(this.rotateToBalance.bind(this));
    }

    onMouseMove(event) {
        if (this.isDragging) {
            const newX = event.clientX - this.offsetX;
            const newY = event.clientY - this.offsetY;
            this.element.style.left = `${newX}px`;
            this.element.style.top = `${newY}px`;

            const rect = this.element.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const centerY = rect.top + (rect.height / 2);

            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const degX = mouseX - centerX;
            const degY = mouseY - centerY;
            this.angle = Math.atan2(degY, degX) * (180 / Math.PI); 

            this.element.style.transform = `rotate(${this.angle}deg)`;
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

    rotateToBalance() {
        const offsetXFromCenter = this.offsetX - (this.element.getBoundingClientRect().width / 2);
        this.angle = offsetXFromCenter * 0.1;  

        this.element.style.transform = `rotate(${this.angle}deg)`;
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

            // if (Math.abs(this.velocityY) < 0.1) {
            //     this.velocityY = 0;
            // }

            this.velocityX *= 0.95;

            // if (Math.abs(this.velocityX) < 0.1) {
            //     this.velocityX = 0;
            // }
        }

        //here I have limited the shape to bounce to maximum for 4 times. It's not neccessary.
        if (this.timeBounced > 4) {
            this.velocityX = 0;
            this.velocityY = 0;
        }

        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
        
        //Here if the Shape is above the ground we are allowing it to fall
        /* Resolve : comparison with 0 : now object is not stucking in mid air,
        after successfull bounce */
        if (Math.abs(this.velocityY) > 0 || Math.abs(this.velocityX) > 0) {
            requestAnimationFrame(this.animateProjectile.bind(this));
        }
    }
}

const squareElement = document.getElementById("square");
const square = new Shape(squareElement, 50, 100); 

const circleElement = document.getElementById("circle");
const circle = new Shape(circleElement, 150, 100); 
