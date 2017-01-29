var util = {};

util.createElement = function(name, className, innerText) {
    var elem = document.createElement(name);
    if (className) elem.className = className;
    if (innerText) elem.innerHTML = innerText;
    
    return elem;
};


