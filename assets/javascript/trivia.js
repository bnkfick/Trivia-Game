// VARIABLES
// ==============================================================================
var DEBUG = false;


// ==============================================================================
// A single quiz TIMER for the moment
// @todo replace this with a timer for each question 
// ==============================================================================
var interval;


// ==============================================================================
// The GAME OBJECT 
// Holds view Variables
// Holds game Variables
// Holds game object with array of questions and answers
// Holds game functions for game flow
// ==============================================================================
var game = {

    // ==============================================================================
    // HTML ELEMENTS - VIEW VARIABLES
    // ==============================================================================
    playBtnElem: $("#start-btn"),
    msgElem: $("#view-message"),
    timerElem: $("#view-timer"),
    scoreElem: $("#view-score"),
    questionElem: $("#view-question"),
    imageElem: $("#view-image"),
    answerElem: $("#view-answers"),


    time: 121,          // Start the game with a 2 minute timer
    score: 0,           // We start the game with a score of 0.
    currentQuestion: '',
    questionIndex: 0,   // Variable to hold the index of current question.

    // ==============================================================================
    // QUESTIONS
    // ==============================================================================
    quiz: {
        "name": "Landmark Quiz",
        "description": "Do you know these famous landmarks?",
        "question": "What is the name of this landmark?",
        "questions": [
            { "src": "assets/images/statue-of-liberty.jpg", "answer": "Statue of Liberty", "photo credit:": "Yvan Musy", "asked": false },
            { "src": "assets/images/eiffel-tower.jpg", "answer": "Eiffel Tower", "photo credit:": "Anthony Delanoix", "asked": false },
            { "src": "assets/images/gherkin.jpg", "answer": "Gherkin", "photo credit": "Ed Robertson", "asked": false },
            { "src": "assets/images/taj-mahal.jpg", "answer": "Taj Mahal", "photo credit": "Fahrul Azmi", "asked": false },
            { "src": "assets/images/st-basils-cathedral.jpg", "answer": "St. Basil's Cathedral", "photo credit": "Nikolay Vorobyev", "asked": false },
            { "src": "assets/images/petronas-towers.jpg", "answer": "Petronas Twin Towers", "photo credit:": "Alex Block", "asked": false },
            { "src": "assets/images/machu-picchu.jpg", "answer": "Machu Picchu", "photo credit:": "Abraham Osorio", "asked": false },
            { "src": "assets/images/great-wall-china.jpg", "answer": "Great Wall of China", "photo credit": "Violette Filippini", "asked": false },
            { "src": "assets/images/pyramids.jpg", "answer": "Egyptian Pyramids", "photo credit": "Jeremy Bishop", "asked": false },
            { "src": "assets/images/opera-house.jpg", "answer": "Sydney Opera House", "photo credit": "Holger Link", "asked": false }
        ]
    },

    // ==============================================================================
    // GAME OBJECT - FUNCTIONS
    // ==============================================================================
    newGame: function () {
        // remove the start button from view
        // prevent new intervals from being created 
        // and existing intervals from becoming orphaned
        this.playBtnElem.hide();
        //empty all elements so that we can start a new game
        //reset all the this.quiz.questions.asked flags
        this.quiz.questions.forEach(function(question) {
            question.asked = false;
        });
        this.score = 0;
        this.updateScore();
        //reset timer
        //@todo make a timer for each question
        clearInterval(interval);
        game.time = 121;
        // set up an interval that counts down every second
        interval = setInterval(game.countDown, 1000);
    },

    //DEBUGGING FUNCTION 
    sayHello: function () {
        console.log("Say Hello");
    },

    // ==============================================================================
    // NOTE: the interval 'timer' is set on the window
    // therefore, javascript this is the window  
    // must refer to object vars and functions 
    // with the game object name
    countDown: function () {
        //if (DEBUG) console.log("countdown: " + game.time);
        // decrease time by 1
        game.time--;
        // update the time displayed
        game.timerElem.text("Time:" + game.time);
        // the game is over if the timer has reached 0
        if (game.time <= 0) {
            if (DEBUG) console.log("Time's up.");
            game.gameOver();
        }
    },

    // MAIN PROCESS
    // ==============================================================================
    play: function () {
        //=================================================//
        this.newGame();
        this.qCycle();
    },


    // ==============================================================================
    qCycle: function () {

        //get a new question
        this.currentQuestion = this.chooseQuestion();

        if (this.currentQuestion) {

            if (DEBUG) console.log("CURRENT QUESTION: ", this.currentQuestion);

            //ask the new question
            this.askQuestion();
            //switch the question asked flag from false to true;
            this.currentQuestion.asked = true;
            //update the score
            this.updateScore();
        } else {
            //@todo this is not working
            if (DEBUG) console.log(" typeof is undefined");
            this.gameOver();
        }

    },

    // ==============================================================================
    // Randomly Choose a Question from game.quiz.questions
    // ==============================================================================
    chooseQuestion: function () {
        //must check to see if question has already been asked and prevent that
        //var q = this.quiz.questions[Math.floor(Math.random() * this.quiz.questions.length)];

        var questions = this.quiz.questions.filter(function (question) {
            return question.asked === false;
        })
        //if (DEBUG) 
        console.log("QUESTIONS THAT HAVE NOT BEEN ASKED: " + questions.length);
        if (questions.length > 0) {
            var randomIndex = Math.floor((questions.length) * Math.random());
            return questions[randomIndex];
        } else {
            console.log("Game should be over");
            //no unasked questions left
            return false;
        }

    },

    // Function to render questions.
    askQuestion: function () {

        if (DEBUG) console.log("Inside askQuestion");

        var elemContent = this.quiz.question + "?";
        this.display(this.questionElem.empty(), elemContent);
        console.log(this.currentQuestion);
        if (DEBUG) console.log(this.currentQuestion.src);

        this.displayImg(this.imageElem, this.currentQuestion.src, "quizImg");
        var answer = this.currentQuestion.answer;

        // ====================================================

        var options = []; //an array of 3 possible answers

        var option1 = this.chooseAnswerOption(options);
        options.push(option1["answer"]);
        if (DEBUG) console.log("ANSWER 1: " + option1["answer"]);
        var option2 = this.chooseAnswerOption(options);
        options.push(option2["answer"]);
        if (DEBUG) console.log("ANSWER 2: " + option2["answer"]);
        if (DEBUG) console.log(options);

        //Add the actual answer to a random spot in the array
        options.splice(Math.floor((Math.random() * options.length + 1)), 0, answer);


        if (DEBUG) console.log("OPTIONS");
        if (DEBUG) console.log(options);
        $("#view-answers").empty();
        options.forEach(function (name) {
            var button = document.createElement("button");
            button.value = name;
            button.textContent = name;
            //@todo why isn't the this.answerElem working?

            $("#view-answers").append(button);
        });

    },

    chooseAnswerOption: function (options) {

        var option = this.quiz.questions[Math.floor(Math.random() * this.quiz.questions.length)];
        if (DEBUG) console.log("this.currentQuestion.answer " + this.currentQuestion.answer);
        if (DEBUG) console.log("option.answer " + option.answer);
        if (DEBUG) console.log("options.indexOf(options['answer'] " + options.indexOf(options["answer"]));
        //Stop a wrong answer from repeating within the answer choices array
        //if the selected choice is the same as the answer try again
        //or if the selected choice is already in the list of answer choices, try again
        if (option.answer === this.currentQuestion.answer || options.indexOf(option["answer"]) !== -1) {
            return this.chooseAnswerOption(options);
        }

        return option;
    },

    checkAnswer: function () {

        var userAnswer = event.target.value;
        if (DEBUG) console.log("checkAnswer: " + userAnswer);
        if (DEBUG) console.log(this.currentQuestion.answer);
        if (userAnswer === game.currentQuestion.answer) {
            this.msgElem.text("Correct!", "correct");
            this.score++;
            this.updateScore();
        } else {
            this.msgElem.text("Wrong!", "wrong");
        }

        this.qCycle();
    },

    displayImg: function (elem, elemContent, elemClass) {
        if (DEBUG) {
            console.log("displayImg: ");
            console.log(elem);
            console.log(elemContent);
        }
        elem.empty();
        elem.html("<img class='" + elemClass + "' src='" + elemContent + "'>");
    },

    display: function (elem, elemContent, elemClass) {
        elem.html = "";
        var pElem = document.createElement("p");
        var txt = document.createTextNode(elemContent);
        pElem.append(txt);

        if (elemClass) {
            pElem.className = elemClass;
        }
        elem.append(pElem);
    },

    // Function that updates the score...
    updateScore: function () {
        this.scoreElem.html("Score: " + this.score);
    },

    // ==============================================================================
    // END THE GAME B/C
    //      ALL Questions have been asked
    //      OR the TIME is used up
    // ==============================================================================
    gameOver: function () {

        if (DEBUG) console.log("gameOver() called");
        // clear the display
        // remove the event listener from the option buttons
        // stop the countdown interval
        clearInterval(interval);
        // display the score
        // display the start button so player can play again
        this.playBtnElem.show();
    }
}

// ==============================================================================
// EVENT LISTENERS FOR 
//      Starting the Game 
//      Selecting an Answer
// ==============================================================================
$("#start-btn").on("click", function () {
    game.play();
});

$("#view-answers").on("click", function () {
    if (DEBUG) game.sayHello();
    // this is called every second and decreases the time
    game.checkAnswer();
});
//game.newGame();







