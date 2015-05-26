var upnp = require("peer-upnp");
var http = require("http");
var server = http.createServer();
var PORT = 8080;

var name="IOT-DEVICE";
var model="IoT Device";
var modelUrl="";
var version="1.00";
var serial="12345678";
var address="";

// Start server on port 8080.
server.listen(PORT);

// Create a UPnP Peer. 
var peer = upnp.createPeer({
    prefix: "/upnp",
    server: server
}).on("ready",function(peer){
    console.log("ready");
    // Advertise device after peer is ready
    device.advertise();
}).on("close",function(peer){
    console.log("closed");
}).start();

// Create a Basic device.
var device = peer.createDevice({
    autoAdvertise: true,
    productName: "IoT Reference Platform",
    domain: "schemas-upnp-org",
    type: "Basic",
    version: "1",
    friendlyName: name,
    manufacturer: "Intel",
    manufacturerURL: "http://www.intel.com/content/www/us/en/homepage.html",
    modelName: model,
    modelDescription: "Intel IoT Device",
    modelNumber: version,
    modelURL: modelUrl,
    serialNumber: serial,
    presentationURL: address
});
