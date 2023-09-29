let gridSpaces = [];
gridOffsetX = [];
gridOffsetY = [];
alignedGridXOffset = 0;
alignedGridYOffset = 220;

const GridSpace = {
    Empty: 0,
    Occupied: 1,
    Adjacent: 2
};

const minXpercent = 10;
const maxXpercent = 90;
const minYpercent = 15;
const maxYpercent = 95;

// Grid is 30x16 with 2 padding on width & height
const numberOfSquaresX = 32;
const numberOfSquaresY = 16;

allAnimals = ['beaver','cat','crab','dog','dolphin','duck','flamingo','lizard','peacock','sheep','snail','swan','squirrel','penguin','giraffe','crocodile','koala','snake','octopus'];
animals = [];
numAnimals = 12;
copiesPerAnimal = 2;

// Gameplay logic variables
const GameState = {
    Open: 0,    // No cards flipped this turn
    Partial: 1, // At least one card flipped this turn
    Fail: 2,    // 'copies' many cards flipped; not matching
    Match: 3,   // 'copies' many cards flipped: all matching
    End: 4,     // All matches found
    Menu: 5     // Not in a game; menu screen
}
gameState = GameState.Menu;
numAttempts = 0;

waitingForNameEntry = false;
turnovertimeout = 0;

selectedCards = [];
matchesFound = [];

alignToGrid = false;
easyMode = false;

competitiveMode = false;
isPlayerOneTurn = true;
playerOneScore = 0;
playerTwoScore = 0;
p2Animals = [];

const cardOrder = ['q','w','e','r','a','s','d','f','z','x','c','v','u','i','o','p','h','j','k','l','b','n','m',','];

function init() {
    document.addEventListener("click", (evt) => {handleBackgroundClick();});
    document.addEventListener("keypress", (evt) => {checkNameEntry(evt);});
    pickAnimals();
    updateMessage();
    console.log("Welcome to the console! You can easily use this to cheat because all of the JavaScript here is locally stored, but we trust you to behave.");
    console.log("Type saveScoreboard() to get a create script for the leaderboards.");
}

function pickAnimals() {
    animals = [];
    while (animals.length < numAnimals) {
        selected = selectRandomFromArray(allAnimals);
        if (animals.indexOf(selected) == -1) {
            animals.push(selected);
        }
    }
}

function pickP2Animals() {
    p2Animals = [];
    while (p2Animals.length < numAnimals) {
        selected = selectRandomFromArray(animals);
        if (p2animals.indexOf(selected) == -1) {
            p2animals.push(selected);
        }
    }
}

function startGame(gamemode) {
    numAnimals = easyMode ? 6 : 12;
    hideMenu();
    pickAnimals();
    copiesPerAnimal = gamemode;
    clearPageElements();
    resetGameVariables();
    updateMessage();
    addPageElements();

    initialiseGridSpaces();
    placeItems();
    updateProgressStepper();
    displayLeaderboardForMode();
}

function start1v1() {
    numAnimals = 12;
    pickAnimals();
    hideMenu();
    clearPageElements();
    resetGameVariables();
    competitiveMode = true;
    updateMessage();

    add1v1PageElements();
}

function reset1v1Game() {
    // TODO
}

function resetGame() {
    hideAllElements();
    resetGameVariables();
    updateProgressStepper();

    setTimeout(() => {
        initialiseGridSpaces();
        placeItems();
        setPlayAgainButtonVisibility(false);
        displayLeaderboardForMode();
        updateMessage();
        document.getElementById("attempts").innerText = "";
        showAllElements();
    }, 700);

}

function resetGameVariables() {
    gridSpaces = [];
    gridOffsetX = [];
    gridOffsetY = [];
    gameState = GameState.Open;
    numAttempts= 0;
    isNewBest = false;
    selectedCards = [];
    matchesFound = [];

    isCompetitiveMode = false;
    isPlayerOneTurn = true;
    playerOneScore = 0;
    playerTwoScore = 0;
}

function hideMenu() {
    setMenuVisibility(false);
}

