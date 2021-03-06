var Game = function() {
    function Game() {
        this.curPage = new StartPage(this);
    }

    Game.prototype.processCommand = function(command) {
        var nextState = this.curPage.processCommand(command);

        switch (nextState) {
            case "game_page":
                this.curPage.close();
                this.curPage = new GamePage(this);
                break;
            case "start_page":
                this.curPage.close();
                this.curPage = new StartPage(this);
                break;
            case "quit_game":
                return "quit";
        }
        return "";
    };

    Game.prototype.show = function() {
        this.curPage.show();
    };
    
    return Game;
}();

function createGame() {
    var game = new Game();

    var addKeyHandler = function(event) {
        var keyCodes = {
            37: "left", 38: "up", 39: "right", 40: "down",
            88: "x", 90: "z"
        };

        if (keyCodes.hasOwnProperty(event.keyCode)) {
            game.processCommand(keyCodes[event.keyCode]);
            game.show();
            event.preventDefault();
        }		
    };

    addEventListener("keydown", addKeyHandler);

    return game;
}
