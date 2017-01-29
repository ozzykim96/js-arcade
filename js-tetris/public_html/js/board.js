
/* 
 * Boards 
 */
/* global GameConfig, util */

var Board = (function() {
    function Board(cx, cy, elem) {
        this.cx = cx;
        this.cy = cy;
        this.arr = new Array(cx * cy);
        this.clear();

        this.wrap = elem;
        this.makeBoard();
    }

    Board.prototype.clear = function() {
        for (var i = 0; i < this.cx * this.cy; i++) {
            this.arr[i] = " ";
        }
    };
    Board.prototype.get = function(x, y) {
        return this.arr[y * this.cx + x];
    };

    Board.prototype.set = function(x, y, value) {
        this.arr[y * this.cx + x] = value;
    };

    /* set blocks on the board */
    Board.prototype.setBlocks = function(blocks) {	
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (blocks.get(x, y) !== " ") {
                    this.set(x + blocks.x, y + blocks.y, blocks.get(x, y));
                }
            }
        }
    };

    /* remove blocks on the board */
    Board.prototype.removeBlocks = function(blocks) {
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (blocks.get(x, y) !== " ") {
                    this.set(x + blocks.x, y + blocks.y, " ");
                }
            }
        }
    };

    /* check if move blocks on the board. if it can't move, it will return false. */
    Board.prototype.checkMovable = function(blocks, direction) {
        var newBlocks = blocks.copy();
        newBlocks.move(direction);

        if (this.checkConflict(newBlocks)) {
            return false;
        }
        return true;
    };

    /* check whether any blocks conflict with other blocks on the board. */
    Board.prototype.checkConflict = function(blocks) {
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                var newX = blocks.x + x;
                var newY = blocks.y + y;
                if (blocks.get(x, y) !== " ")
                {
                    if (newX < 0 || newY < 0 || newX >= this.cx || newY >= this.cy) {
                            return true;
                    }
                    // if the block of the board is not empty
                    if (this.get(newX, newY) !== " ") {
                            return true;
                    }
                }
            }
        }
        return false;
    };

    Board.prototype.removeLine = function(line) {
        // copy n - 1 line to n line
        for (var y = line; y > 0; y--) {
            for (var x = 0; x < this.cx; x++) {
                this.set(x, y, this.get(x, y - 1));
            }
        }
        // remove first line
        for (var x = 0; x < this.cx; x++) {
            this.set(x, 0, " ");
        }	
    };

    Board.prototype.removeFilledLines = function() {
        var removedLines = 0;
        for (var y = 0; y < this.cy; y++) {
            var filled = true;
            for (var x = 0; x < this.cx; x++) {
                if (this.get(x, y) === " ") {
                    filled = false;
                    break;
                }
            }
            if (filled) {
                removedLines++;
                this.removeLine(y);
            }
        }
        return removedLines;
    };

    Board.prototype.isPiledUp = function() {
        for (var x = 0; x < this.cx; x++) {
            if (this.get(x, 0) !== " ")
                return true;
        }
        return false;
    };

    Board.prototype.act = function(blocks, command) {
        var movable = this.checkMovable(blocks, command);
        if (movable) {
            blocks.move(command);
            return true;
        }
        return false;
    };

    Board.prototype.tick = function(blocks) {
        var movable = this.checkMovable(blocks, "down");

        // pile the block
        if (!movable) {	
            this.setBlocks(blocks);
            return null;
        }
        else {
            console.log("info: Board.tick: movable.");
        }
        return blocks;
    };

    Board.prototype.makeBoard = function() {
        var scale = GameConfig.BLOCK_SIZE;

        function createTable(cx, cy) {
            var table = util.createElement("table", "background");
            table.style.width = cx * scale + "px";
            for (var y = 0; y < cy; y++) {
                var row = table.appendChild(util.createElement("tr"));
                row.style.height = scale + "px";
                for (var x = 0; x < cx; x++) {
                    row.appendChild(util.createElement("td"));
                }
            }
            return table;
        }

        this.wrap.appendChild(createTable(this.cx, this.cy));
    };

    Board.prototype.drawBlocks = function(blocks) {
        if (blocks) {
            this.setBlocks(blocks);
        }
        var rowElems = this.wrap.firstChild.children;
        for (var y = 0; y < this.cy; y++) {
            var elems = rowElems[y].children;
            for (var x = 0; x < this.cx; x++) {
                switch (this.arr[y * this.cx + x]) {
                    case " ":
                        elems[x].className = "";
                        break;
                    case "#":
                        elems[x].className = "block";
                        break;
                    default:
                        elems[x].className = "";
                        break;					
                }
            }
        }

        if (blocks) {
            this.removeBlocks(blocks);
        }
    };

    Board.prototype.toString = function(blocks) {
        if (blocks) {
            this.setBlocks(blocks);
        }
        var str = "";
        for (var x = 0; x < this.cx + 2; x++) {
            str += "*";
        }
        str += "\n";

        for (var y = 0; y < this.cy; y++) {
            str += "*";
            for (var x = 0; x < this.cx; x++) {
                str += this.arr[y * this.cx + x];
            }
            str += "*\n";
        }

        for (var x = 0; x < this.cx + 2; x++) {
            str += "*";
        }
        str += "\n";

        if (blocks) {
            this.removeBlocks(blocks);
        }
        return str;
    };

    return Board;
})();


