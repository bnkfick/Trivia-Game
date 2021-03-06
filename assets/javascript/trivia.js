// VARIABLES
// ==============================================================================
var DEBUG = false;


// ==============================================================================
// A single quiz TIMER for the moment
// @todo replace this with a timer for each question 
// ==============================================================================
//var interval;   // game timer
var qinterval;  // question timer

var canClick = true;

// ==============================================================================
// The GAME OBJECT 
// Holds view Variables
// Holds game Variables
// Holds Quiz - details and array of questions and answers
// Holds game functions for game flow
// ==============================================================================
var game = {

    // ==========================================================================
    // HTML ELEMENTS - VIEW VARIABLES
    // ==========================================================================
    playBtnElem: $("#start-btn"),
    msgElem: $("#view-message"),
    timerElem: $("#view-timer"),
    QtimerElem: $("#view-qtimer"),
    scoreElem: $("#view-score"),
    questionElem: $("#view-question"),
    imageElem: $("#view-image"),
    answerElem: $("#view-answers"),
    captionElem: $("#view-caption"),


    time: 121,          // Start the game with a 2 minute timer
    qtime: 5,
    score: 0,           // We start the game with a score of 0.
    currentQuestion: '',


    // ===========================================================================
    // QUESTIONS
    // ===========================================================================
    quiz: {
        "title": "Landmarks",
        "subtitle": "AROUND THE WORLD",
        "description": "How many of these famous landmarks can you name?",
        "question": "What is this landmark?",
        "questions": [
            { "src": "assets/images/statue-of-liberty.jpg", "answer": "Statue of Liberty", "location": "NYC, US", "photo credit:": "Julius Drost", "asked": false },
            { "src": "assets/images/eiffel-tower.jpg", "answer": "Eiffel Tower", "location": "Paris, France",  "photo credit:": "Carissa Gan", "asked": false },
            { "src": "assets/images/gherkin.jpg", "answer": "Gherkin",  "location": "London, England", "photo credit": "Ed Robertson", "asked": false },
            { "src": "assets/images/taj-mahal.jpg", "answer": "Taj Mahal",  "location": "Agra, India", "photo credit": "Fahrul Azmi", "asked": false },
            { "src": "assets/images/st-basils-cathedral.jpg", "answer": "St. Basil's Cathedral",  "location": "Moscow, Russia", "photo credit": "Nikolay Vorobyev", "asked": false },
            { "src": "assets/images/petronas-towers.jpg", "answer": "Petronas Twin Towers",  "location": "Kuala Lampur, Malaysia", "photo credit:": "Alex Block", "asked": false },
            { "src": "assets/images/machu-picchu.jpg", "answer": "Machu Picchu",  "location": "Peru", "photo credit:": "Abraham Osorio", "asked": false },
            { "src": "assets/images/pyramids.jpg", "answer": "The Pyramids",  "location": "Giza, Egypt", "photo credit": "Martin Widenka", "asked": false },
            { "src": "assets/images/opera-house.jpg", "answer": "Sydney Opera House",  "location": "Sydney, Australia", "photo credit": "Holger Link", "asked": false },
            { "src": "assets/images/burj-al-arab.jpg", "answer": "Burj Al Arab",  "location": "Dubai, United Arab Emirates", "photo credit": "HSylvia Prats", "asked": false },
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
        this.msgElem.empty();
        //empty all elements so that we can start a new game
        //reset all the this.quiz.questions.asked flags
        this.quiz.questions.forEach(function (question) {
            question.asked = false;
        });
        this.score = 0;
        this.updateScore();

        //@todo make a timer for each question
        this.resetQTimer();

        //==========================================================================
        //reset Game timer
        //clearInterval(interval);
        //game.time = 121;
        // set up an interval that counts down every second
        //interval = setInterval(game.countDown, 1000);
    },

    // ==============================================================================
    // NOTE: the interval 'timer' is set on the window
    // therefore, javascript this is the window  
    // must refer to object vars and functions 
    // with the game object name
    countDown: function () {
        //if (DEBUG) console.log("countdown: " + game.time);
        game.time--;
        game.timerElem.text("Time:" + game.time);
        // the game is over if the timer has reached 0
        if (game.time <= 0) {
            if (DEBUG) console.log("Time's up.");
            game.gameOver();
        }
    },

    // Countdown the Question Timer set in game.qtime
    // ==============================================================================
    qcountDown: function () {

        var formattedNumber = ("0" + game.qtime).slice(-2);

        game.QtimerElem.text("Time: " + formattedNumber);
        game.qtime--;
        //if the questions time is up 
        if (game.qtime <= -1) {
            game.checkAnswer();
        }
    },

    // Reset the Question Timer in a function
    // ==============================================================================
    resetQTimer: function () {
        game.qtime = 5;
        game.QtimerElem.text("Time: " + ("0" + game.qtime).slice(-2));
        clearInterval(qinterval);
        qinterval = setInterval(game.qcountDown, 1000);
    },

    // MAIN PROCESS
    // ==============================================================================
    play: function () {
        this.newGame();
        this.qCycle();
    },

    // ==============================================================================
    qCycle: function () {

        //get a new question
        this.currentQuestion = this.chooseQuestion();
        //if there are no questions left 
        if (this.currentQuestion) {

            if (DEBUG) console.log("CURRENT QUESTION: ", this.currentQuestion);

            this.askQuestion();
            this.currentQuestion.asked = true;
            this.updateScore();
        } else {
            this.gameOver();
        }

    },

    // ==============================================================================
    // Randomly Choose a Question from game.quiz.questions
    // ==============================================================================
    chooseQuestion: function () {
        //must check to see if question has already been asked and prevent that
        var questions = this.quiz.questions.filter(function (question) {
            return question.asked === false;
        })

        if (DEBUG) console.log("QUESTIONS THAT HAVE NOT BEEN ASKED: " + questions.length);

        if (questions.length > 0) {
            return questions[Math.floor((questions.length) * Math.random())];
        } else {
            //no unasked questions left
            return false;
        }

    },

    // Function to render questions.
    askQuestion: function () {

        if (DEBUG) console.log("Inside askQuestion");
        if (DEBUG) console.log(this.currentQuestion);
        this.msgElem.empty();
        var elemContent = this.quiz.question;
        this.display(this.questionElem.empty(), elemContent);
        this.displayImg(this.imageElem, this.currentQuestion.src, "quizImg");

        // ====================================================

        var options = []; //an array of 3 possible answers

        var option1 = this.createAnswerOption(options);
        options.push(option1["answer"]);

        var option2 = this.createAnswerOption(options);
        options.push(option2["answer"]);

        //Add the actual answer to a random spot in the array
        options.splice(Math.floor((Math.random() * options.length + 1)), 0, this.currentQuestion.answer);

        if (DEBUG) console.log("OPTIONS", options);

        this.answerElem.empty();
        this.captionElem.empty();

        //using bind to get access to this.answerElem works, but seems crazy
        // options.forEach( function (name) {
        //     var button = document.createElement("button");
        //     button.value = name;
        //     button.textContent = name;
        //     this.answerElem.append(button);
        // }.bind(this));

        // this.answerElem is available in the for loop
        // so no closure
        for (var i = 0; i < options.length; i++) {
            var button = document.createElement("button");
            button.value = options[i];
            button.textContent = options[i];
            this.answerElem.append(button);
        }
        canClick = true;
        
    },


    createAnswerOption: function (options) {

        var option = this.quiz.questions[Math.floor(Math.random() * this.quiz.questions.length)];

        if (DEBUG) console.log("this.currentQuestion.answer " + this.currentQuestion.answer);
        if (DEBUG) console.log("option.answer " + option.answer);
        if (DEBUG) console.log("options.indexOf(options['answer'] " + options.indexOf(options["answer"]));
        //Stop a wrong answer from repeating within the answer choices array
        //if the selected choice is the same as the answer try again
        //or if the selected choice is already in the list of answer choices, try again
        if (option.answer === this.currentQuestion.answer || options.indexOf(option["answer"]) !== -1) {
            return this.createAnswerOption(options);
        }

        return option;
    },

    // @todo display correct answer and
    // wait one second to move on
    checkAnswer: function () {

        //if time ran up then there is not a user answer        
        if (event) {
            var msg;
            if (event.target.value === game.currentQuestion.answer) {
                msg = "Correct! " + this.currentQuestion.answer;
                this.score++;
                this.updateScore();
            } else {
                msg = "Wrong! " + this.currentQuestion.answer;
            }
            if (DEBUG) console.log("checkAnswer() userAnswer " + event.target.value);
            if (DEBUG) console.log("checkAnswer() this.currentQuestion.answer " + this.currentQuestion.answer);
        } else {
            msg = "Time's Up! "  + this.currentQuestion.answer;
        }
        this.questionElem.empty();
        this.display(this.msgElem.empty(), msg);
        this.captionElem.text(this.currentQuestion.location);
        clearInterval(qinterval);
        canClick = false;

        setTimeout(function () {
            game.resetQTimer();
            game.qCycle();
          }, 2000);
    },

    displayImg: function (elem, elemContent, elemClass) {
        elem.empty();
        elem.html("<img class='" + elemClass + "' src='" + elemContent + "'>");
        //@todo why doesn't this work?
        //if (elemClass) elem.addClass(elemClass);
    },

    // ==============================================================================
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
        this.scoreElem.html("Score: " + this.score + "/" + this.quiz.questions.length);
    },

    // ==============================================================================
    // END THE GAME B/C
    //      ALL Questions have been asked
    //      OR the TIME is used up
    // ==============================================================================
    gameOver: function () {

        if (DEBUG) console.log("gameOver() called");

        
        // and display some game over image

        this.answerElem.empty();
        
        //clearInterval(interval);
        clearInterval(qinterval);
        this.questionElem.empty();
        this.msgElem.empty();
        this.msgElem.append("<p>CORRECT ANSWERS: " + this.score + "</p>");
        this.msgElem.append("<p>WRONG ANSWERS: " + (parseInt(this.quiz.questions.length) - parseInt(this.score)) + "</p>");
        this.msgElem.append("<p>CLICK TO START</p>");
        this.msgElem.append("<span id='description'>" + game.quiz.description + "</span>");
        this.displayImg(this.imageElem, 'assets/images/globe.jpg', "quizImg");
        this.captionElem.empty();

        // display the start button so player can play again
        this.playBtnElem.text("PLAY AGAIN");
        this.playBtnElem.show();
    }
}



// ==============================================================================
// EVENT LISTENERS FOR 
//      Starting the Game 
//      Selecting an Answer
// ==============================================================================
window.onload = function () {
    $("h1").text(game.quiz.title);
    $("h2").text(game.quiz.subtitle);
    $("#description").text(game.quiz.description);
};
$("#start-btn").on("click", function () { game.play(); });
$("#view-answers").on("click", function () { if (canClick) game.checkAnswer(); });








