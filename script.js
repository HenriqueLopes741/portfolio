/* --- 1. Efeito de Digitação (Typewriter) --- */
const words = ["Infraestrutura", "Linux", "Cloud Computing", "Python", "Automação"];
let i = 0;
let timer;

function typeWriter() {
    const heading = document.getElementById("typing-text");
    const word = words[i];
    const current = heading.textContent;

    // Se estiver digitando
    if (!heading.classList.contains("deleting")) {
        if (current.length < word.length) {
            heading.textContent = word.substring(0, current.length + 1);
            timer = setTimeout(typeWriter, 100); // Velocidade de digitação
        } else {
            heading.classList.add("deleting");
            timer = setTimeout(typeWriter, 2000); // Pausa antes de apagar
        }
    } 
    // Se estiver apagando
    else {
        if (current.length > 0) {
            heading.textContent = word.substring(0, current.length - 1);
            timer = setTimeout(typeWriter, 50); // Velocidade de apagar
        } else {
            heading.classList.remove("deleting");
            i = (i + 1) % words.length;
            timer = setTimeout(typeWriter, 500); // Pausa antes de começar o próximo
        }
    }
}

document.addEventListener("DOMContentLoaded", typeWriter);


/* --- 2. Animação ao Rolar (Scroll Reveal) --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
});

const hiddenElements = document.querySelectorAll(".reveal");
hiddenElements.forEach((el) => observer.observe(el));


/* --- 3. Fundo Animado (Network Effect) --- */
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let particlesArray;

// Ajustar tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Classe Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Tamanho das bolinhas
        this.speedX = Math.random() * 1 - 0.5; // Velocidade
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebater nas bordas
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = '#38bdf8'; // Cor das bolinhas (Azul Sky)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; // Densidade
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        connect(i); // Conectar linhas
    }
    requestAnimationFrame(animate);
}

// Conectar partículas próximas com linhas
function connect(index) {
    for (let j = index; j < particlesArray.length; j++) {
        let distance = ((particlesArray[index].x - particlesArray[j].x) ** 2) 
                     + ((particlesArray[index].y - particlesArray[j].y) ** 2);
        
        // Se estiverem perto (distância < 100px)
        if (distance < (canvas.width/7) * (canvas.height/7)) {
            let opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[index].x, particlesArray[index].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
        }
    }
}

init();
animate();