/*
 * GamePage
 */
var GamePage = (function() {
    function GamePage(game) {
        this.game = game;
        this.gameOver = false;

        var gameElt = elt("div", "game");

        var boardElt = elt("div", "game_board");
        var scoreElt = elt("div", "score_board");
        var previewElt = elt("div", "preview_board")
        var gameOverElt = elt("div", "game_over");

        var gameOverMessage = elt("h1");
        gameOverMessage.textContent = "Game Over";
        gameOverElt.appendChild(gameOverMessage);

        var helpMessage = elt("p", "help");
        helpMessage.textContent = "press Z, X to turn. left/right/down to move.";

        var title = document.body.appendChild(elt("h1", "game_title"));
        title.textContent = "T.E.T.R.I.S";

        this.wrap = document.body.appendChild(gameElt);

        this.wrap.appendChild(boardElt);
        this.wrap.appendChild(scoreElt);
        this.wrap.appendChild(previewElt);
        this.wrap.appendChild(gameOverElt);
        this.wrap.appendChild(helpMessage);

        // create the board & the first block
        this.blocks = new Blocks();
        this.blocks.movePos((GameConfig.BOARD_WIDTH - 4) / 2, 0);
        this.nextBlocks = new Blocks();
        this.board = new Board(GameConfig.BOARD_WIDTH, GameConfig.BOARD_HEIGHT, 
                                                boardElt);

        // creae the preview board
        this.preview = new Board(4, 4, previewElt);
        this.preview.drawBlocks(this.nextBlocks);

        // create the score board
        this.scores = 0;
        this.createScoreBoard(scoreElt);

        function timer() {
            if (this.gameOver)
                    return;

            this.game.processCommand("down");
            this.game.show();
        };
        this.timer = setInterval(timer.bind(this), 1000);
    };

    GamePage.prototype.createScoreBoard = function(scoreElt) {
        var score = elt("p", "score");
        score.textContent = this.scores;	
        scoreElt.appendChild(score);
    };

    GamePage.prototype.translate = function(command) {
        switch (command) {
            case "r":
                command = "right";
                break;
            case "l":
                command = "left";
                break;
            case "d":
                command = "down";
                break;
            case "z":
                command = "turnleft";
                break;
            case "x":
                command = "turnright";
                break;
        }
        return command;
    };

    GamePage.prototype.processCommand = function(command) {
        command = this.translate(command);
        if (this.gameOver == true) {
            return "start_page";
        }

        var moved = this.board.act(this.blocks, command);
        if (moved || command != "down")
            return "";

        // blocks can be piled up on the board.
        this.blocks = this.board.tick(this.blocks);

        // remove filled lines
        var removedLines = this.board.removeFilledLines();
        if (removedLines > 0) {
            this.scores += removedLines * 10;
        }

        if (this.board.isPiledUp()) {
            // game over		
            console.log("board is piled up");
            this.gameOver = true;

            var bestScore = localStorage.getItem("best_score");
            if (Number(bestScore) < this.scores) {
                localStorage.setItem("best_score", this.scores.toString());
            }

            // display game over message
            this.over();
            return "";
        }

        if (!this.blocks) {
            this.blocks = this.nextBlocks;
            this.blocks.movePos((GameConfig.BOARD_WIDTH - 4) / 2, 0);

            // create new blocks
            this.nextBlocks = new Blocks();
            this.preview.drawBlocks(this.nextBlocks);
        }
        return "";
    };

    GamePage.prototype.show = function() {
        console.log(this.board.toString(this.blocks));	

        var score = document.getElementsByClassName("score");
        score[0].textContent = this.scores;

        this.board.drawBlocks(this.blocks);
    };

    GamePage.prototype.over = function() {
        clearInterval(this.timer);

        var gameOverElt = document.getElementsByClassName("game_over");
        gameOverElt[0].style.display = "block";
    };

    GamePage.prototype.close = function() {
        var node = document.body;
        while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
        }
    };
    
    return GamePage;
})();

