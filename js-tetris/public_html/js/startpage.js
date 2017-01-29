/* 
 *	StartPage
 */
function StartPage(game) {
    var bestScore = "0";
    if (typeof(localStorage) !== "undefined") {
        bestScore = localStorage.getItem("best_score");

        if (bestScore == null) {
            bestScore = "0";
            localStorage.setItem("best_score", bestScore);
        }
    }

    var elm = elt("div", "start");
    elm.innerHTML = 
        '<br><br><h2 class="game_menu">Start a new game (z)</h3>' + 
        '<h2 class="game_menu">Quit game (x)</h3><br><br>' +
        '<h2 class="startgame">best score:' + bestScore + '</h3>' +
        '<p class="startgame">press z to start and press x to quit.</p>';

    elm.innerHTML += '<br><br><p class="startgame">software version ' + GameSoftwareInfo.VERSION + '</p>';

    var title = document.body.appendChild(elt("h1", "game_title"));
    title.textContent = "T.E.T.R.I.S";

    this.wrap = document.body.appendChild(elm);
}

StartPage.prototype.processCommand = function(command) {
    if (command == "z")
        return "game_page";
    else if (command == "x") {
        if (confirm('Are you sure you want to exit?')) {
            window.close();
        } 
    }
	
    return "";
}

StartPage.prototype.show = function() {
    console.log("*********************");
    console.log("    T.E.T.R.I.S");
    console.log("*********************");
    console.log("start: start new game");
    console.log("exit: exit game");
}

StartPage.prototype.close = function() {
    var node = document.body;
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}
