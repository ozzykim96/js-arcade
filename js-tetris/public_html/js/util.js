var util = {};

util.createElement = function(name, className, innerText) {
    var elem = document.createElement(name);
    if (className) elem.className = className;
    if (innerText) elem.innerHTML = innerText;
    
    return elem;
};

util.removeAllChildElements = function(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
};

util.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

util.getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