function showMenu() {
    hideAllElements();
    document.getElementById("attempts").innerText = "";
    document.getElementById("leaderboard-div").hidden = true;
    setPlayAgainButtonVisibility(false);
    setMenuVisibility(true);
}

function saveScoreboard() {
    let result = "";
    for (let e=0; e<2; e++) {
        for (let m=2; m<7; m++) {
            for (let i=0; i<5; i++) {
                item = localStorage.getItem("scoreE" + e + "M" + m + "P" + i);
                if (item) {
                    result += "localStorage.setItem(\"scoreE" + e + "M" + m + "P" + i + "\", " + item + ");\n";
                }
            }
        }
    }
    console.log(result);
}

function setMenuVisibility(state) {
    let buttons = document.getElementsByClassName("button start");
    for (let b=0; b<buttons.length; b++) {
        if (state) {
            buttons[b].classList.add("visible");
            buttons[b].classList.remove("hidden");
        }
        else {
            buttons[b].classList.add("hidden");
            buttons[b].classList.remove("visible");
        }
    };
    let snaptogrid = document.getElementsByClassName("align")[0];
    if (state) {
        snaptogrid.classList.add("visible");
        snaptogrid.classList.remove("hidden");
    }
    else {
        snaptogrid.classList.add("hidden");
        snaptogrid.classList.remove("visible");
    }
    let easy = document.getElementsByClassName("easy")[0];
    if (state) {
        easy.classList.add("visible");
        easy.classList.remove("hidden");
    }
    else {
        easy.classList.add("hidden");
        easy.classList.remove("visible");
    }
}

function addPageElements() {
    addCardImgs();
    addAnimalImgs();
}

function addAnimalImgs() {
    for (let i=0; i<numAnimals*copiesPerAnimal; i++) {
        let img = document.createElement("img");
        img.src = "assets/animals/" + animals[Math.floor(i/copiesPerAnimal)] + ".png";
        img.draggable = false;
        img.classList.add("item");
        img.classList.add("hidden");
        img.classList.add(Math.floor(i/copiesPerAnimal));
        if (i%2) {
            img.classList.add("flip");
        }
        img.onload = unhideElement(img, 1200);
        document.getElementById("animals").appendChild(img);
    }
}

function addCardImgs() {
    for (let i=0; i<numAnimals*copiesPerAnimal; i++) {
        let img = document.createElement("img");
        img.src = "assets/card.png";
        img.draggable = false;
        img.classList.add("card");
        img.classList.add("hidden");
        img.classList.add(i);
        img.onclick = function() {revealCard(event, i )};
        img.onload = unhideElement(img, 800);
        document.getElementById("cards").appendChild(img);
    }
}

function add1v1PageElements() {
    add1v1Cards();
    add1v1Animals();
}

function add1v1Cards() {
    count = 0;
    for (let player=-1; player<2; player += 2) {
        for (let column = 0; column<4; column++) {
            for (let row = 0; row<3; row++) {
                let img = document.createElement("img");
                img.src = "assets/cards/card" + cardOrder[count] + ".png";
                img.draggable = false;
                img.classList.add("card");
                img.classList.add("hidden");
                img.classList.add(cardOrder[count]);
                
                img.onclick = function() {revealCard1v1(event, i )}; // TODO
                img.onload = unhideElement(img, 800);

                img.style.left = 2; //TODO
                img.style.top = 2;

                document.getElementById("cards").appendChild(img);
                count++;
            }
        }
    }
}

function add1v1Animals() {
    
}

function clearPageElements() {
    let animalElems = document.getElementsByClassName("item");
    while (animalElems.length) {
        animalElems[0].remove();
    }
    let cardElems = document.getElementsByClassName("card");
    while (cardElems.length) {
        cardElems[0].remove();
    }
}

function unhideElement(self, timeout) {
    setTimeout(() => {
        self.classList.remove("hidden");
        self.classList.add("visible");
    }, timeout);
}

