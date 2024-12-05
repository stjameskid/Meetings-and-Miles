// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJnnT5hRQdqrGYGYP9Zf2OSYsilrFffUA",
    authDomain: "meetingsandmiles.firebaseapp.com",
    projectId: "meetingsandmiles",
    storageBucket: "meetingsandmiles.firebasestorage.app",
    messagingSenderId: "883698738174",
    appId: "1:883698738174:web:337c1e1263d1b9f83b56af",
    measurementId: "G-CRCBQX78WG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

const questions = [
    {
        text: 'When you book a business trip, what’s your priority?',
        options: ['I look for the cheapest option.', 'I focus on the fastest route.', 'Comfort is key.', 'I look for destinations that have some downtime.']
    },
    {
        text: 'How do you prep for a flight?',
        options: ['Pack light, only essentials.', 'Double-check work prep.', 'Bring comfort items.', 'Make sure there’s Wi-Fi.']
    },
    {
        text: 'What’s your preferred method of staying productive during downtime?',
        options: ['I don’t have time for downtime. Always on the go!', 'I catch up on emails and check-in with my team.', 'I take the opportunity to relax, watch a movie, or sleep.', 'I research the city I’m in and look for new places to eat or visit.']
    },
    {
        text: 'How do you handle travel delays?',
        options: ['I make the best of it and get work done while I wait.', 'I take a deep breath and get as much rest as I can.', 'I get frustrated and feel like I’m wasting valuable time.', 'I explore the area, maybe find a coffee shop or local attraction to check out.']
    },
    {
        text: 'When it comes to hotel stays, what’s most important to you?',
        options: ['The hotel is just a place to sleep. As long as it’s functional, I’m happy.', 'I need a place with great Wi-Fi and good workstations for those late-night email sessions.', 'I prefer a luxurious room with all the comforts of home.', 'A location with great access to local attractions and restaurants is key.']
    },
    {
        text: 'How do you spend your evenings after a busy day of meetings?',
        options: ['I head straight to the hotel and prepare for tomorrow’s meetings.', 'I keep working—there’s always something to do!', 'I enjoy a nice dinner and try to get a good night’s sleep.', 'I go out and explore the city, maybe try a new restaurant or bar.']
    }
];

let currentQuestionIndex = 0;
let scores = { A: 0, B: 0, C: 0, D: 0 };

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.text;
    document.getElementById('optionA').innerText = question.options[0];
    document.getElementById('optionB').innerText = question.options[1];
    document.getElementById('optionC').innerText = question.options[2];
    document.getElementById('optionD').innerText = question.options[3];
    const options = document.getElementsByName('option');
    options.forEach(option => option.checked = false);
}

function selectOption() {
    const options = document.getElementsByName('option');
    for (const option of options) {
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function nextQuestion() {
    const selectedOption = selectOption();
    if (selectedOption) {
        scores[selectedOption]++;
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResult();
        }
    } else {
        alert('Please select an option before proceeding.');
    }
}

function showResult() {
    // Hide the quiz container and show the result container
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';

    // Determine which type has the highest score
    const maxType = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
    let resultText;

    switch (maxType) {
        case 'A':
            resultText = "The Efficient Traveler: You’re all about efficiency, saving time and money.";
            break;
        case 'B':
            resultText = "The Road Warrior: You thrive on productivity and get work done, no matter what.";
            break;
        case 'C':
            resultText = "The Comfort Seeker: Comfort comes first, ensuring you’re well-rested and ready.";
            break;
        case 'D':
            resultText = "The Leisure-Work Hybrid: You mix work and play, making the most of each trip.";
            break;
    }

    // Display the result
    document.getElementById('result').innerText = resultText;

    // Save the result to Firebase Firestore
    db.collection("responses").add({
        result: resultText,
        timestamp: new Date()
    })
    .then(() => {
        console.log("Response saved successfully!");
    })
    .catch((error) => {
        console.error("Error saving response: ", error);
    });
}

// Initialize the first question
loadQuestion();
