/**
 * Created by Timothy on 12/8/2014.
 */

/**
 * Process:
 *
 * Generate pictures in random order. Make sure pictures are not duplicated.
 * There will be two columns in a table.
 * Left column will have ASL pictures and be draggable.
 * Right column will have English text to match and not be draggable.
 * After all pictures are successfully matched, ask for user name and submit score.
 *
 * 100 basic signs, lifeprint.com youtube
 */
var droppedCount = 0, gameScore = 0;
var startTime, endTime;
var form, dialog;
var alphabet = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function startNumberGame() {
    setupGame("number");
    document.getElementById("numberButton").style.visibility = "hidden";
    document.getElementById("alphabetButton").style.visibility = "hidden";
}

function startAlphabetGame() {
    setupGame("alphabet");
    document.getElementById("numberButton").style.visibility = "hidden";
    document.getElementById("alphabetButton").style.visibility = "hidden";
}

function setupGame(mode) {

    startTime = new Date().getTime();

    var matchSize;
    if (mode == "number") {
        matchSize = 9;
    } else {
        matchSize = 26;
    }

    var gameTbody = document.getElementById("gameTbody");
    var tr = document.createElement("tr");
    var numberArray = [];
    var matchArray = [];
    var count = 0;
    while (count < matchSize) {
        var randomImageId = Math.floor(1 + Math.random() * matchSize);

        if (numberArray.indexOf(randomImageId) == -1) {
            // Ensure that no two draggable have the same character to drag.
            var draggableId;
            if (mode == "number") {
                tr.appendChild(generateData("draggable", randomImageId));
                draggableId = "#draggable" + randomImageId;
            } else {
                tr.appendChild(generateData("draggable", alphabet[randomImageId]));
                draggableId = "#draggable" + alphabet[randomImageId];
            }

            // Ensure that no two droppable have the same character to drop into.
            var randomMatchId = Math.floor(1 + Math.random() * matchSize);
            while (matchArray.indexOf(randomMatchId) != -1) {
                randomMatchId = Math.floor(1 + Math.random() * matchSize);
            }
            var droppableId;
            var draggableMatchId; // Draggable to match with current droppable.
            if (mode == "number") {
                tr.appendChild(generateData("droppable", randomMatchId));
                gameTbody.appendChild(tr);
                droppableId = "#droppable" + randomMatchId;
                draggableMatchId = "#draggable" + randomMatchId;
            } else {
                tr.appendChild(generateData("droppable", alphabet[randomMatchId]));
                gameTbody.appendChild(tr);
                droppableId = "#droppable" + alphabet[randomMatchId];
                draggableMatchId = "#draggable" + alphabet[randomMatchId];
            }

            // Set up event listeners for draggable and droppable.
            $(draggableId).draggable({revert: "invalid"});
            $(droppableId).droppable({
                accept: draggableMatchId,
                drop: function (event, ui) {
                    $(this).addClass("ui-state-highlight").find("p").html("Correct!");
                    gameScore += 10;
                    droppedCount++;
                    checkGameStatus();
                }
            });

            numberArray[count] = randomImageId; // Store draggable ids to check for future duplicates
            matchArray[count] = randomMatchId;  // Store droppable ids to check for future duplicates
            count++;
        }
        if (mode == "number") {
            if (count % 3 == 0) {
                tr = document.createElement("tr");
            }
        } else {
            if (count % 5 == 0) {
                tr = document.createElement("tr");
            }
        }
    }
}

function generateData(id, text) {
    var td = document.createElement("td");
    var div = document.createElement("div");
    div.setAttribute("id", id + text);

    var nodeToAdd;
    if (id == "droppable") {
        div.setAttribute("class", "ui-widget-content");
        nodeToAdd = document.createElement("p");
        nodeToAdd.setAttribute("style", "font-size: 20px;");
        nodeToAdd.innerHTML = "" + text;
    } else if (id == "draggable") {
        div.setAttribute("class", "ui-widget-header");
        div.setAttribute("style", "background-color: #269abc");
        nodeToAdd = document.createElement("img");
        nodeToAdd.setAttribute("src", "img/asl/" + text + ".png");
        nodeToAdd.setAttribute("height", "90px");
        nodeToAdd.setAttribute("width", "90px");
    }
    div.appendChild(nodeToAdd);
    td.appendChild(div);
    return td;
}

function checkGameStatus() {
    if (droppedCount == 9) {
        endTime = new Date().getTime();
        var elapsedTime = (endTime - startTime) / 1000;
        document.getElementById("score").setAttribute("value", "" + (gameScore - elapsedTime));
        $("#timeLength").html("You finished in " + elapsedTime + " seconds!");
        $("#scoreResult").html("Your score is " + (gameScore - elapsedTime));
        dialog.dialog("open");
    }
}

function submitScore() {
    var form = document.getElementById("submitScoreForm");
    form.setAttribute("method", "post");
    form.setAttribute("action", "saveScore.php");
    form.submit();
}

function init() {
    var allFields = $([]).add($("#name")).add($("#score"));
    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Submit your score": submitScore,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        submitScore();
    });
}