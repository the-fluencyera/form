document.addEventListener('DOMContentLoaded', () => {
    const introView = document.getElementById('introView');
    const formView = document.getElementById('formView');
    const showFormBtn = document.getElementById('showFormBtn');
    const backToIntroBtn = document.getElementById('backToIntroBtn');
    const whatsappForm = document.getElementById('whatsappForm');
    const siteWrapper = document.getElementById('siteWrapper');

    // --- EFEITO DE MONTAGEM GLOBAL DE PARTÍCULAS (TELA INTEIRA) ---
    const canvas = document.getElementById('globalParticleCanvas');
    const ctx = canvas.getContext('2d');

    function initGlobalParticleIntro() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Cria partículas espalhadas por toda a tela com as cores da paleta The Fluency Era (Bordô, Rosa, Creme, Dark)
        const colors = ['#7A2621', '#eac8d6', '#f8f0e0', '#382d29', '#C2827E'];
        const particlesCount = Math.floor((canvas.width * canvas.height) / 3500); // Quantidade responsiva baseada na tela
        const particles = [];

        for (let i = 0; i < particlesCount; i++) {
            const targetX = Math.random() * canvas.width;
            const targetY = Math.random() * canvas.height;
            particles.push({
                targetX: targetX,
                targetY: targetY,
                // Começam explodidas/esfareladas bem longe ou fora de ordem
                x: targetX + (Math.random() - 0.5) * canvas.width * 1.5,
                y: targetY + (Math.random() - 0.5) * canvas.height * 1.5,
                size: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 0.05 + 0.04 // Velocidade rápida e fluida (montagem em ~1 segundo)
            });
        }

        let animationFrameId;

        function animate() {
            ctx.fillStyle = 'rgba(248, 240, 224, 0.25)'; // Rastro suave de fundo cor creme
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let allDone = true;

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                let dx = p.targetX - p.x;
                let dy = p.targetY - p.y;

                if (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8) {
                    p.x += dx * p.speed;
                    p.y += dy * p.speed;
                    allDone = false;
                } else {
                    p.x = p.targetX;
                    p.y = p.targetY;
                }

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            if (!allDone) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                // Efeito concluído: esmaece o canvas e revela o site real por trás com o wrapper
                canvas.style.opacity = '0';
                siteWrapper.classList.add('loaded');
                setTimeout(() => {
                    canvas.style.display = 'none';
                }, 500);
            }
        }

        animate();
    }

    // Dispara o efeito espetacular assim que a página é aberta
    initGlobalParticleIntro();

    // --- TRANSIÇÃO DE TELAS (ENTRE O INÍCIO E O FORMULÁRIO) ---
    showFormBtn.addEventListener('click', () => {
        introView.classList.remove('active');
        setTimeout(() => {
            formView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 250);
    });

    backToIntroBtn.addEventListener('click', () => {
        formView.classList.remove('active');
        setTimeout(() => {
            introView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 250);
    });

    // --- ENVIO DO FORMULÁRIO PARA O WHATSAPP ---
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Coleta inteligente dos dados dos inputs
            const name = document.getElementById('userName').value.trim();
            const age = document.getElementById('userAge').value.trim();
            const level = document.getElementById('englishLevel').value;
            const experience = document.getElementById('hasExperience').value;
            const objective = document.getElementById('userObjective').value.trim();
            const plan = document.getElementById('preferredPlan').value;
            const day = document.getElementById('preferredDay').value;
            const time = document.getElementById('preferredTime').value;

            // Número do WhatsApp da Teacher Laura
            const teacherPhoneNumber = "5582933005496";

            // Criação da mensagem estruturada com quebras de linha e negritos (*texto*)
            const messageText = `Olá, Teacher Laura! Gostaria de agendar uma aula experimental. Aqui estão as minhas informações:\n\n` +
                `• *Nome:* ${name}\n` +
                `• *Idade:* ${age} anos\n` +
                `• *Como avalio meu inglês:* ${level}\n` +
                `• *Experiência anterior:* ${experience}\n` +
                `• *Principal Objetivo:* ${objective}\n` +
                `• *Plano de Interesse:* ${plan}\n` +
                `• *Dia da Semana:* ${day}\n` +
            `• *Preferência de Horário:* ${time}`;

            const encodedMessage = encodeURIComponent(messageText);

            const mobileLink = `https://api.whatsapp.com/send?phone=${teacherPhoneNumber}&text=${encodedMessage}`;
            const desktopWebLink = `https://web.whatsapp.com/send?phone=${teacherPhoneNumber}&text=${encodedMessage}`;

            if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                window.open(mobileLink, '_blank');
            } else {
                window.open(desktopWebLink, '_blank');
            }

            whatsappForm.reset();
        });
    }
});