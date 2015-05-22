var upnp = require("peer-upnp");
var http = require("http");
var server = http.createServer();
var PORT = 8080;

// start server on port 8080.
server.listen(PORT);

// Create a UPnP Peer. 
var peer = upnp.createPeer({
    prefix: "/upnp",
    server: server
}).on("ready",function(peer){
    console.log("ready");
    // advertise device after peer is ready
    device.advertise();
}).on("close",function(peer){
    console.log("closed");
}).start();

// Create a Basic device.
var device = peer.createDevice({
    autoAdvertise: true,
    uuid: "",
    productName: "IoT Reference Platform",
    productVersion: "1.04",
    domain: "schemas-upnp-org",
    type: "Basic",
    version: "1",
    friendlyName: "IOTRP-DEVICE",
    manufacturer: "Intel",
    manufacturerURL: "http://www.intel.com/content/www/us/en/homepage.html",
    modelName: "Edison",
    modelDescription: "Intel IoT Device",
    modelNumber: "Edison",
    modelURL: "",
    serialNumber: "",
    UPC: ""
});
