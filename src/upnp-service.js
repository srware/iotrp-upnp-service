var upnp = require("peer-upnp");
var http = require("http");
var os = require("os");
var ip = require('ip');
var dbus = require('dbus-native');
var bus = dbus.systemBus();

var name="IOT-DEVICE";
var manufacturer="Intel";
var manufacturerUrl="http://www.intel.com/content/www/us/en/homepage.html";
var model="IoT Device";
var modelUrl="";
var version="1.0.0";
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

bus.invoke({
        destination: 'net.connman',
        path: '/',
        'interface': 'net.connman.Manager',
        member: 'GetProperties',
        type: dbus.messageType.methodCall,
}, function(error, response) {
        if (error) {
                console.error('Error', error);
                console.log('Connman Error!')
        } else {
                console.info('Success', response);
                console.log(response)
        }
});

var address = ip.address();
console.log("IP Address: " + address)

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
}).on("close",function(peer){
    console.log("closed");
}).start();

// Create a Basic device.
var device = peer.createDevice({
    autoAdvertise: false,
    productName: "Intel IoT Reference Platform",
    domain: "schemas-upnp-org",
    type: "Basic",
    version: "1",
    friendlyName: name,
    manufacturer: manufacturer,
    manufacturerURL: manufacturerUrl,
    modelName: model,
    modelNumber: version,
    modelURL: modelUrl,
    serialNumber: serial,
    presentationURL: "http://" + address
});

// Advertise device after peer is ready
device.advertise();
