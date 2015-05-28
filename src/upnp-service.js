var upnp = require("peer-upnp");
var http = require("http");
var os = require("os");

var name="IOT-DEVICE";
var model="IoT Device";
var modelUrl="";
var version="1.00";
var serial="12345678";

process.on('SIGTERM', function() {
    console.log('SIGTERM')
    peer.close()
    server.close()
    process.exit(0)
});

process.on('SIGINT', function() {
    console.log('SIGINT')
    peer.close()
    server.close()
    process.exit(0)
});

var address;
var interfaces = os.networkInterfaces();


// Iterate over interfaces ...
for (var devName in interfaces) {
    if(devName !== 'usb0' && devName !== 'lo') {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && alias.address !== '192.168.42.1' && !alias.internal) {
                address = alias.address;
		console.log("IP Address: " + address)
		break;
            }
        }
    }
}

if(!address) {
    process.exit(0)
}

// Start server on port 8080.
var server = http.createServer();
var PORT = 8080;
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
    autoAdvertise: false,
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
    presentationURL: "http://" + address
});
