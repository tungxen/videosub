<!DOCTYPE html>
<html lang="en-IE">
<head>
</head>
<body>
<style>
	video {
		width:300px; height:150px; border:1px black solid;
	}
</style>
<div id="grid">
	<div id="col1">
		<button id="load">Play</button><br>
	</div>
	<div id="col2">
		<video id="myVideo" autoplay="autoplay" src="" width="1280" height="720">
			No video available
		</video>
	</div>
</div>
<script type="text/javascript">
	window.onload = function() {
	var file = 'https://r4---sn-8qj-nboel.googlevideo.com/videoplayback?clen=23095277&mime=video%2Fmp4&fvip=2&ipbits=0&requiressl=yes&ratebypass=yes&pl=21&initcwndbps=1112500&source=youtube&sparams=clen%2Cdur%2Cei%2Cgcr%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&key=yt6&c=WEB&expire=1518437519&id=o-AC3OBIZWZrrkGnCoGwhYGXrGGc7iRFa5sVHRAGvqx3_Z&lmt=1406051486189875&ip=14.161.5.67&gcr=vn&ei=LjCBWqOZOo3tqAHVraToDQ&dur=299.073&mv=m&mt=1518415808&ms=au%2Crdu&mn=sn-8qj-nboel%2Csn-i3b7kn76&signature=610C0043D8210AB8CA4EF7A51C484E3844C01C07.0DB4B13CB564D5C3910194BF1D833B3DD2C019B8&mm=31%2C29&itag=18&gir=yes&cpn=LS7r8zQjy_ZlRFwB&cver=1.20180208&ptk=youtube_single&oid=2vdeOEyFnLkxyHwg8VEfMQ&pltype=contentugc';
	var type = 'video/mp4';
	var codecs = 'avc1.4d0020,mp4a.40.2'; //  Codecs
	var width = '1280';
	var height = '720';
	//  elements
	var videoElement = document.getElementById('myVideo');
    var playButton = document.getElementById("load");
	var initialization = '0-94558';
	//  video parameters
	var bandwidth = '917965'; // bitrate of
	var index = 0; 
	var segments = ['94559-1126981',
					'1126982-2128137',
					'2128138-3217574',
					'3217575-4192648',
					'4192649-5167982',
					'5167983-6135384',
					'6135385-7070655',
					'7070656-8227462',
					'8227463-9140647',
					'9140648-10223616',
					'10223617-11475795',
					'11475796-12475225',
					'12475226-13269653',
					'13269654-14538816',
					'14538817-15509630',
					'15509631-16377523',
					'16377524-17375318',
					'17375319-18400897',
					'18400898-19425182',
					'19425183-20239268'];
	//  source and buffers
	var mediaSource;
	var videoSource;
	//  parameters to drive fetch loop
	var segCheck;
	var lastTime = 0;
	//  create mediaSource and initialize video 
	function setupVideo() {
		// create the media source 
		mediaSource = new (window.MediaSource || window.WebKitMediaSource)();
		var url = URL.createObjectURL(mediaSource);
		videoElement.pause();
		videoElement.src = url;
		videoElement.width = width;
		videoElement.height = height;
		// Wait for event that tells us that our media source object is 
		//   ready for a buffer to be added.
		mediaSource.addEventListener('sourceopen', function (e) {
			//videoSource = mediaSource.addSourceBuffer(type + ";" + codecs);
			videoSource = mediaSource.
						addSourceBuffer("video/mp4;codecs=avc1.4d0020,mp4a.40.2");
			initVideo(initialization, file); 
		});
		videoElement.play();
	}
	playButton.addEventListener("click", setupVideo, false);

	//  Load video's initialization segment 
	function initVideo(range, url) {
		var xhr = new XMLHttpRequest();
		//  set the desired range of bytes we want from the mp4 video file
		xhr.open('GET', url);
		xhr.setRequestHeader("Range", "bytes=" + range);
		// use .8 as fudge factor
		segCheck = (timeToDownload(range) * .8).toFixed(3);
		xhr.send();
		xhr.responseType = 'arraybuffer';
		xhr.addEventListener("readystatechange", function () {
			 if (xhr.readyState == xhr.DONE) { // wait for video to load
				// add response to buffer
				videoSource.appendBuffer(new Uint8Array(xhr.response));
				// Wait for the update complete event before continuing
				playSegment(segments[index], file);
				index++;
				videoElement.addEventListener("timeupdate", fileChecks, false);
			}
		}, false);
	}

	//  get video segments 
	function fileChecks() {
		if (index < segments.length) {
			if ((videoElement.currentTime - lastTime) >= segCheck) {
				playSegment(segments[index], file);
				lastTime = videoElement.currentTime;  
				index++;
			}
		} else {
			videoElement.removeEventListener("timeupdate", fileChecks, false);
		}
	}
	function playSegment(range, url) {
		var xhr = new XMLHttpRequest();
		if (range || url) { // make sure we've got incoming params
			xhr.open('GET', url);
			xhr.setRequestHeader("Range", "bytes=" + range);
			xhr.send();
			xhr.responseType = 'arraybuffer';
			xhr.addEventListener("readystatechange", function () {
				if (xhr.readyState == xhr.DONE) {
					segCheck = (timeToDownload(range) * .8).toFixed(3);
					console.log(segCheck);
					// Add received content to the buffer
					videoSource.appendBuffer(new Uint8Array(xhr.response));
				}
			}, false);
		}
	}
	function timeToDownload(range) {
		var vidDur = range.split("-");
		return (((vidDur[1] - vidDur[0]) * 8) / bandwidth)
	}
};
</script>
</body>

</html>
