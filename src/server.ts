var http = require("http");
var url = require("url");
var piblaster = require("pi-blaster.js");

const port = 8081;


// Create a server
http.createServer((request, response) => {
    var reqUrl = url.parse(request.url);
    var pathname = reqUrl.pathname;

    var blaster = new RaspiBlaster();
    blaster.clearInterval();

    console.log(`Request for ${pathname} received.`);

    if (pathname.indexOf("/on") === 0) {
        blaster.set(1.0, 1.0, 1.0);
    }

    var hexColor;
    if (pathname.indexOf("/color") === 0) {
        hexColor = pathname.slice("/color/".length, pathname.length);
        blaster.setHex(hexColor);
    }

    if (pathname.indexOf("/blink") === 0) {
        hexColor = pathname.slice("/blink/".length, pathname.length);
        blaster.blink(hexColor);
    }

    if (pathname.indexOf("/cycle") === 0) {
        blaster.cycle();

    }

    if (pathname.indexOf("/off") === 0) {
        blaster.set(0, 0, 0);
    }
    
    // HTTP Status: 200 : OK
    response.writeHead(200, { 'Content-Type': "application/json" });

    // Send the response body 
    response.end();
}).listen(port);

console.log(`Server running at :${port}`);