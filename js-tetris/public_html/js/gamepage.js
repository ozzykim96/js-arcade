/*
 * GamePage
 */
/* global util, GameConfig, timer */

var GamePage = (function() {
    var levelTable = [
        {
            timeout: 1200,
            nextscore: 100
        },
        {
            timeout: 1000,
            nextscore: 200
        },
        {
            timeout: 800,
            nextscore: 300
        },
        {
            timeout: 600,
            nextscore: 400
        },
        {
            timeout: 500,
            nextscore: 500
        },
        {
            timeout: 400,
            nextscore: 600
        }        
    ];
    
    function GamePage(game) {
        this.game = game;
        this.gameOver = false;

        // create a wrapper
        this.wrap = document.body.appendChild(
                util.createElement('div', 'wrapper'));

        // header
        var header = this.wrap.appendChild(
                util.createElement('div', 'header'));
        header.appendChild(util.createElement('h1', 'title',
                'T.E.T.R.I.S'));

        // game
        var gameElem = util.createElement('div', 'game');
        this.wrap.appendChild(gameElem);

        var boardElem = util.createElement("div", "board");
        gameElem.appendChild(boardElem);

        var levelElem = util.createElement("div", "level");
        gameElem.appendChild(levelElem);

        var scoreElem = util.createElement("div", "score");
        gameElem.appendChild(scoreElem);

        var previewElem = util.createElement("div", "preview");
        gameElem.appendChild(previewElem);
        
        // game over message
        var gameOverElem = util.createElement("div", "game_over",
                '<h1>Game Over</h1>');
        gameElem.appendChild(gameOverElem);
        
        // footer
        this.wrap.appendChild(
                util.createElement('div', 'footer', 
                'press Z, X to turn. left/right/down to move.'));

        // create the board & the first block
        this.blocks = new Blocks();
        this.blocks.setPos((GameConfig.BOARD_WIDTH - 4) / 2, 0);
        this.nextBlocks = new Blocks();
        this.board = new Board(GameConfig.BOARD_WIDTH, GameConfig.BOARD_HEIGHT, 
                                                boardElem);

        // create the level board
        this.level = 0;
        this._createLevelBoard(levelElem, this.level);

        // create the score board
        this.score = 0;
        this._createScoreBoard(scoreElem, this.score);

        // creae the preview board
        this.preview = new Board(4, 4, previewElem);
        this.preview.drawBlocks(this.nextBlocks);

        this.timer = this._setTimer(levelTable[this.level].timeout);
    };
    
    GamePage.prototype._createLevelBoard = function(levelElem, level) {
        var elem = util.createElement("p");
        elem.appendChild(util.createElement("span", "label", "Level: "));
        elem.appendChild(util.createElement("span", "number", '' + (level + 1)));
        levelElem.appendChild(elem);        
    };

    GamePage.prototype._createScoreBoard = function(scoreElem, score) {
        var elem = util.createElement("p");
        elem.appendChild(util.createElement("span", "label", "Score: "));
        elem.appendChild(util.createElement("span", "number", '' + score));
        scoreElem.appendChild(elem);
    };
    
    GamePage.prototype._setTimer = function(timeout) {
        function timer() {
            if (this.gameOver)
                    return;

            this.game.processCommand("down");
            this.game.show();            
        };
        
        return setInterval(timer.bind(this), timeout);
    };

    GamePage.prototype._translate = function(command) {
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

    GamePage.prototype._showGameOver = function() {
        clearInterval(this.timer);

        var gameOver = document.getElementsByClassName("game_over");
        gameOver[0].style.display = "block";
    };

    GamePage.prototype.processCommand = function(command) {
        command = this._translate(command);
        if (this.gameOver === true) {
            return "start_page";
        }

        var moved = this.board.act(this.blocks, command);
        if (moved || command !== "down")
            return "";

        // blocks can be piled up on the board.
        this.blocks = this.board.tick(this.blocks);

        // remove filled lines
        var removedLines = this.board.removeFilledLines();
        if (removedLines > 0) {
            this.score += removedLines * 10;
            
            if (this.level < levelTable.length - 1) {
                if (this.score >= levelTable[this.level].nextscore) {
                    this.level++;

                    clearInterval(this.timer);
                    this.timer = this._setTimer(levelTable[this.level].timeout);
                }                
            }
        }

        if (this.board.isPiledUp()) {
            // game over		
            console.log("board is piled up");
            this.gameOver = true;

            // set best score
            var bestScore = util.getCookie("score");
            if (bestScore === "") bestScore = "0";
            
            if (Number(bestScore) < this.score) {
                util.setCookie("score", this.score.toString(), 30);
            }

            // display game over message
            this._showGameOver();
            return "";
        }

        // if the blocks are piled (blocks == null), set the next blocks
        if (!this.blocks) {
            this.blocks = this.nextBlocks;
            this.blocks.setPos((GameConfig.BOARD_WIDTH - 4) / 2, 0);

            // create new blocks
            this.nextBlocks = new Blocks();
            this.preview.drawBlocks(this.nextBlocks);
        }
        return "";
    };

    GamePage.prototype.show = function() {
        console.log(this.board.toString(this.blocks));	

        // set level
        var elem = document.getElementsByClassName("level");
        var level = elem[0].getElementsByClassName("number");
        level[0].textContent = this.level + 1;

        // set score
        var elem = document.getElementsByClassName("score");
        var score = elem[0].getElementsByClassName("number");
        score[0].textContent = this.score;

        // draw blocks
        this.board.drawBlocks(this.blocks);
    };

    GamePage.prototype.close = function() {
        util.removeAllChildElements(document.body);
    };
    
    return GamePage;
})();

