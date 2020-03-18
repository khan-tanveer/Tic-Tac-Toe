function init(player, OPPONENT){
    //select canvas

    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");

    //board variables
    let board = [];
    const COLUMN = 3;
    const ROW = 3;
    const SPACE_SIZE = 150;

    //store players move
    let gameData = new Array(9);

    //by default the first player to play is the human
    let currentPlayer = player.man;

    //load x and  o images
    const xImage = new Image();
    xImage.src = "img/X.png"; 

    const oImage = new Image();
    oImage.src = "img/O.png"; 


    //win combinations
    const COMBOS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // for game over check
    let GAME_OVER = false;


    //draw the board
    function drawBoard(){
        //we give every space a unique id
        // so we have exactly where to put the player's move on the gamedata array
        let id = 0
        for(let i = 0; i < ROW; i++){
            board[i] = [];
            for(let j = 0; j < COLUMN; j++){
                board[i][j] = id;
                id++;

                //draw the spaces
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
            }
        }
    }
    drawBoard();

    //on players click
    canvas.addEventListener("click", function(event){

        //if its a game over ? EXIT
        if(GAME_OVER) return;

        // x & y position of mouse click relative to the canvas
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;

        // we calculate i & j of the clicked space 
        let i =Math.floor(Y/SPACE_SIZE);
        let j =Math.floor(X/SPACE_SIZE);

        //get the id of the space the player clicked on
        let id = board[i][j];

        //prevent the player to play the same space twice
        if(gameData[id]) return;

        //store the players move to gamedata
        gameData[id] = currentPlayer;
        
        // draw the move on board
        drawOnBoard(currentPlayer, i, j);

        //check if the play wins
        if(isWinner(gameData, currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        //check if its a tie game
        if(isTie(gameData)){
            showGameOver(tie);
            GAME_OVER = true;
            return;
        }

        //give turn to the other player
        currentPlayer = currentPlayer == player.man ? player.friend : player.man; 
    });

    //check for a winner 
    function isWinner(gameData, player){
        for(let i = 0; i < COMBOS.length;i++){
            let won = true;

            for(let j = 0; j < COMBOS[i].length;j++){
                let id = COMBOS[i][j];
                won = gameData[id] == player && won;
            }

            if(won){
                return true;
            }
        }
        return false;
    }

    //check for a tie game
    function isTie(){
        let isBoardFill = true;
        for(let i = 0; i < gameData.length;i++){
            isBoardFill = gameData[i] && isBoardFill;
        }
        if(isBoardFill){
            return true;
        }
        return false;
    }

    function showGameOver(player){
        let message = player == "tie" ? "Oops no winner" : "the winner is";
        let imgsrc = `img/${player}.png`;

        gameOverElement.innerHTML = `
            <h1>${message}</h1>
            <img class="winner-img" src=${imgsrc} alt="">
            <div class="play" onclick="location.reload()">Play Again!</div>
        
        `;


        gameOverElement.classList.remove("hide");
    }


    //draw on board
    function drawOnBoard(player,i , j){
        let img = player == "X" ? xImage : oImage;
        
        // the x , y position of the image are the x,y of the clicked space 
        ctx.drawImage(img, j * SPACE_SIZE, i * SPACE_SIZE);
    }
}

