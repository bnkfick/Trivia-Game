// VARIABLES
// ==============================================================================
var DEBUG = true;


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

    questionIndex: 0,   // Variable to hold the index of current question.

    // ==============================================================================
    // QUESTIONS
    // ==============================================================================
    quiz: {
        "name": "Landmark Quiz",
        "description": "Do you know these famous landmarks?",
        "question": "What is the name of this landmark?",
        "questions": [
            { "src": "assets/images/statue-of-liberty.jpg", "answer": "Statue of Liberty", "photo credit:": "Yvan Musy" },
            { "src": "assets/images/eiffel-tower.jpg", "answer": "Eiffel Tower", "photo credit:": "Anthony Delanoix" },
            { "src": "assets/images/gherkin.jpg", "answer": "Gherkin", "photo credit": "Ed Robertson" },
            { "src": "assets/images/taj-mahal.jpg", "answer": "Taj Mahal", "photo credit": "Fahrul Azmi" },
            { "src": "assets/images/st-basils-cathedral.jpg", "answer": "St. Basil's Cathedral", "photo credit": "Nikolay Vorobyev" }
        ]
    },

    // ==============================================================================
    // GAME OBJECT - FUNCTIONS
    // ==============================================================================
    newGame: function () {
        playBtnElem.show();
        //empty all elements so that we can start a new game
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
        // remove the start button from view
        // prevent new intervals from being created 
        // and existing intervals from becoming orphaned
        this.playBtnElem.hide();

        // should this be in new game?
        // newGame should be called before play?
        clearInterval(interval);
        // set up an interval that counts down every second
        interval = setInterval(game.countDown, 1000);

        //=================================================//
        //now pick a question from the question list
        if (DEBUG) console.log("play() questions.length: " + this.quiz.questions.length);
        if (DEBUG) console.log("play() this.questionIndex: " + this.questionIndex);


        // ask first question
        var aQuestion = this.chooseQuestion();

        this.askQuestion(aQuestion);
        if (DEBUG) {
            console.log("aQuestion returned from chooseQuestions: ");
            console.log(aQuestion);
        }

        this.updateScore();
    },

    // ==============================================================================
    // Randomly Choose a Question from game.quiz.questions
    // ==============================================================================
    chooseQuestion: function () {
        return this.quiz.questions[Math.floor(Math.random() * this.quiz.questions.length)];
    },

    // Function to render questions.
    askQuestion: function (q) {

        if (DEBUG) console.log("Inside askQuestion");

        var elemContent = this.quiz.question + "?";
        this.display(this.questionElem.empty(), elemContent);
        if (DEBUG) console.log(q.src);
        this.displayImg(this.imageElem, q.src, "quizImg");
        var answer = q.answer;

        // ====================================================

        var options = []; //an array of 3 possible answers

        var option1 = this.chooseAnswerOption(q, options);
        options.push(option1["answer"]);
        if (DEBUG) console.log("ANSWER 1: " + option1["answer"]);
        var option2 = this.chooseAnswerOption(q, options);
        options.push(option2["answer"]);
        if (DEBUG) console.log("ANSWER 2: " + option2["answer"]);
        if (DEBUG) console.log(options);

        //Add the actual answer to a random spot in the array
        options.splice( Math.floor( ( Math.random() * options.length+1 ) ), 0, answer );
        

        if (DEBUG) console.log("OPTIONS");
        if (DEBUG) console.log(options);

        options.forEach( function (name) {
            var button = document.createElement("button");
            button.value = name;
            button.textContent = name;
//@todo why isn't the this.answerElem working?
            $("#view-answers").append(button);
        });

    },

    chooseAnswerOption: function(currentQ, options) {

        var option = this.quiz.questions[Math.floor( Math.random() * this.quiz.questions.length )];
        if (DEBUG) console.log("currentQ.answer " + currentQ.answer);
        if (DEBUG) console.log("option.answer " + option.answer);
        if (DEBUG) console.log("options.indexOf(options['answer'] " + options.indexOf(options["answer"]));
        
        //Stop a wrong answer from repeating within the answer choices array
        if(option.answer === currentQ.answer) {
            if (DEBUG) console.log( option.answer );
            return this.chooseAnswerOption(currentQ, options);
        }
        if (options.indexOf(options["answer"]) !== -1) {
             return this.chooseAnswerOption(currentQ, options);
         }

        return option;
    },

    evaluateAnswer: function (answer) {
        // Only run this code if "t" or "f" were pressed.
        if (answer === "t" || answer === "f") {

            // If they guess the correct answer, increase and update score, alert them they got it right.
            if (answer === questions[this.questionIndex].a) {
                this.msgElem.text("Correct!");
                this.score++;
                updateScore();
            }
            // If wrong, tell them they are wrong.
            else {
                this.msgElem.text("Wrong!");
            }

            // Increment the questionIndex variable and call the renderQuestion function.
            this.questionIndex++;
            this.renderQuestion();

        }
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

    gameOver: function () {
        //end the game because all of the questions are answered
        //or because the timer is up
        if (DEBUG) console.log("gameOver() called");
        // clear the display
        // remove the event listener from the option buttons
        // stop the countdown interval
        // stop the countdown interval
        clearInterval(interval);
        // display the score
        // display the start button so player can play again
    }
}


// ==============================================================================
$("#start-btn").on("click", function () {
    if (DEBUG) game.sayHello();
    // this is called every second and decreases the time
    game.play();
});

//game.newGame();







