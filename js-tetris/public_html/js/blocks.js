var protoBlocks = [
    // #1
    [ 	"##  ", 
        "#   ", 
        "#   ",
        "    "
    ],
    [	"#   ",
        "### ",
        "    ",
        "    "
    ],
    [
        " #  ",
        " #  ",
        "##  ",
        "    "
    ],
    [
        "### ",
        "  # ", 
        "    ", 
        "    "
    ],
    // #2
    [ 	" ## ", 
        "  # ", 
        "  # ",
        "    "
    ],
    [	" ###",
        " #  ",
        "    ", 
        "    "
    ],
    [
        " #  ",
        " #  ",
        " ## ",
        "    "
    ],
    [
        "   #",
        " ###", 
        "    ", 
        "    "
    ],
    // #3
    [	"##  ",
        "##  ",
        "    ",
        "    "
    ],
    [	"##  ",
        "##  ",
        "    ",
        "    "
    ],
    [	"##  ",
        "##  ",
        "    ",
        "    "
    ],
    [	"##  ",
        "##  ",
        "    ",
        "    "
    ],
    // #4
    [	" #  ",
        " #  ",
        " #  ",
        " #  "
    ],
    [	"####",
        "    ",
        "    ",
        "    "
    ],
    [	" #  ",
        " #  ",
        " #  ",
        " #  "
    ],
    [	"####",
        "    ",
        "    ",
        "    "
    ],
    // #5
    [	" #  ",
        "##  ",
        " #  ",
        "    "
    ],
    [	"### ",
        " #  ",
        "    ",
        "    "
    ],
    [	" #  ",
        " ## ",
        " #  ",
        "    "
    ],
    [	" #  ",
        "### ",
        "    ",
        "    "
    ],
    // #6
    [	" #  ",
        "##  ",
        "#   ",
        "    "
    ],
    [	"##  ",
        " ## ",
        "    ",
        "    "
    ],
    [	" #  ",
        "##  ",
        "#   ",
        "    "
    ],
    [	"##  ",
        " ## ",
        "    ",
        "    "
    ],
    // #7
    [	" #  ",
        " ## ",
        "  # ",
        "    "
    ],
    [	" ##  ",
        "##  ",
        "    ",
        "    "
    ],
    [	" #  ",
        " ## ",
        "  # ",
        "    "
    ],
    [	" ## ",
        "##  ",
        "    ",
        "    "
    ]
];

/* 
 * Blocks 
 */
var Blocks = (function() {
    function Blocks() {
        this.x = 0;
        this.y = 0;

        var block = Math.floor(Math.random() * GameConfig.PROTO_BLOCKS_NUM);

        this.proto = new Array(4);

        for (var i = 0; i < 4; i++) {
            this.proto[i] = protoBlocks[block * 4 + i];
        }
        this.shape = Math.floor(Math.random() * 4); // randomized number
    }

    Blocks.prototype.movePos = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Blocks.prototype.get = function(x, y) {
        return this.proto[this.shape][y][x];
    };

    Blocks.prototype.turn = function(dir) {
        if (dir == 0) {
            this.shape--;
            if (this.shape < 0)
                this.shape = 3;
        }
        else {
            this.shape++;
            if (this.shape > 3)
                this.shape = 0;
        }
    };

    Blocks.prototype.copy = function() {
        var blocks = new Blocks();
        blocks.x = this.x;
        blocks.y = this.y;
        blocks.proto = this.proto;
        blocks.shape = this.shape;
        return blocks;
    };

    Blocks.prototype.move = function(direction) {
        switch (direction) {
            case "left":
                this.x--;
                break;
            case "right":
                this.x++;
                break;
            case "down":
                this.y++;
                break;
            case "turnleft":
                this.turn(0);
                break;
            case "turnright":
                this.turn(1);
                break;
            default:
                console.log("error: blocks.move: " + direction);
                break;
        }
    };

    Blocks.prototype.toString = function() {
        var str = "";

        this.proto[this.shape].forEach(function(line) {
            str += line + "\n";
        });

        return str;
    };
    
    return Blocks;
})();

