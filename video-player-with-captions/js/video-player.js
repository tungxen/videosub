(function () {
	var supportsVideo = !!document.createElement('video').canPlayType;
	if (!supportsVideo) { return; }
	var hide = false;
	var textTracks = {}, 						p = $('.videoContainerFull'),
	videoContainer = p.find('.videoContainer'), video = p.find('.video')[0],
	videoControls = p.find('.videoControls'), 	stop = p.find('.stop'),
	mute = p.find('.mute'), 					volinc = p.find('.volinc'),
	voldec = p.find('.voldec'), 				fullscreen = p.find('.fs'),
	subtitles = p.find('.subtitles'), 			timelatesub = p.find('.timelatesub'),
	fontsizesub = p.find('.fontsizesub'), 		curtimetext = p.find(".curtimetext"),
	durtimetext = p.find(".durtimetext"), 		turnlight = p.find(".turnlight"),
	zoomvd = p.find(".zoomvd"), 				listsub = p.find(".listsub"),
	colorsub = p.find(".colorsub"), 			containsubtext = p.find(".containsubtext"),
	qtyminus = p.find(".qtyminus"), 			qtyplus = p.find(".qtyplus"),
	svgprogress = p.find('.svgprogress'),		videocontrolsinside = p.find('.videocontrolsinside'),
	fs = p.find(".fs"),							videojq = $(video),
	flag= false;
	svgprogress.on('mousemove', function (e) {
		if (flag==true)
			changeWidth(e);
	});
	svgprogress.on('mouseup', function () {
		flag = false
	});
	svgprogress.on('mouseleave', function () {
		flag = false;
	});
	svgprogress.on('mousedown', function (e) {
		flag = true;
		changeWidth(e);
	});

	window.changeWidth = function (ev) {
		var left = svgprogress[0].getBoundingClientRect().left;
		var width = ev.pageX - left;
	    var percent = width * 100/svgprogress[0].offsetWidth;
		p.find('.line2').attr("x2", ""+percent+"%");
		p.find('.line3').attr("cx",""+percent+"%");
		var pos = (ev.pageX  - left) / svgprogress[0].offsetWidth;
			video.currentTime = pos * video.duration;
	};

	// Check the volume
	var checkVolume = function(dir) {
		if (dir || dir === 0) {
			currentVolume = dir;
			video.volume = dir;
			if (currentVolume <= 0) 
				video.muted = true;
			else 
				video.muted = false;
		}
		changeButtonState('mute');
	}

	// Change the volume
	var alterVolume = function(dir) {
		checkVolume(dir);
	}

	// Set the video container's fullscreen state
	var setFullscreenData = function(state) {
		videoContainer.attr('data-fullscreen', !!state);
		// Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
		fullscreen.attr('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
	}

	// Checks if the document is currently in fullscreen mode
	var isFullScreen = function() {
		return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
	}

	// Fullscreen
	var handleFullscreen = function() {
		// If fullscreen mode is active...	
		console.log(isFullScreen());
		if (isFullScreen()) {
				// ...exit fullscreen mode
				// (Note: this can only be called on document)
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
				setFullscreenData(false);
		} else {
			// ...otherwise enter fullscreen mode
			// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
			if (videoContainer[0].requestFullscreen){
				videoContainer[0].requestFullscreen();
			}
			else if (videoContainer[0].mozRequestFullScreen){
				videoContainer[0].mozRequestFullScreen();
			}
			else if (videoContainer[0].webkitRequestFullScreen) {
				// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
				// ensures that our custom controls are visible:
				// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
				// figure[data-fullscreen=true] .controls { z-index:2147483647; }
				videoContainer[0].webkitRequestFullScreen();
			}
			else if (videoContainer[0].msRequestFullscreen) videoContainer[0].msRequestFullscreen();
			setFullscreenData(true);
		}
	}
	// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
	videojq.on('loadedmetadata', function() {

	});

	// Changes the button state of certain button's so the correct visuals can be displayed with CSS
	var changeButtonState = function(type) {
		if (type == 'mute') {
			mute.attr('data-state', video.muted ? 'unmute' : 'mute');
		}
	}
	// Add event listeners for video specific events
	videojq.on('play', function() {
		changeButtonState('playpause');
	}, false);

	videojq.on('pause', function() {
		changeButtonState('playpause');
	}, false);

	videojq.on('volumechange', function() {
		checkVolume();
	}, false);
	// videojq.on('click', function(e) {
	// 	if (video.paused || video.ended) video.play();
	// 	else video.pause();
	// });	
	videoContainer.on('mousemove', function(e) {
		if (hide) {
			videocontrolsinside.css('display', 'block');
			hide = false;
			clearTimeout(idtimeout);
			idtimeout = setTimeout( function(){
				//videocontrolsinside.css('display', 'none');
				hide = true;
			}, 3000);
		}
	});

	turnlight.on('click', function(e) {
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
	zoomvd.on('click', function() {
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
	stop.on('click', function(e) {
		video.pause();
		video.currentTime = 0;
		// Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
		changeButtonState('playpause');
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
		listsub.append(createMenuItem('subtitles-off', '', 'Off'));
		for (var i = 0; i < video.textTracks.length; i++) {
			listsub.append(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
		}
		//videoContainer.appendChild(subtitlesMenu);
	}

	mute.on('click', function(e) {
		video.muted = !video.muted;
		changeButtonState('mute');
	});

	fs.on('mousedown', function(e) {
		handleFullscreen();
	});

	// As the video is playing, update the progress bar
	videojq.on('timeupdate', function() {
	    var percent = video.currentTime * 100 / video.duration;
		p.find('.line2').attr("x2", ""+percent+"%");
		p.find('.line3').attr("cx",""+percent+"%");
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

	function showSub () {
		var cue = this.activeCues[0];
		if (cue == undefined) {
			containsubtext.html('');
		} else {
			containsubtext.html(cue.getCueAsHTML());
			console.log(cue.getCueAsHTML());
		}
	}
	listsub.on('change', function(e) {
		// Set all buttons to inactive
		subtitleMenuButtons.map(function(v, i, a) {
			subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
		});
		// Find the language to activate
		var el = this.options[this.selectedIndex];
		var lang = el.getAttribute('lang');
		for (var i = 0; i < video.textTracks.length; i++) {
			video.textTracks[i].removeEventListener("cuechange", showSub);
			// For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
			if (video.textTracks[i].language == lang) {
				video.textTracks[i].mode = 'showing';
				el.setAttribute('data-state', 'active');
				video.textTracks[i].addEventListener("cuechange", showSub);
			}
			else {
				video.textTracks[i].mode = 'hidden';
			}
		}
		//subtitlesMenu.style.display = 'none';
	});
	timelatesub.on('change', function(e) {
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
	fontsizesub.on('change', function(e) {
		document.getElementById('stylehead').innerHTML = 'video::cue{color:' + 
			colorsub.value + '; font-size:' + fontsizesub.value + 'px;}';
	});	
	colorsub.on('change', function(e) {
		containsubtext.attr('data-color', $(this).val());
	});
	qtyminus.on('click', function(e) {
		timelatesub.value = parseInt(timelatesub.value) - 1;
	});	
	qtyplus.on('click', function(e) {
		timelatesub.value = parseInt(timelatesub.value) + 1;
	});

	function setColor (color) {
	 	
	}

	function seektimeupdate(){
	    var nt = video.currentTime * (100 / video.duration);
	    var curmins = Math.floor(video.currentTime / 60);
	    var cursecs = Math.floor(video.currentTime - curmins * 60);
	    var durmins = Math.floor(video.duration / 60);
	    var dursecs = Math.floor(video.duration - durmins * 60);
	    if(cursecs < 10){ cursecs = "0"+cursecs; }
	    if(dursecs < 10){ dursecs = "0"+dursecs; }
	    if(curmins < 10){ curmins = "0"+curmins; }
	    if(durmins < 10){ durmins = "0"+durmins; }
	    curtimetext[0].innerHTML = curmins+":"+cursecs;
	    durtimetext[0].innerHTML = durmins+":"+dursecs;
	}

	var flagmute = false;
	var muteSvg = p.find('.muteSvg');
	muteSvg.on('mouseover', function(e) {
		if (flagmute == true) {
			changeWidthMute(e);
		}
	});	
	muteSvg.on('mouseup', function(e) {
		flagmute = false;
	});	
	muteSvg.on('mouseleave', function(e) {
		flagmute = false;
	});	
	muteSvg.on('mousedown', function(e) {
		flagmute = true;
		changeWidthMute(e);
	});	

	function changeWidthMute(ev) {
		var width = ev.pageX - muteSvg.offsetLeft;
	    var percent = width * 100/muteSvg.offsetWidth;
		p.find('muteline2').attr("x2", ""+percent+"%");
		p.find('muteline3').attr("cx",""+percent+"%");
		console.log(parseFloat(width/muteSvg.offsetWidth));
		checkVolume(parseFloat(width/muteSvg.offsetWidth));
	}
	idtimeout = setTimeout(function(){ //videocontrolsinside.css('display', 'none'); hide = true;
}, 3000);
	$( function() {
		$( ".draggable" ).draggable({ containment: "parent" });
	});

 })();
