// VARIABLES
// ==========================================================================
var DEBUG = true;
var interval;
//make a game object
var game = {
    time: 121,
    playBtnElem: $("#start-btn"),
    newGame: function () {
        
        currentQuestionElem = $("playBtn");
        currentAnswerSetElem = $("playBtn");
        timerElem = $("#timer");
        score: 0;
    },
    sayHello: function() {
        console.log("Say Hello");
    },
    //the interval 'timer' is set on the window
    //this is the window since 
    //therefore, refer to object vars and functions 
    //with the object name
    countDown: function() {
        if (DEBUG) console.log("countdown: " + game.time);
        // decrease time by 1
        game.time--;
        // update the time displayed
        $("#timer").text("Time:" + game.time);
        // the game is over if the timer has reached 0
        if (game.time <= 0) {
            game.gameOver();
        }
    },
    
    // MAIN PROCESS
    // ==============================================================================
    play: function(questions) {
        // remove the start button from view
        // prevent new intervals from being created 
        // and existing intervals from becoming orphaned
        this.playBtnElem.hide();
        //now pick a question from the question list
        console.log(questions.length);

        // Calling functions to start the game.
        renderQuestion();
        updateScore();
    },
    gameOver: function () {
        //end the game because all of the questions are answered
        //or because the timer is up
        if (DEBUG) console.log("gameOver() called");
        // clear the display
        // remove the event listener from the option buttons
        // stop the countdown interval
        // stop the countdown interval
        window.clearInterval(interval);
        // display the score
        // display the start button so player can play again
    }
}
// The array of questions for our quiz game.
var questions = [
    { q: "The sky is blue.", a: "t" },
    { q: "There are 365 days in a year.", a: "t" },
    { q: "There are 42 ounces in a pound.", a: "f" },
    { q: "The Declaration of Independence was created in 1745.", a: "f" },
    { q: "Bananas are vegetables.", a: "f" }
];

// We start the game with a score of 0.
var score = 0;
// Variable to hold the index of current question.
var questionIndex = 0;

// FUNCTIONS
// ==============================================================================

// Function to render questions.
function renderQuestion() {
    // If there are still more questions, render the next one.
    if (questionIndex <= (questions.length - 1)) {
        document.querySelector("#question").innerHTML = questions[questionIndex].q;
    }
    // If there aren't, render the end game screen.
    else {
        document.querySelector("#question").innerHTML = "Game Over!";
        document.querySelector("#score").innerHTML = "Final Score: " + score + " out of " + questions.length;
    }
}

// Function that updates the score...
function updateScore() {
    document.querySelector("#score").innerHTML = "Score: " + score;
}





$("#start-btn").on("click", function () {
    game.sayHello();
    // set up an interval that counts down every second
    interval = window.setInterval(game.countDown, 1000);
    // this is called every second and decreases the time
    game.play(questions);
});


// When the user presses a key, it will run the following function...
document.onkeyup = function (event) {

    // If there are no more questions, stop the function.
    if (questionIndex === questions.length) {
        return;
    }

    // Determine which key was pressed, make it lowercase, and set it to the userInput variable.
    var userInput = event.key.toLowerCase();

    // Only run this code if "t" or "f" were pressed.
    if (userInput === "t" || userInput === "f") {

        // If they guess the correct answer, increase and update score, alert them they got it right.
        if (userInput === questions[questionIndex].a) {
            alert("Correct!");
            score++;
            updateScore();
        }
        // If wrong, alert them they are wrong.
        else {
            alert("Wrong!");
        }

        // Increment the questionIndex variable and call the renderQuestion function.
        questionIndex++;
        renderQuestion();

    }

};


