let quizData = [];
let currentQuestion = 0;

// Shuffle helper function
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }
// Store answers: key = question index, value = selected option index
let userAnswers = {};

const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

fetch('./german_words.json')
    .then(res => res.json())
    .then(data => {
        quizData = data;
        showQuestion(currentQuestion);
    })
    .catch(err => console.error(err));

function showQuestion(index) {
    const q = quizData[index];
    questionEl.innerText = `…… ${q.word}`;
    optionsContainer.innerHTML = "";
    feedbackEl.className = "feedback";
    feedbackEl.style.display = "none";

    // Disable/enable navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === quizData.length - 1;

    q.options.forEach((option, i) => {
        const label = document.createElement('label');
        label.className = "option";

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'article';
        radio.value = i;

        // Pre-select if user has already answered
        if (userAnswers[index] === i) {
            radio.checked = true;
        }

        // Enable button if a choice is made for the first time
        radio.addEventListener('change', () => {
            userAnswers[currentQuestion] = i; // save answer
            feedbackEl.style.display = "block";
            showFeedback();
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option + " " + q.word));

        optionsContainer.appendChild(label);
    });

    // If already answered, show feedback
    if (userAnswers[index] !== undefined) {
        feedbackEl.style.display = "block";
        showFeedback();
    }
}

function showFeedback() {
    const q = quizData[currentQuestion];
    const selectedIndex = userAnswers[currentQuestion];
    const labels = document.querySelectorAll('label.option');

    // Reset classes
    labels.forEach(label => {
        label.classList.remove("correct", "incorrect", "disabled");
        label.querySelector('input').disabled = true; // disable inputs
    });

    if (selectedIndex === q.correct) {
        feedbackEl.className = "feedback show correct";
        feedbackEl.innerText = `Correct\n Note: ${q.word} = ${q.definition}`;
    } else {
        feedbackEl.className = "feedback show incorrect";
        feedbackEl.innerText = `Wrong\n Note: ${q.word} = ${q.definition}`;
    }

    labels[q.correct].classList.add("correct");
    if (selectedIndex !== q.correct) labels[selectedIndex].classList.add("incorrect");
    labels.forEach(label => label.classList.add("disabled"));
}

// Navigation buttons
nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
});

