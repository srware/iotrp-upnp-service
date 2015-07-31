var upnp = require("peer-upnp");
var http = require("http");
var os = require("os");
var dbus = require('dbus-native');
var bus = dbus.systemBus();
var fs = require('fs');

var name="intel-iot-device";
var manufacturer="Intel";
var manufacturerUrl="http://www.intel.com/content/www/us/en/homepage.html";
var model="Intel IoT Device";
var modelUrl="http://www.intel.co.uk/content/www/uk/en/internet-of-things/overview.html";
var version="1.0.0";
var serial="12345678";

var PORT = 8080;
var deviceIDPath = "/etc/machine-id"
var edisonSerialPath = "/factory/serial_number"
var deviceInfoPath = "/etc/device-info"
var versionPath = "/etc/version"
var namePath = "/etc/hostname"

// Exit cleanly when executed using systemd
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

// Checks connection state using Connman
var checkState = function () {
    	bus.invoke({
        	destination: 'net.connman',
        	path: '/',
        	'interface': 'net.connman.Manager',
        	member: 'GetProperties',
        	type: dbus.messageType.methodCall,
    	}, function(error, response) {
        	if (error) {
        		console.error('Connman Error!', error);
	    		process.exit(0)
        	} else {
	    		if(response[0][1][1] != 'online') {
				console.info('Network not connected, exiting!')
				process.exit(0)
	    		}
        	}
    	});

    	setTimeout(checkState,10000);
}

//
// Populate device information if available
//

// Check for Edison serial
if(fs.existsSync(edisonSerialPath)) {
	try {
		data = fs.readFileSync(edisonSerialPath);
		serial = data.toString();
	} catch (err) {
		console.log("Failed to read Edison serial file!")
	}
}
// Use machine ID
else if(fs.existsSync(deviceIDPath)) {
	try {
		data = fs.readFileSync(deviceIDPath);
		serial = data.toString();
	} catch (err) {
		console.log("Failed to read device ID file!")
	}
}

// Get version
if(fs.existsSync(versionPath)) {
	try {
		data = fs.readFileSync(versionPath);
		version = data.toString();
	} catch (err) {
		console.log("Failed to read version file!")
	}
}

// Get name
if(fs.existsSync(namePath)) {
	try {
		data = fs.readFileSync(namePath);
		name = data.toString();
	} catch (err) {
		console.log("Failed to read name file!")
	}
}

// Get device info
if(fs.existsSync(deviceInfoPath)) {
	try {
		data = fs.readFileSync(deviceInfoPath);

		deviceInfo = data.toString().split("\n");
		for(i in deviceInfo) {
			if(deviceInfo[i].indexOf("Manufacturer=") > -1) {
				manufacturer = deviceInfo[i].split("=")[1];
			} else if(deviceInfo[i].indexOf("ManufacturerUrl=") > -1) {
				manufacturerUrl = deviceInfo[i].split("=")[1];
			} else if(deviceInfo[i].indexOf("Model=") > -1) {
				model = deviceInfo[i].split("=")[1];
			} else if(deviceInfo[i].indexOf("ModelUrl=") > -1) {
				modelUrl = deviceInfo[i].split("=")[1];
			}
		}
	} catch (err) {
		console.log("Failed to read device info file!")
	}
}

// Start server.
var server = http.createServer();
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
    	serialNumber: serial
});

// Start polling connection
checkState()

// Advertise device after peer is ready
device.advertise();
