let quizList = [];
let currentQuiz = null;
let lives = 3;
let savedAge = 20;
let gameEnded = false;

// 날짜 표시
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
document.getElementById('today-date').innerText = "📅 " + today.toLocaleDateString('ko-KR', options);

// JSON 파일에서 퀴즈 목록 로드하기
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        quizList = data;
        initQuiz();
    })
    .catch(err => {
        console.error("퀴즈 데이터를 불러오지 못했습니다.", err);
        // 예비 문제
        quizList = [{ q: "퀴즈 로딩 실패! 예비 문제: 1+1은?", a: "2", hintOld: "귀요미", hintNew: "창문" }];
        initQuiz();
    });

function initQuiz() {
    // 하루 한 문제 자동 알고리즘
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const quizIndex = dateSeed % quizList.length; 
    currentQuiz = quizList[quizIndex];
    
    document.getElementById('quiz-question').innerText = currentQuiz.q;
    document.getElementById('hint-old').innerText = "📜 옛날 힌트: " + currentQuiz.hintOld;
    document.getElementById('hint-new').innerText = "⚡ 최신 힌트: " + currentQuiz.hintNew;
}

function useHint(type) {
    document.getElementById('hint-' + type).style.display = 'block';
    document.getElementById('hint-btn-old').disabled = true;
    document.getElementById('hint-btn-new').disabled = true;
}

function checkAnswer() {
    if (gameEnded || !currentQuiz) return;

    const inputField = document.getElementById('user-answer');
    const submitBtn = document.getElementById('submit-btn');
    const livesDisplay = document.getElementById('lives-display');
    const resultArea = document.getElementById('result-area');
    const resultMessage = document.getElementById('result-message');
    const resultSubMessage = document.getElementById('result-sub-message');
    const shareBtn = document.getElementById('share-btn');
    
    const userAnswer = inputField.value.trim().replace(/\s+/g, ''); 
    const correctAnswer = currentQuiz.a.replace(/\s+/g, '');
    
    if (userAnswer === correctAnswer) {
        gameEnded = true;
        const brainAges = [15, 17, 19, 21, 23];
        savedAge = brainAges[Math.floor(Math.random() * brainAges.length)];
        
        resultArea.style.display = "block";
        resultArea.style.backgroundColor = "#e8f5e9"; 
        resultArea.style.borderColor = "#81c784";
        resultMessage.innerHTML = "🎉 정답입니다! <br> 🧠 오늘의 두뇌 나이 결과: [" + savedAge + "세]";
        resultSubMessage.innerText = "🎉 오늘 출석 체크 완료! 내일 새로운 문제로 또 만나요!";
        shareBtn.style.display = "inline-block";
        
        inputField.disabled = true;
        submitBtn.disabled = true;
        submitBtn.innerText = "오늘 문제 풀기 완료 🔓";
    } else {
        lives--;
        
        if (lives === 2) livesDisplay.innerText = "남은 기회: ❤️❤️💔";
        else if (lives === 1) livesDisplay.innerText = "남은 기회: ❤️💔💔";
        else if (lives === 0) {
            gameEnded = true;
            livesDisplay.innerText = "남은 기회: 💔💔💔 (게임 오버)";
            
            resultArea.style.display = "block";
            resultArea.style.backgroundColor = "#ffebee"; 
            resultArea.style.borderColor = "#ef9a9a";
            resultMessage.innerHTML = "💀 기회를 모두 날렸습니다! <br> 오늘의 퀴즈는 실패입니다.";
            resultSubMessage.innerText = "공부는 배신하지 않는다! 내일 새로운 문제로 복수하러 오세요. 🔥";
            shareBtn.style.display = "none";
            
            inputField.disabled = true;
            submitBtn.disabled = true;
            submitBtn.innerText = "오늘 기회 마감 🔒";
            return;
        }
        
        resultArea.style.display = "block";
        resultArea.style.backgroundColor = "#fff3e0"; 
        resultArea.style.borderColor = "#ffb74d";
        resultMessage.innerHTML = "❌ 틀렸습니다! <br> 남은 기회 동안 신중하게 생각해보세요!";
        resultSubMessage.innerText = "힌트를 아직 안 쓰셨다면 힌트 찬스를 써보세요!";
        shareBtn.style.display = "none";
    }
}

function shareResult() {
    const textToCopy = "[매일매일 두뇌 퀴즈]\n나 오늘 퀴즈 맞히고 두뇌 나이 " + savedAge + "세 나왔어! 🔥\n너도 한 번 도전해봐!";
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("📋 결과 메시지가 복사되었습니다! 카톡창에 바로 붙여넣기(Ctrl+V) 해보세요!");
    });
}

// BGM 켜고 끄기 기능
function toggleBGM() {
    const bgm = document.getElementById('bgm');
    const btn = document.getElementById('bgm-btn');
    if (bgm.paused) {
        bgm.play().catch(e => console.log("유저 상호작용 필요"));
        btn.innerText = "⏸️ BGM 끄기";
        btn.classList.add('playing');
    } else {
        bgm.pause();
        btn.innerText = "🎵 BGM 켜기";
        btn.classList.remove('playing');
    }
}