function hideAllElements() {
    let animalElems = document.getElementsByClassName("item");
    let cardElems = document.getElementsByClassName("card");
    for (let a=0; a<animalElems.length; a++) {
        animalElems[a].classList.remove("visible");
        animalElems[a].classList.add("hidden");
    }
    for (let c=0; c<cardElems.length; c++) {
        cardElems[c].classList.remove("visible");
        cardElems[c].classList.add("hidden");
    }
}
function showAllElements() {
    let animalElems = document.getElementsByClassName("item");
    let cardElems = document.getElementsByClassName("card");
    for (let c=0; c<cardElems.length; c++) {
        cardElems[c].classList.remove("hidden");
        cardElems[c].classList.add("visible");
    }
    for (let a=0; a<animalElems.length; a++) {
        animalElems[a].classList.remove("hidden");
        animalElems[a].classList.add("visible");
    }
}

function initialiseGridSpaces() {
    if (alignToGrid) {
        for (let xc=0; xc<copiesPerAnimal+5; xc++) {
            gridOffsetX[xc] = xc * 120;
            for (let yc=0; yc<Math.ceil((numAnimals*copiesPerAnimal)/copiesPerAnimal+5); yc++) {
                gridOffsetY[yc] = yc * 120;
            }
        }
        alignedGridXOffset = (window.innerWidth/2) - 105*((copiesPerAnimal+5)/2);
    }
    else {
        for (let xc=0; xc<numberOfSquaresX; xc++) {
            gridOffsetX[xc] = xc * ((maxXpercent - minXpercent) / numberOfSquaresX)
            gridSpaces[xc] = [];
            
            for (let yc=0; yc<numberOfSquaresY; yc++) {
                gridOffsetY[yc] = yc * ((maxYpercent - minYpercent) / numberOfSquaresY)
                gridSpaces[xc][yc] = GridSpace.Empty;
            }
        }
    
        // Initialise the padding squares as adjacent
        for (let xp=0; xp<numberOfSquaresX; xp++) {
            gridSpaces[xp][0] = GridSpace.Adjacent;
            gridSpaces[xp][numberOfSquaresY-1] = GridSpace.Adjacent;
        }
        for (let yp=0; yp<numberOfSquaresY; yp++) {
            gridSpaces[0][yp] = GridSpace.Adjacent;
            gridSpaces[numberOfSquaresX-1][yp] = GridSpace.Adjacent;
        }
    }
}

function placeItems() {

    if (alignToGrid) {
        // TODO: Organise cards in grid
        // Grid width: x+4 cards
        xcoord = 0;
        ycoord = 0;
        indices = [];
        for (let a=0; a<numAnimals*copiesPerAnimal; a++) {
            indices.push(a);
        }
        count = 0;
        while (indices.length) {
            let p = selectRandomFromArray(indices);
            
            thisitem = document.getElementsByClassName("item")[p];
            thiscard = document.getElementsByClassName("card")[p];
            x = alignedGridXOffset + gridOffsetX[count % (copiesPerAnimal+5)];
            y = alignedGridYOffset + gridOffsetY[Math.floor(count/(copiesPerAnimal+5))];
            moveItemPX(thisitem, x, y);
            moveItemPX(thiscard, x, y);

            indices = removeItemOnce(indices, p);
            count++;
        }

    }
    else {
        for (let a=0; a<numAnimals*copiesPerAnimal; a++) {
            thisitem = document.getElementsByClassName("item")[a];
            thiscard = document.getElementsByClassName("card")[a];
            x = 0;
            y = 0;
            do {
                coord = randomGridCoord();
                x = coord.x;
                y = coord.y;
            } while (gridSpaces[x][y] != GridSpace.Empty);
    
            moveItem(thisitem, x, y);
            moveItem(thiscard, x, y);
    
            for (let Xoffset=-1; Xoffset<2; Xoffset++) {
                for (let Yoffset=-1; Yoffset<2; Yoffset++) {
                    gridSpaces[x + Xoffset][y + Yoffset] = GridSpace.Adjacent;
                }
            }
            gridSpaces[x][y] = GridSpace.Occupied;
        }
    }
}

function moveItem(item, gridX, gridY) {
    item.style.left = (gridOffsetX[gridX] + minXpercent) + "%";
    item.style.top = (gridOffsetY[gridY] + minYpercent) + "%";
}

