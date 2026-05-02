// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = { 
    apiKey: "AIzaSyD0vZCr5gb4X6N-u9BgsN9hL2GG8bNA2n8", 
    authDomain: "missao-bebe.firebaseapp.com", 
    projectId: "missao-bebe", 
    storageBucket: "missao-bebe.firebasestorage.app", 
    messagingSenderId: "1029935229649", 
    appId: "1:1029935229649:web:200c43c9df318dd6dcf3f0", 
    measurementId: "G-PPKMH9BPRX" 
}; 

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// --------------------------------

const questions = [
    {
        q: "Terei um pezinho ou um pezão?",
        opt1: { text: "Pezinho", img: "assets/Pezinho.png", value: "Stella" },
        opt2: { text: "Pezão", img: "assets/Pezão.png", value: "Oliver" }
    },
    {
        q: "Meu cabelo será liso ou cacheado?",
        opt1: { text: "Liso", img: "assets/Liso.png", value: "Stella" },
        opt2: { text: "Cacheado", img: "assets/Cacheado.png", value: "Oliver" }
    },
    {
        q: "Meus olhinhos serão como?",
        opt1: { text: "Castanho claro", img: "assets/Castanho Claro.png", value: "Stella" },
        opt2: { text: "Castanho escuro", img: "assets/Castanho Escuro.png", value: "Oliver" }
    },
    {
        q: "Em que parte do dia eu vou nascer?",
        opt1: { text: "Manhã", img: "assets/Manha.png", value: "Stella" },
        opt2: { text: "Tarde", img: "assets/Tarde.png", value: "Stella" },
        opt3: { text: "Noite", img: "assets/Noite.png", value: "Oliver" },
        opt4: { text: "Madrugada", img: "assets/Madrugada.png", value: "Oliver" }
    },
    {
        q: "Vou ser mais dorminhoco ou agitado?",
        opt1: { text: "Dorminhoco", img: "assets/Dorminhoco.png", value: "Stella" },
        opt2: { text: "Agitado", img: "assets/Agitado.png", value: "Oliver" }
    },
    {
        q: "Vou rir fácil ou observar mais?",
        opt1: { text: "Risonho", img: "assets/Risonho.png", value: "Stella" },
        opt2: { text: "Observador", img: "assets/Observador.png", value: "Oliver" }
    },
    {
        q: "Na hora de mamar vou ser como?",
        opt1: { text: "Tranquilo", img: "assets/Tranquilo.png", value: "Stella" },
        opt2: { text: "Fazer charme", img: "assets/Fazer Charme.png", value: "Oliver" }
    },
    {
        q: "Meu jeitinho será:",
        opt1: { text: "Calminho", img: "assets/Calminho.png", value: "Stella" },
        opt2: { text: "Elétrico", img: "assets/Elétrico.png", value: "Oliver" }
    },
    {
        q: "Na hora de comer eu vou:",
        opt1: { text: "Comer tudo", img: "assets/Comer Tudo.png", value: "Stella" },
        opt2: { text: "Escolher bem", img: "assets/Escolher Bem.png", value: "Oliver" }
    },
    {
        q: "Vou aprender como?",
        opt1: { text: "Mexendo em tudo", img: "assets/Mexendo em Tudo.png", value: "Stella" },
        opt2: { text: "Observando", img: "assets/Observando.png", value: "Oliver" }
    },
    {
        q: "Você acha que o Bebê será?",
        opt1: { text: "Menina", img: "assets/A Stella.png", value: "Stella" },
        opt2: { text: "Menino", img: "assets/O Oliver.png", value: "Oliver" }
    }
];

let currentQuestion = 0;
let userName = "";
let choices = [];
let scores = { Stella: 0, Oliver: 0 };

// Audio Elements
const bgMusic = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');
const typeSound = document.getElementById('typeSound');
const cheerSound = document.getElementById('cheerSound');

function playClick() {
    clickSound.currentTime = 0;
    clickSound.volume = 0.6;
    clickSound.play().catch(e => console.log("Audio play prevented"));
}

function playType() {
    typeSound.currentTime = 0;
    typeSound.volume = 0.3; // Som mais baixinho para não incomodar
    typeSound.play().catch(e => console.log("Audio play prevented"));
}

