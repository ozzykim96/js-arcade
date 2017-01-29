/* 
 *	StartPage
 */
/* global util, GameSoftwareInfo */

var StartPage = function() {    
    function StartPage(game) {
        var bestScore = "0";

        // TODO: use a cookie
        if (typeof(localStorage) !== "undefined") {
            bestScore = localStorage.getItem("best_score");

            if (bestScore === null) {
                bestScore = "0";
                localStorage.setItem("best_score", bestScore);
            }
        }

        // create a body wrapper
        this.wrap = document.body.appendChild(util.createElement("div", "wrapper"));

        // header
        this.wrap.appendChild(
                util.createElement('div', 'header', '<h1 class="title">T.E.T.R.I.S</h1>'));

        // create menu
        var menuElem = util.createElement('div', 'menu');
        this.wrap.appendChild(menuElem);
        
        var startGameElem = util.createElement('h2', 'item', 'Start a new game (z)');
        startGameElem.onclick = function() {
            game.processCommand("z");
            game.show();            
        };
        menuElem.appendChild(startGameElem);
        
        var quitGameElem = util.createElement('h2', 'item', 'Quit game (x)');
        quitGameElem.onclick = function() {
            game.processCommand("x");
            game.show();            
        };
        menuElem.appendChild(quitGameElem);
        
        // best scroe
        menuElem.appendChild(
                util.createElement('h3', null, 'best score:' + bestScore));
        
        // footer
        var footer = util.createElement('div', 'footer');
        footer.appendChild(
                util.createElement('p', null, 'press z to start and press x to quit.'));
        footer.appendChild(
                util.createElement('p', null, 'software version '
                    + GameSoftwareInfo.VERSION));
        this.wrap.appendChild(footer);
    }

    StartPage.prototype.close = function() {
        var node = document.body;
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    };

    StartPage.prototype.processCommand = function(command) {
        if (command === "z")
            return "game_page";
        else if (command === "x") {
            if (confirm('Are you sure you want to exit?')) {
                window.close();
            } 
        }
        return "";
    };

    StartPage.prototype.show = function() {
        console.log("*********************");
        console.log("    T.E.T.R.I.S");
        console.log("*********************");
        console.log("start: start new game");
        console.log("exit: exit game");
    };

    return StartPage;
}();

