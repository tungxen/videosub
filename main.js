(function() {
	var localConnection = null;   // RTCPeerConnection for our "local" connection
	var remoteConnection = null;  // RTCPeerConnection for the "remote"
	var sendChannel = null;       // RTCDataChannel for the local (sender)
	var receiveChannel = null;    // RTCDataChannel for the remote (receiver)
	function startup() {
		connectButton = document.getElementById('connectButton');
		sendButton = document.getElementById('sendButton');
		receiveBox = document.getElementById('receivebox');
		connectButton.addEventListener('click', connectPeers, false);
		sendButton.addEventListener('click', function () { sendChannel.send('tung'); },  false);
	}
	
	function connectPeers() {
		// Create the local connection and its event listeners
		localConnection = new RTCPeerConnection();
		// Create the data channel and establish its event listeners
		sendChannel = localConnection.createDataChannel("sendChanneltung");
		sendChannel.onopen = function (event) {
			if (sendChannel) {
				var state = sendChannel.readyState;
				console.log('state' + state);
			}
		};
		
		// Create the remote connection and its event listeners
		remoteConnection = new RTCPeerConnection();
		remoteConnection.ondatachannel = receiveChannelCallback;
		
		// Set up the ICE candidates for the two peers
		localConnection.onicecandidate = function (e){
			console.log(e.candidate);
				!e.candidate || remoteConnection.addIceCandidate(e.candidate).catch(function () {})
		};

		// localConnection.onicecandidate = e => !e.candidate
		// 		|| remoteConnection.addIceCandidate(e.candidate)
		// 		.catch(function () {});
		remoteConnection.onicecandidate = function (e) {
			!e.candidate || localConnection.addIceCandidate(e.candidate).catch(function () {});
		}
		// remoteConnection.onicecandidate = e => !e.candidate
		// 		|| localConnection.addIceCandidate(e.candidate)
		// 		.catch(function () {});
		// Now create an offer to connect; this starts the process
		localConnection.createOffer()
		.then(offer => localConnection.setLocalDescription(offer))
		.then(() => remoteConnection.setRemoteDescription(localConnection.localDescription))
		.then(() => remoteConnection.createAnswer())
		.then(answer => remoteConnection.setLocalDescription(answer))
		.then(() => localConnection.setRemoteDescription(remoteConnection.localDescription))
		.catch(function () {});
	}
	// Called when the connection opens and the data
	// channel is ready to be connected to the remote.
	function receiveChannelCallback(event) {
		receiveChannel = event.channel;
		receiveChannel.onmessage = function (event) {
			var el = document.createElement("p");
			var txtNode = document.createTextNode(event.data);
			el.appendChild(txtNode);
			receiveBox.appendChild(el);
		};
		receiveChannel.onopen = function (event) {
			if (receiveChannel) {
				console.log("Receive channel's status has changed to " + receiveChannel.readyState);
			}
			
		};
	}
	window.addEventListener('load', startup, false);
})();