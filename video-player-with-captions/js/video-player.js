var hide = false;
(function () {
	//'use strict';
	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
		// Obtain handles to main elements
		var textTracks = {};
		var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('video');
		video.controls = false;
		var videoControls = document.getElementById('videoControls');
		videoControls.setAttribute('data-state', 'visible');
		var playpause = document.getElementById('playpause');
		var stop = document.getElementById('stop');
		var mute = document.getElementById('mute');
		var volinc = document.getElementById('volinc');
		var voldec = document.getElementById('voldec');
		var fullscreen = document.getElementById('fs');
		var subtitles = document.getElementById('subtitles');
		var linesub = document.getElementById('linesub');
		var timelatesub = document.getElementById('timelatesub');
		var fontsizesub = document.getElementById('fontsizesub');
	    var curtimetext = document.getElementById("curtimetext");
	    var durtimetext = document.getElementById("durtimetext");
	    var rangemute = document.getElementById("rangemute");
	    var turnlight = document.getElementById("turnlight");
	    var zoomvd = document.getElementById("zoomvd");
	    var listsub = document.getElementById("listsub");
	    var colorsub = document.getElementById("colorsub");


		flag= false;
		var svgprogress = document.getElementById('svgprogress');
		window.changeWidth = function (ev) {
			var left = svgprogress.getBoundingClientRect().left;
			var width = ev.pageX - left;
		    var percent = width * 100/svgprogress.offsetWidth;
			document.getElementById('line2').setAttribute("x2", ""+percent+"%");
			document.getElementById('line3').setAttribute("cx",""+percent+"%");

			var pos = (ev.pageX  - left) / svgprogress.offsetWidth;
				video.currentTime = pos * video.duration;
		}
		// Check if the browser supports the Fullscreen API
		var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
		// If the browser doesn't support the Fulscreen API then hide the fullscreen button
		if (!fullScreenEnabled) {
			fullscreen.style.display = 'none';
		}

		// Check the volume
		var checkVolume = function(dir) {
			if (dir || dir === 0) {
				currentVolume = dir;
				video.volume = dir;
				// If the volume has been turned off, also set it as muted
				// Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
				if (currentVolume <= 0) video.muted = true;
				else video.muted = false;
			}
			changeButtonState('mute');
		}

		// Change the volume
		var alterVolume = function(dir) {
			checkVolume(dir);
		}

		// Set the video container's fullscreen state
		var setFullscreenData = function(state) {
			videoContainer.setAttribute('data-fullscreen', !!state);
			// Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
			fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
		}

		// Checks if the document is currently in fullscreen mode
		var isFullScreen = function() {
			return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
		}

		// Fullscreen
		var handleFullscreen = function() {
			// If fullscreen mode is active...	
			if (isFullScreen()) {
					// ...exit fullscreen mode
					// (Note: this can only be called on document)
					if (document.exitFullscreen) document.exitFullscreen();
					else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
					else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
					else if (document.msExitFullscreen) document.msExitFullscreen();
					setFullscreenData(false);
				}
				else {
					// ...otherwise enter fullscreen mode
					// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
					if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
					else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
					else if (videoContainer.webkitRequestFullScreen) {
						// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
						// ensures that our custom controls are visible:
						// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
						// figure[data-fullscreen=true] .controls { z-index:2147483647; }
						video.webkitRequestFullScreen();
					}
					else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
					setFullscreenData(true);
				}
			}

		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', function() {

			});

			// Changes the button state of certain button's so the correct visuals can be displayed with CSS
			var changeButtonState = function(type) {
				// Play/Pause button
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					}
					else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// Mute button
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			}
			// Add event listeners for video specific events
			video.addEventListener('play', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('volumechange', function() {
				checkVolume();
			}, false);		
			video.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});	
			videoContainer.addEventListener('mousemove', function(e) {
				if (hide) {
					videocontrolsinside.style.display = 'block';
					hide = false;
					clearTimeout(idtimeout);
					idtimeout = setTimeout( function(){
						videocontrolsinside.style.display = 'none';
						hide = true;
					}, 3000);
				}
			});	
			rangemute.addEventListener('change', function() {
				checkVolume(this.value);
			}, false);	
			turnlight.addEventListener('click', function(e) {
				if (this.getAttribute('data-state') == 'off') {
					var div = document.createElement('div');
					div.setAttribute('style', 'position: fixed;top:0;left:0;right:0;bottom:0;background-color:black;opacity:0.97;');
					div.id = "blocktv";
					document.body.appendChild(div);
					div.addEventListener('click', function () {
						videoControls.style.display = "block";
						turnlight.setAttribute("data-state", "off");
						this.parentNode.removeChild(this);
						videoContainerFull.style.zIndex = "auto";
						if (zoomvd.getAttribute('data-state') == '+') {
							zoomvd.click();
						}
					});
					videoContainerFull.style.zIndex = 100;
					videoControls.style.display = 'none';
					this.setAttribute('data-state', 'on');
				} else {
					// var el = document.getElementById('blocktv');
					// el.parentNode.removeChild(el);
				}
			});	
			zoomvd.addEventListener('click', function() {
				if (this.getAttribute('data-state') == '-') {
					videoContainerFull.style.width = '854px';
					videoContainerFull.style.position = 'fixed';
					videoContainerFull.style.left = '0';
					videoContainerFull.style.right = '0';
					videoContainerFull.style.margin = 'auto';
					this.setAttribute('data-state', '+');
					turnlight.click();
				} else {
					videoContainerFull.style.width = '640px';
					videoContainerFull.style.position = 'auto';
					videoContainerFull.style.left = 'auto';
					videoContainerFull.style.right = 'auto';
					videoContainerFull.style.margin = 'auto';
					this.setAttribute('data-state', '-');
				}
			}, false);

			// The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
			stop.addEventListener('click', function(e) {
				video.pause();
				video.currentTime = 0;
				// Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
				changeButtonState('playpause');
			});

			// Add events for all buttons			
			playpause.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});	

			// Turn off all subtitles
			for (var i = 0; i < video.textTracks.length; i++) {
				video.textTracks[i].mode = 'hidden';
				textTracks[video.textTracks[i].language] = video.textTracks[i];
			}

			// Creates and returns a menu item for the subtitles language menu
			var subtitleMenuButtons = [];
			var createMenuItem = function(id, lang, label) {
				var button = document.createElement('option');
				//var button = listItem.appendChild(document.createElement('button'));
				button.setAttribute('id', id);
				button.className = 'subtitles-button';
				if (lang.length > 0) button.setAttribute('lang', lang);
				button.value = label;
				button.setAttribute('data-state', 'inactive');
				button.appendChild(document.createTextNode(label));
				subtitleMenuButtons.push(button);
				return button;
			}
			// Go through each one and build a small clickable list, and when each item is clicked on, set its mode to be "showing" and the others to be "hidden"
			var subtitlesMenu;
			if (video.textTracks) {
				//var df = document.createDocumentFragment();
				//var subtitlesMenu = df.appendChild(document.createElement('option'));
				listsub.className = 'subtitles-menu';
				listsub.appendChild(createMenuItem('subtitles-off', '', 'Off'));
				for (var i = 0; i < video.textTracks.length; i++) {
					listsub.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
				}
				//videoContainer.appendChild(subtitlesMenu);
			}
			subtitles.addEventListener('click', function(e) {
				if (subtitlesMenu) {
					subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
				}
			});

			mute.addEventListener('click', function(e) {
				video.muted = !video.muted;
				changeButtonState('mute');
			});

			fs.addEventListener('click', function(e) {
				handleFullscreen();
			});

			// As the video is playing, update the progress bar
			video.addEventListener('timeupdate', function() {
			    var percent = video.currentTime * 100 / video.duration;
				document.getElementById('line2').setAttribute("x2", ""+percent+"%");
				document.getElementById('line3').setAttribute("cx",""+percent+"%");

				seektimeupdate();
			});

			// Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
			document.addEventListener('fullscreenchange', function(e) {
				setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
			});
			document.addEventListener('webkitfullscreenchange', function() {
				setFullscreenData(!!document.webkitIsFullScreen);
			});
			document.addEventListener('mozfullscreenchange', function() {
				setFullscreenData(!!document.mozFullScreen);
			});
			document.addEventListener('msfullscreenchange', function() {
				setFullscreenData(!!document.msFullscreenElement);
			});

			listsub.addEventListener('change', function(e) {
				// Set all buttons to inactive
				subtitleMenuButtons.map(function(v, i, a) {
					subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
				});
				// Find the language to activate
				var el = this.options[this.selectedIndex];
				var lang = el.getAttribute('lang');
				for (var i = 0; i < video.textTracks.length; i++) {
					// For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
					if (video.textTracks[i].language == lang) {
						video.textTracks[i].mode = 'showing';
						el.setAttribute('data-state', 'active');
					}
					else {
						video.textTracks[i].mode = 'hidden';
					}
				}
				//subtitlesMenu.style.display = 'none';
			});
			// Add events for all buttons			
			linesub.addEventListener('change', function(e) {
				var activelang = document.querySelector(".subtitles-menu option[data-state='active']").lang;
				window.track = textTracks[activelang];
				var linenymber = parseInt(this.value);
				for (var i = 0; i < track.cues.length; i++) {
					track.cues[i].line = linenymber;
				}
				window.track.mode = 'hidden';
				window.track.mode = 'showing';
			}); 
			timelatesub.addEventListener('change', function(e) {
				var activelang = document.querySelector(".subtitles-menu option[data-state='active']").lang;
				window.track = textTracks[activelang];
				var time = parseFloat(this.value);
				for (var i = 0; i < track.cues.length; i++) {
					track.cues[i].startTime = track.cues[i].startTime + time;
					track.cues[i].endTime = track.cues[i].endTime + time;
				}
				window.track.mode = 'hidden';
				window.track.mode = 'showing';
			});	
			fontsizesub.addEventListener('change', function(e) {
				document.getElementById('stylehead').innerHTML = 'video::cue{color:' + 
					colorsub.value + '; font-size:' + fontsizesub.value + 'px;}';
			});	
			colorsub.addEventListener('change', function(e) {
				document.getElementById('stylehead').innerHTML = 'video::cue{color:' + 
					colorsub.value + '; font-size:' + fontsizesub.value + 'px;}';
			});	
		}
	 }

	 function setColor (color) {
	 	

	 }

	function seektimeupdate(){
	    var nt = video.currentTime * (100 / video.duration);
	    //seekslider.value = nt;
	    var curmins = Math.floor(video.currentTime / 60);
	    var cursecs = Math.floor(video.currentTime - curmins * 60);
	    var durmins = Math.floor(video.duration / 60);
	    var dursecs = Math.floor(video.duration - durmins * 60);
	    if(cursecs < 10){ cursecs = "0"+cursecs; }
	    if(dursecs < 10){ dursecs = "0"+dursecs; }
	    if(curmins < 10){ curmins = "0"+curmins; }
	    if(durmins < 10){ durmins = "0"+durmins; }
	    curtimetext.innerHTML = curmins+":"+cursecs;
	    durtimetext.innerHTML = durmins+":"+dursecs;
	}
 })();

idtimeout = setTimeout(function(){ videocontrolsinside.style.display = 'none'; hide = true;}, 3000);