// Configura evento de digitação no input de nome e o efeito de máquina de escrever na tela preta
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('playerName');
    if(nameInput) {
        nameInput.addEventListener('input', playType);
    }

    // Efeito Typewriter na tela preta
    const textToType = "Criado por Gabriela e Fabricio com muito amor e carinho ao nosso bebê que está a caminho";
    const typeElement = document.getElementById('typewriter-text');
    let i = 0;
    
    // Aguarda 2 segundos para começar a digitar (depois que a cegonha aparece)
    setTimeout(() => {
        function typeWriter() {
            if (i < textToType.length) {
                typeElement.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 40); // Velocidade da digitação
            } else {
                // Quando termina de digitar, tira o cursor piscando
                typeElement.style.borderRight = "none";
                
                // Exibe o botão/texto "Toque para começar..."
                setTimeout(() => {
                    document.getElementById('tapToStartText').classList.add('visible');
                }, 500); // Meio segundo de pausa antes de mostrar
            }
        }
        typeWriter();
    }, 2000);
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function enterGame() {
    // Essa primeira interação no documento permite que o áudio seja reproduzido
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Auto-play prevented", e));
    
    // Toca som de type como feedback e muda de tela
    playType();
    showScreen('start-screen');
}

function askName() {
    showScreen('name-screen');
}

function startGame() {
    const nameInput = document.getElementById('playerName').value.trim();
    if (!nameInput) {
        alert("Por favor, digite seu nome para começar!");
        return;
    }
    userName = nameInput;
    
    startQuiz();
}

function startQuiz() {
    currentQuestion = 0;
    choices = [];
    scores = { Stella: 0, Oliver: 0 };
    loadQuestion();
    showScreen('question-screen');
}

function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('qNumber').innerText = currentQuestion + 1;
    document.getElementById('qText').innerText = q.q;
    
    const progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Determina a ordem de forma randômica (50% de chance de inverter)
    const isReversed = Math.random() >= 0.5;

    let optionsHtml = '';
    
    // Função auxiliar para gerar o HTML do botão de opção
    const createOptionHtml = (opt) => `
        <div class="option-card ${opt.value === 'Oliver' ? 'oliver-opt' : 'stella-opt'}" onclick="selectOption('${opt.value}')">
            <div class="option-img"><img src="${opt.img}" alt="${opt.text}"></div>
            <div class="option-text">${opt.text}</div>
        </div>
    `;

    if (q.opt3 && q.opt4) {
        // Se tem 4 opções, embaralha as 4 posições
        let fourOptions = [q.opt1, q.opt2, q.opt3, q.opt4];
        fourOptions.sort(() => Math.random() - 0.5); // Embaralha o array

        optionsHtml = fourOptions.map(opt => createOptionHtml(opt)).join('');
        document.getElementById('optionsContainer').classList.add('grid-options');
    } else {
        // Se tem 2 opções, inverte ou não
        if (isReversed) {
            optionsHtml = createOptionHtml(q.opt2) + createOptionHtml(q.opt1);
        } else {
            optionsHtml = createOptionHtml(q.opt1) + createOptionHtml(q.opt2);
        }
        document.getElementById('optionsContainer').classList.remove('grid-options');
    }

    document.getElementById('optionsContainer').innerHTML = optionsHtml;
}