function moveItemPX(item, gridX, gridY) {
    item.style.left = gridX + "px";
    item.style.top = gridY + "px";
}

function randomGridCoord() {
    x = Math.floor(Math.random() * numberOfSquaresX);
    y = Math.floor(Math.random() * numberOfSquaresY);
    return {x, y};
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function revealCard(e, cardId) {
    e.stopPropagation();
    clearTimeout(turnovertimeout);

    let animalID = Math.floor(cardId/copiesPerAnimal);

    switch (gameState) {
        case GameState.Match:
        case GameState.Fail:
            showUnsolvedCards();
        case GameState.Open:
            hideCard(cardId);
            selectedCards = [animalID];
            gameState = GameState.Partial;
            updateProgressStepper();
            break;

        case GameState.Partial:
            hideCard(cardId);
            selectedCards.push(animalID);
            
            if (selectedCards.length == copiesPerAnimal) {
                // This is the last card - check if all selected are matching
                incrementAttempts();
                if (Math.min(...selectedCards) === Math.max(...selectedCards)) {
                    matchesFound[animalID] = 1;
                    
                    if (calculateSum(matchesFound) == numAnimals) {
                        gameState = GameState.End;

                        highestCurrentScore = getLeaderboardForMode()[4].score;
                        if (highestCurrentScore == "" || numAttempts < highestCurrentScore) {
                            updateBest();
                        }
                        else {
                            setPlayAgainButtonVisibility(true);
                        }
                    }
                    else {
                        gameState = GameState.Match;
                    }
                }
                else {
                    gameState = GameState.Fail;
                    turnovertimeout = setTimeout (() => {
                        showUnsolvedCards();
                        selectedCards = [];
                        gameState = GameState.Open;
                        updateProgressStepper();
                    }, getTimeoutForMode());
                }
                setAttemptsColour();
            }
            updateProgressStepper();
            break;
    }

    updateMessage();
}

function getTimeoutForMode() {
    return (easyMode ? 2 : 1)*(500*(copiesPerAnimal+1));
}

function handleBackgroundClick() {
    if (gameState == GameState.Fail || gameState == GameState.Match) {
        showUnsolvedCards();
        selectedCards = [];
        gameState = GameState.Open;
        updateMessage();
        updateProgressStepper();
    }
}

function updateProgressStepper() {
    progressBar = document.getElementById("progress");
    progressBar.style
               .width = Math.min(95, Math.max((95/copiesPerAnimal)*selectedCards.length, 0)) + "%";
    if (gameState == GameState.Match) {
        progressBar.style["background-color"] = "#008000";
    }
    else if (gameState == GameState.Fail) {
        progressBar.style["background-color"] = "#9b0000";
    }
    else if (gameState == GameState.End) {
        progressBar.style.width = 0;
    }
    else {
        progressBar.style["background-color"] = "#5a86d1";
    }
}

function hideCard(id) {
    card = document.getElementsByClassName("card " + id)[0];
    card.classList.remove("visible");
    card.classList.add("hidden");
}

function showUnsolvedCards() {
    for (let i=0; i<numAnimals*copiesPerAnimal; i++) {
        if (matchesFound[Math.floor(i/copiesPerAnimal)] != 1) {
            card = document.getElementsByClassName("card " + i)[0];
            card.classList.remove("hidden");
            card.classList.add("visible");
        }
    }
}

function incrementAttempts() {
    numAttempts += 1;
    document.getElementById("attempts").innerText = "Attempts: " + numAttempts;
}

function setAttemptsColour() {
    if (gameState == GameState.Match) {
        document.getElementById("attempts").classList.add("green");
        document.getElementById("attempts").classList.remove("red");
    }
    else if (gameState == GameState.Fail) {
        document.getElementById("attempts").classList.add("red");
        document.getElementById("attempts").classList.remove("green");
    }
    else {
        document.getElementById("attempts").classList.remove("red");
        document.getElementById("attempts").classList.remove("green");
    }
}

const calculateSum = (arr) => {
    return arr.reduce((total, current) => {
        return total + current;
    }, 0);
}

function selectRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function setPlayAgainButtonVisibility(value) {
    setButtonVisibility("playagain", value);
    setButtonVisibility("menu", value);
}

function setButtonVisibility(buttonID, value) {
    button = document.getElementById(buttonID);
    if (value) {
        button.classList.add("visible");
        button.classList.remove("hidden");
    } else {
        button.classList.add("hidden");
        button.classList.remove("visible");
    }
}

function updateBest() {
    document.getElementById("leaderboardname").classList.remove("hidden");
    document.getElementById("label-leaderboardname").classList.remove("hidden");
    waitingForNameEntry = true;
}

function checkNameEntry(evt) {
    if (waitingForNameEntry
        && evt.key == "Enter"
        && document.getElementById("leaderboardname").value.length == 3) {
            setBest(document.getElementById("leaderboardname").value);
            waitingForNameEntry = false;
            document.getElementById("leaderboardname").classList.add("hidden");
            document.getElementById("label-leaderboardname").classList.add("hidden");
    }
}

function setBest(currentUserName) {
    leaderboard = getLeaderboardForMode();
    leaderboard.push({name: currentUserName, score: numAttempts, align: alignToGrid});
    leaderboard.sort(ascending());
    saveLeaderboard(leaderboard);

    displayLeaderboardForMode();
    setPlayAgainButtonVisibility(true);
}

function displayLeaderboardForMode() {
    document.getElementById("leaderboard-div").hidden = false;
    document.getElementById("easymodelabel").hidden = !easyMode;

    leaderboard = getLeaderboardForMode();
    for (let i=0; i<5; i++) {
        nameField = document.getElementById("name" + (i+1));
        scoreField = document.getElementById("score" + (i+1));
        if (leaderboard[i].name != "") {
            nameField.innerText = leaderboard[i].name + (leaderboard[i].align=='1' ? "*" : "");
            scoreField.innerText = parseInt(leaderboard[i].score);
        }
        else {
            nameField.innerText = "";
            scoreField.innerText = "";
        }
    }
}

function getLeaderboardForMode() {
    leaderboardForMode = [];
    for (let i=0; i<5; i++) {
        nameScoreString = localStorage.getItem("scoreE" + (easyMode ? 1 : 0) + "M" + copiesPerAnimal + "P" + i) ?? "";
        leaderboardForMode[i] = {
            name: nameScoreString.substring(0,3),
            score: nameScoreString.substring(3,7),
            align: nameScoreString.substring(7,8)
        };
    }
    return leaderboardForMode;
}

function saveLeaderboard(lb) {
    lb = lb.slice(0,5);
    for (let i=0; i<5; i++) {
        if (lb[i].name != "") {
            localStorage.setItem(
                "scoreE" + (easyMode ? 1 : 0) + "M" + copiesPerAnimal + "P" + i,
                lb[i].name + lb[i].score.toString().padStart(4,'0') + (lb[i].align ? '1' : '0')
            )
        }
    }
}

function ascending() {
    return function(a, b) {
        if (a.score === b.score) {return 0;}
        if (a.score === "") {return 1;}
        if (b.score === "") {return -1;}
        return a.score-b.score;
    }
}

function flipAlignToGrid() {
    alignToGrid = !alignToGrid;
}

function flipEasyMode() {
    easyMode = !easyMode;
}

openMessageOptions = [
    "Click to turn over cards at a time; try and find matching sets!",
    "Click to reveal animals at a time; see if you can find the matches!",
    "Click on cards to turn them over; try to uncover all the matching animals!"
]

partialMessageOptions = [
    "Can you find the matches?",
    "Do you know where the matching animals are?",
    "Click again to search for matches!",
    "See if you can turn over the matches!"
]

failMessageOptions = [
    "Oops! Those don't match. Click anywhere to try again.",
    "What a silly billy - those animals don't match. Give it another go.",
    "Oh no! Those aren't the same animal. Try again.",
    "Nope - not a match. Keep looking!"
]

matchMessageOptions = [
    "Nice - that's a match! Only REMAINING left to find!",
    "Good work, those are all the same! Keep it up to find the REMAINING still hiding!",
    "Well done! Just REMAINING more sets to uncover!",
    "Those are indeed all the same animal. Chop chop, there's REMAINING more to find."
]

newBestMessageOptions = [
    "Congratulations - that's a new best score! Want to try again?",
    "Woah! You've beaten your best score! Reckon you can do it again?",
    "That's a new record! But I think you can do better..."
]

gameEndMessageOptions = [
    "Congratulations - you did it! Click the button to try and beat your score!",
    "I'm so proud of you for finding all the sets. Think you can do it again faster?",
    "Nice work, that's the game! Click 'play again' to try and beat your score!"
]

menuMessageOptions = [
    "Turn over sets of cards and try to find all the matching animals!",
    "Match up the animal pairs and test your memory!"
]

openMessageOptions1v1 = [
    "Player INFO, it's your turn!",
    "It's Player INFO to turn a card first!",
    "Whenever you're ready, Player INFO"
]

partialMessageOptions1v1 = [
    "Player INFO, can you turn over the matching animal?",
    "Let's see if Player INFO can find the match!",
    "Time for Player INFO to turn over a card. Hope it's a match!"
]

failMessageOptions1v1 = [
    "Oh no! That's not a match.",
    "Oops! Those animals don't match!",
    "Nope - not a match. Keep looking!"
]

matchMessageOptions1v1 = [
    "Nice - that's a match! A point for Player INFO!",
    "Good work Player INFO, those are the same!",
    "You have an impressive memory, Player INFO.",
    "One point to Player INFO for an impressive match!"
]

function updateMessage() {
    newMessage = "";
    switch (gameState) {
        case GameState.Open:
            if (competitiveMode) {
                newMessage = selectRandomFromArray(openMessageOptions1v1);
                newMessage = newMessage.replace("INFO", isPlayerOneTurn? "1 (left)" : "2 (right)");
            }
            else {
                newMessage = selectRandomFromArray(openMessageOptions);
            }
            break;
        case GameState.Partial:
            if (competitiveMode) {
                newMessage = selectRandomFromArray(partialMessageOptions1v1);
                newMessage = newMessage.replace("INFO", isPlayerOneTurn? "1 (left)" : "2 (right)");
            }
            else {
                newMessage = selectRandomFromArray(partialMessageOptions);
            }
            break;
        case GameState.Fail:
            if (competitiveMode) {
                newMessage = selectRandomFromArray(failMessageOptions1v1);
            }
            else {
                newMessage = selectRandomFromArray(failMessageOptions);
            }
            break;
        case GameState.Match:
            if (competitiveMode) {
                newMessage = selectRandomFromArray(matchMessageOptions1v1);
                newMessage = newMessage.replace("INFO", isPlayerOneTurn? "1" : "2");
            }
            else {
                newMessage = selectRandomFromArray(matchMessageOptions);
                newMessage = newMessage.replace("REMAINING", (numAnimals-calculateSum(matchesFound)));
            }
            break;
        case GameState.End:
            if (competitiveMode) {
                if (playerOneScore == playerTwoScore) {
                    newMessage = "It's a tie! Play again to see who will be victorious!";
                }
                else if (playerTwoScore > playerOneScore) {
                    if (playerTwoScore - playerOneScore < 3) {
                        newMessage = "It was close, but Player 2 pulled the win!";
                    }
                    else {
                        newMessage = "A decisive victory for Player 2. Fancy a rematch?";
                    }
                }
                else {
                    if (playerOneScore - playerTwoScore < 3) {
                        newMessage = "A close game, but Player 1 snatched the win!";
                    }
                    else {
                        newMessage = "Victory for Player 1! Fancy a rematch?"
                    }
                }
            }
            else {
                if (isNewBest) {
                    newMessage = selectRandomFromArray(newBestMessageOptions);
                }
                else {
                    newMessage = selectRandomFromArray(gameEndMessageOptions);
                }
            }
            break;
        case GameState.Menu:
            newMessage = selectRandomFromArray(menuMessageOptions);
            break;
    }
    document.getElementById("subtitle").innerText = newMessage;
}