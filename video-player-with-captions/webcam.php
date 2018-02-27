<head>
	<style>
	  button {
	    margin: 0 20px 0 0;
	    width: 85.9px;
	  }

	  button#hangupButton {
	    margin: 0;
	  }

	  p.borderBelow {
	    margin: 0 0 1.5em 0;
	    padding: 0 0 1.5em 0;
	  }

	  video {
	    height: 225px;
	    margin: 0 0 20px 0;
	    vertical-align: top;
	    width: calc(50% - 13px);
	  }

	  video#localVideo {
	    margin: 0 20px 20px 0;
	  }

	    video {
	    	border-width: 1px;
	    	border-color: red;
	    	border-style: solid;
	    }

	    video#localVideo {
	      margin: 0 10px 20px 0;
	    }	
	</style>
</head>
<body>
    <video id="localVideo" autoplay muted></video>
    <video id="remoteVideo" autoplay></video>

    <div>
      <button id="startButton">Start</button>
      <button id="callButton">Call</button>
      <button id="hangupButton">Hang Up</button>
    </div>

    <p>View the console to see logging. The <code>MediaStream</code> object <code>localStream</code>, and the <code>RTCPeerConnection</code> objects <code>localPeerConnection</code> and <code>remotePeerConnection</code> are in global scope, so you can inspect them in the console as well.</p>

    <a href="https://github.com/samdutton/simpl/blob/gh-pages/rtcpeerconnection" title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>
	<script type="text/javascript">
		var offerOptions = {
		  offerToReceiveAudio: 1,
		  offerToReceiveVideo: 1
		};
		var startButton = document.getElementById('startButton');
		var callButton = document.getElementById('callButton');
		var hangupButton = document.getElementById('hangupButton');
		var localStream;
		var pc1;
		var pc2;
		var localVideo = document.getElementById('localVideo');
		var remoteVideo = document.getElementById('remoteVideo');
		startButton.onclick = start;
		callButton.onclick = call;
		function start() {
		  startButton.disabled = true;
		  navigator.mediaDevices.getUserMedia({
		    audio: true,
		    video: true
		  })
		    .then(gotStream)
		    .catch(function(e) {
		      alert('getUserMedia() error: ' + e.name);
		    });
		}
		function gotStream(stream) {
		  localVideo.srcObject = stream;
		  localStream = stream;
		  callButton.disabled = false;
		}
		function call() {
		  callButton.disabled = true;
		  hangupButton.disabled = false;
		  startTime = window.performance.now();
		  var videoTracks = localStream.getVideoTracks();
		  var audioTracks = localStream.getAudioTracks();
		  if (videoTracks.length > 0) {
		    console.log('Using video device: ' + videoTracks[0].label);
		  }
		  if (audioTracks.length > 0) {
		    console.log('Using audio device: ' + audioTracks[0].label);
		  }
		  var servers = null;
		  pc1 = new RTCPeerConnection(servers);
		  console.log('Created local peer connection object pc1');
		  pc1.onicecandidate = function(e) {
		    onIceCandidate(pc1, e);
		  };
		  pc2 = new RTCPeerConnection(servers);
		  console.log('Created remote peer connection object pc2');
		  pc2.onicecandidate = function(e) {
		    onIceCandidate(pc2, e);
		  };
		  pc1.oniceconnectionstatechange = function(e) {
		    onIceStateChange(pc1, e);
		  };
		  pc2.oniceconnectionstatechange = function(e) {
		    onIceStateChange(pc2, e);
		  };
		  pc2.onaddstream = gotRemoteStream;

		  pc1.addStream(localStream);
		  console.log('Added local stream to pc1');

		  console.log('pc1 createOffer start');
		  pc1.createOffer( offerOptions ).then(
		    onCreateOfferSuccess,
		    onCreateSessionDescriptionError
		  );
		}
		function gotRemoteStream(e) {
		  remoteVideo.srcObject = e.stream;
		  console.log('pc2 received remote stream');
		}
		function onCreateOfferSuccess(desc) {
		  console.log('Offer from pc1\n' + desc.sdp);
		  console.log('pc1 setLocalDescription start');
		  pc1.setLocalDescription(desc).then(
		    function() {
		      onSetLocalSuccess(pc1);
		    },
		    onSetSessionDescriptionError
		  );
		  console.log('pc2 setRemoteDescription start');
		  pc2.setRemoteDescription(desc).then(
		    function() {
		      onSetRemoteSuccess(pc2);
		    },
		    onSetSessionDescriptionError
		  );
		  console.log('pc2 createAnswer start');
		  // Since the 'remote' side has no media stream we need
		  // to pass in the right constraints in order for it to
		  // accept the incoming offer of audio and video.
		  pc2.createAnswer().then(
		    onCreateAnswerSuccess,
		    onCreateSessionDescriptionError
		  );
		}
		function onCreateSessionDescriptionError(error) {
		  console.log('Failed to create session description: ' + error.toString());
		}
		function onSetSessionDescriptionError(error) {
		  console.log('Failed to set session description: ' + error.toString());
		}
		function onIceCandidate(pc, event) {
		  getOtherPc(pc).addIceCandidate(event.candidate)
		    .then(
		      function() {
		        onAddIceCandidateSuccess(pc);
		      },
		      function(err) {
		        onAddIceCandidateError(pc, err);
		      }
		    );
		  console.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
		    event.candidate.candidate : '(null)'));
		}
		function onCreateAnswerSuccess(desc) {
		  console.log('Answer from pc2:\n' + desc.sdp);
		  console.log('pc2 setLocalDescription start');
		  pc2.setLocalDescription(desc).then(
		    function() {
		      onSetLocalSuccess(pc2);
		    },
		    onSetSessionDescriptionError
		  );
		  console.log('pc1 setRemoteDescription start');
		  pc1.setRemoteDescription(desc).then(
		    function() {
		      onSetRemoteSuccess(pc1);
		    },
		    onSetSessionDescriptionError
		  );
		}
		function onSetLocalSuccess(pc) {
		  console.log(getName(pc) + ' setLocalDescription complete');
		}

		function getOtherPc(pc) {
		  return (pc === pc1) ? pc2 : pc1;
		}
		function onSetRemoteSuccess(pc) {
		  console.log(getName(pc) + ' setRemoteDescription complete');
		}
		function getName(pc) {
		  return (pc === pc1) ? 'pc1' : 'pc2';
		}
	</script>
</body>
 