function selectOption(value) {
    playClick();
    choices.push(value);
    scores[value]++;
    
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    document.getElementById('progressFill').style.width = '100%';
    
    const finalResult = scores.Stella >= scores.Oliver ? 'Stella' : 'Oliver';
    
    // Play cheer
    cheerSound.currentTime = 0;
    cheerSound.play().catch(e => console.log("Audio play prevented"));

    // Update Result UI
    const resultDisplay = document.getElementById('resultDisplay');
    if (finalResult === 'Stella') {
        resultDisplay.innerHTML = `
            <div class="result-img"><img src="assets/A Stella.png" alt="A Stella"></div>
            <h1 class="result-title stella">A STELLA</h1>
        `;
        document.getElementById('resultMessage').innerText = `Você acha que será uma menina!`;
    } else {
        resultDisplay.innerHTML = `
            <div class="result-img"><img src="assets/O Oliver.png" alt="O Oliver"></div>
            <h1 class="result-title oliver">O OLIVER</h1>
        `;
        document.getElementById('resultMessage').innerText = `Você acha que será um menino!`;
    }

    showScreen('result-screen');

    // Salvar no Firebase Firestore
    try {
        const playerDocRef = db.collection('players').doc(userName);
        await playerDocRef.set({
            name: userName,
            choices: choices,
            result: finalResult,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Respostas salvas com sucesso no Firebase!");
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
    }
}

let allResultsData = []; // Para armazenar os dados e usar no modal

async function showRanking() {
    showScreen('ranking-screen');
    
    try {
        const playersSnapshot = await db.collection('players').orderBy('timestamp', 'desc').get();
        allResultsData = [];
        playersSnapshot.forEach(doc => {
            allResultsData.push(doc.data());
        });
        
        let stellaCount = 0;
        let oliverCount = 0;
        let listHtml = '';
        
        allResultsData.forEach((item, index) => {
            if (item.result === 'Stella') stellaCount++;
            else oliverCount++;
            
            listHtml += `
                <li onclick="openDetailsModal(${index})">
                    <span class="rank-name">${item.name}</span>
                    <span class="rank-result ${item.result}">${item.result}</span>
                </li>
            `;
        });
        
        document.getElementById('stellaCount').innerText = stellaCount;
        document.getElementById('oliverCount').innerText = oliverCount;
        document.getElementById('rankingList').innerHTML = listHtml || '<li>Ainda não há palpites.</li>';
        
    } catch (error) {
        console.error("Erro ao carregar ranking do Firebase:", error);
        document.getElementById('rankingList').innerHTML = '<li>Erro ao carregar.</li>';
    }
}

function openDetailsModal(index) {
    playType();
    const item = allResultsData[index];
    document.getElementById('modalPlayerName').innerText = `Respostas de ${item.name}`;
    
    let detailsHtml = '';
    item.choices.forEach((choiceValue, qIndex) => {
        const q = questions[qIndex];
        if (!q) return; // Segurança caso as perguntas mudem

        // Acha qual foi o texto da resposta escolhida baseada no 'value' (Stella ou Oliver) e na pergunta atual
        let answerText = "";
        let isOliver = choiceValue === 'Oliver';

        if (q.opt3 && q.opt4) {
            // Pergunta de 4 opções
            if(choiceValue === 'Stella') {
                // Aqui não sabemos exatamente se foi Manhã ou Tarde sem salvar o texto exato, 
                // mas vamos assumir pelo value genérico ou exibir apenas que votou 'Menina'
                answerText = "Opção de Menina"; 
            } else {
                answerText = "Opção de Menino";
            }
        } else {
            answerText = choiceValue === 'Stella' ? q.opt1.text : q.opt2.text;
        }

        // Caso especial para a última pergunta (Menina / Menino)
        if(qIndex === 10) {
            answerText = choiceValue === 'Stella' ? "Menina" : "Menino";
        }

        detailsHtml += `
            <div class="detail-item">
                <div class="detail-q">${qIndex + 1}. ${q.q}</div>
                <div class="detail-a ${isOliver ? 'oliver-ans' : ''}">${answerText}</div>
            </div>
        `;
    });

    document.getElementById('modalDetailsList').innerHTML = detailsHtml;
    document.getElementById('details-modal').classList.add('active');
}

function closeDetailsModal() {
    playType();
    document.getElementById('details-modal').classList.remove('active');
}

async function openStorkModal() {
    try {
        const response = await fetch('/api/reveal-status');
        const data = await response.json();

        const soonContent = document.getElementById('stork-content-soon');
        const revealContent = document.getElementById('stork-content-reveal');
        
        if (data.isRevealed) {
            // Se já foi revelado, mostra o bebê! E toca o som de Cheer.
            cheerSound.currentTime = 0;
            cheerSound.play().catch(e => console.log("Audio play prevented"));

            soonContent.style.display = 'none';
            revealContent.style.display = 'block';

            const revealTitle = document.getElementById('reveal-title');
            const revealImg = document.getElementById('reveal-img');
            const revealDesc = document.getElementById('reveal-desc');

            if (data.babyName === 'Stella') {
                revealTitle.innerText = "É UMA MENINA!";
                revealTitle.style.color = "#ff9a9e"; // Rosa
                revealImg.src = "assets/A Stella.png";
                revealDesc.innerText = "A cegonha trouxe a Stella!";
            } else {
                revealTitle.innerText = "É UM MENINO!";
                revealTitle.style.color = "#a1c4fd"; // Azul
                revealImg.src = "assets/O Oliver.png";
                revealDesc.innerText = "A cegonha trouxe o Oliver!";
            }
        } else {
            // Se ainda não foi revelado, toca o som normal e mostra "Em Breve"
            playType();
            soonContent.style.display = 'block';
            revealContent.style.display = 'none';
        }
        
        document.getElementById('stork-modal').classList.add('active');

    } catch (error) {
        console.error("Erro ao checar status de revelação:", error);
        playType();
        document.getElementById('stork-modal').classList.add('active');
    }
}

function closeStorkModal() {
    playType();
    document.getElementById('stork-modal').classList.remove('active');
}

function openExitModal() {
    document.getElementById('exit-modal').classList.add('active');
}

function closeExitModal() {
    document.getElementById('exit-modal').classList.remove('active');
}

function confirmExit() {
    closeExitModal();
    // Limpa o progresso e volta para a tela inicial
    currentQuestion = 0;
    choices = [];
    scores = { Stella: 0, Oliver: 0 };
    showScreen('start-screen');
}

function resetGame() {
    startQuiz();
}

function backToStart() {
    showScreen('start-screen');
}
