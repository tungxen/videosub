DisplaySub = (function ($) {
	var version = '';
	var parentdivsub = document.getElementById("parentdivsub");
	return {
		init: function () {
			$('#parentdivsub').on('click', 'div>button', function () {
				var classtime = $(this).parent().attr('class');
		    	classtime = classtime.replace("time", "");
		    	classtime = classtime.replace("_", ".");
		    	classtime = Number(classtime) - 0.5;
				VideoPlay.setTime(classtime);
			});
		},
		render: function (cue) {
			var html = cue.getCueAsHTML();
		    var para = document.createElement("DIV");
		    var button = document.createElement("BUTTON");
		    var textnode = document.createTextNode(">");
		    var classtime = "time" + cue.startTime;
		    classtime = classtime.replace(".", "_");
		    button.classList.add('w3-btn');
		    button.classList.add('w3-tiny');
		    button.classList.add('w3-black');
		    button.classList.add('w3-padding-small');
		    button.appendChild(textnode);
		    para.classList.add(classtime);
		    para.appendChild(button);
		    para.appendChild(html);
		    parentdivsub.appendChild(para);
		},
		selected: function (cue) {
			var html = cue.getCueAsHTML();
			$('#parentdivsub div.selected').removeClass('selected');
		    var classtime = "time" + cue.startTime;
		    classtime = classtime.replace(".", "_");
			$('#parentdivsub div.'+classtime).addClass('selected');
			//console.log(isScrolledIntoView($('#parentdivsub div.selected')[0], $('#parentdivsub')[0]));
			$('#parentdivsub').animate({
		        scrollTop: $("#parentdivsub div.selected").offset().top - $("#parentdivsub div").eq(1).offset().top
		    }, 1500);
		 // $('#parentdivsub').scrollTop($("#parentdivsub div.selected").offset().top - $("#parentdivsub div").eq(1).offset().top );
			// if (isScrolledIntoView($('#parentdivsub div.selected')[0]), $('#parentdivsub')[0]) {

			// }
		}
	}

	function isScrolledIntoView(el, pa) {
	    var rect = el.getBoundingClientRect();
	    var rectpa = pa.getBoundingClientRect();
	    console.log(rect);
	    console.log(rectpa);
	    // var elemTop = rect.top;
	    // var elemBottom = rect.bottom;
	    if (rect.top < rectpa.top || rect.top > rectpa.top + rectpa.height) {

	    }
	    // Only completely visible elements return true:
	    //var isVisible = (elemTop >= 0) && (elemBottom <= pa.innerHeight());
	    // Partially visible elements return true:
	    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
	    return isVisible;
	}

})($);

var VideoPlay = (function ($) {
	var supportsVideo = !!document.createElement('video').canPlayType;
	if (!supportsVideo) { return; }
	var setting = {
		vollum: '1',
		listsub: 'English',
		fontSize: '2.5',
		color: 'yellow',
		percentposition: '0'
	}
	var hide = false;
	betweenTop = 0;
	height = 0;
	percentposition = 0;
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
	draggablesub = p.find(".draggablesub"), 	videoContaineritem = p.find(".videoContaineritem"),
	subtemp = p.find(".subtemp");
	tung = draggablesub;
	tung2 = videojq;
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
			} else if (type == 'playpause') {
				p.attr('data-paused', video.paused ? 'true' : 'false');
			}
		}

		video.addEventListener('play', function () {
			changeButtonState('playpause');
		});

		video.addEventListener('pause', function () {
			changeButtonState('playpause');
		});

		videojq.on('volumechange', function() {
			checkVolume();
		}, false);
		videojq.on('click', function(e) {
			if (video.paused || video.ended) {
				video.play();
			}
			else {
				CopyToClipboard(subtemp[0]);
				subtemp.blur();
				video.focus();
				video.pause();
			}
		});	
		videoContainer.on('mousemove', function(e) {
			if (hide) {
				videocontrolsinside.css('display', 'block');
			}
			hide = false;
			clearTimeout(idtimeout);
			idtimeout = setTimeout( function(){
				videocontrolsinside.css('display', 'none');
				hide = true;
			}, 4000);
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
			button.value = lang;
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
			//listsub.append(createMenuItem('subtitles-off', '', 'Off'));
			for (var i = 0; i < video.textTracks.length; i++) {
				console.log(video.textTracks[i]);
				listsub.append(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
			}
			//videoContainer.appendChild(subtitlesMenu);
		}

		mute.on('click', function(e) {
			video.muted = !video.muted;
			changeButtonState('mute');
		});

		fs.on('click', function(e) {
	  		var topv = videojq.position().top;
	  		var tops = draggablesub.position().top;
	  		betweenTop = topv - tops;
	  		height = videojq.height();
			handleFullscreen();
	  		//draggablesub.trigger('drag');

	  		// var tops = draggablesub[0].getBoundingClientRect().top
	  		// if (topv + videojq.height() - tops  < 42) {
	  		// 	console.log(videojq.height() - draggablesub.position().top);
	  		// 	// return true;
	  		// }
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
				// console.log(cue);
				subtemp.val(cue.text);
				containsubtext.html(cue.getCueAsHTML());
				DisplaySub.selected(cue);
				// console.log(cue.getCueAsHTML());
			}
		}
		listsub.on('change', function(e) {
			console.log(this.selectedIndex);
			var el; // = this.options[this.selectedIndex];
			var listvalue = $(this).val();
			if (listvalue != undefined) {
				for (var i = 0; i < listvalue.length; i++) {
					el = $('.listsubnewdiv .listsub option[value="'+listvalue[i]+'"]')[0];
				}
				console.log($(this).val());
				console.log(el);
			}
			if (this.selectedIndex >= 0) {
				// Set all buttons to inactive
				subtitleMenuButtons.map(function(v, i, a) {
					subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
				});
				// Find the language to activate
				var el = this.options[this.selectedIndex];
				var lang = el.getAttribute('lang');
				for (var i = 0; i < video.textTracks.length; i++) {
					//console.log(video.textTracks);
					//cue.getCueAsHTML()
					video.textTracks[i].removeEventListener("cuechange", showSub);
					// For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
					if (video.textTracks[i].language == lang) {
						//video.textTracks[i].addEventListener("onload", function () { alert('')});
						videojq.find('track')[0].addEventListener("load", function () {
							for (var j = 0; j < this.track.cues.length; j++) {
								DisplaySub.render(this.track.cues[j]);
							}
						});
						tung = video.textTracks[i].cues;
							console.log(video.textTracks[i].cues.length);
						// video.textTracks[i].mode = 'showing';
						video.textTracks[i].mode = 'hidden';
						el.setAttribute('data-state', 'active');
						video.textTracks[i].addEventListener("cuechange", showSub);
					}
					else {
						video.textTracks[i].mode = 'hidden';
					}
				}
				setting.listsub = el.getAttribute('value');
				setLocal(setting);
				p.find('.draggable').show();
			} else {
				setting.listsub = '';
				setLocal(setting);
				p.find('.draggable').hide();
			}
		});
		timelatesub.on('change', function(e) {
			var activelang = p.find(".listsub option[data-state='active']").attr('lang');
			window.track = textTracks[activelang];
			var time = parseFloat(this.value);
			for (var i = 0; i < track.cues.length; i++) {
				track.cues[i].startTime = track.cues[i].startTime + time;
				track.cues[i].endTime = track.cues[i].endTime + time;
			}
			//console.log(time);
			//window.track.mode = 'hidden';
			//window.track.mode = 'showing';
		});	
		fontsizesub.on('change', function(e) {
	        draggablesub.css('font-size', draggablesub.width() / (fontsizesub.val()*10));
			setting.fontSize = fontsizesub.val();
			setLocal(setting);
		});	
		colorsub.on('change', function(e) {
			containsubtext.attr('data-color', $(this).val());
			setting.color = $(this).val();
			setLocal(setting);
		});
		qtyminus.on('click', function(e) {
			timelatesub.val(parseInt(timelatesub.val()) - 1);
			timelatesub.trigger('change');
		});	
		qtyplus.on('click', function(e) {
			timelatesub.val(parseInt(timelatesub.val()) + 1);
			timelatesub.trigger('change');
		});

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
			var width = ev.pageX - muteSvg[0].getBoundingClientRect().left;
		    var percent = width * 100/muteSvg[0].offsetWidth;
			p.find('.muteline2').attr("x2", ""+percent+"%");
			p.find('.muteline3').attr("cx",""+percent+"%");
			var volum = parseFloat(width/muteSvg[0].offsetWidth);
			volum = (volum < 0)? 0 : volum;
			volum = (volum > 1)? 1 : volum;
			checkVolume(volum);
		}

		function setLocal(setting){
			localStorage.setItem('setting', JSON.stringify(setting));
		}

		function CopyToClipboard(containerid) {
			if (document.selection) { 
			    var range = document.body.createTextRange();
			    range.moveToElementText(containerid);
			    range.select().createTextRange();
			    document.execCommand("copy"); 

			} else if (window.getSelection) {
			    var range = document.createRange();
			     range.selectNode(containerid);
			     window.getSelection().removeAllRanges();
			     window.getSelection().addRange(range);
			     document.execCommand("copy");
			}
		}

		function init () {
			idtimeout = setTimeout(function(){
				videocontrolsinside.css('display', 'none'); hide = true;
			}, 4000);

			draggablesub.draggable({
				containment: videoContaineritem,
		      	revert: function ( event, ui ) {
		      		var topv = videojq[0].getBoundingClientRect().top
		      		var tops = draggablesub[0].getBoundingClientRect().top
		      		if (topv + videojq.height() - tops  < 42) {
		      			//console.log(videojq.height() - draggablesub.position().top);
		      			return true;
		      		}
		      	},
		      	stop: function( event, ui ) {
		      		percentposition = draggablesub.position().top / videojq.height();
					setting.percentposition = percentposition;
					setLocal(setting);
		      	},
		      	stack: 'div'
		  	});
			if (localStorage.getItem('setting')) {
				setting = JSON.parse(localStorage.getItem('setting'));
			}
			listsub.val(setting.listsub);
			listsub.trigger('change');
			fontsizesub.val(setting.fontSize);
			fontsizesub.trigger('change');
			colorsub.val(setting.color);
			colorsub.trigger('change');
	        draggablesub.css('font-size', draggablesub.width() / (setting.fontSize*10));
	        percentposition = setting.percentposition;
	    	draggablesub.css('top',percentposition * videojq.height());
	      	$(window).on('resize.fittext orientationchange.fittext', function () {
	        	draggablesub.css('font-size', draggablesub.width() / (fontsizesub.val()*10));
	        	draggablesub.css('top', percentposition * videojq.height());
	      	});
		}

		return {
			togglePlay : function () {
				videojq.trigger('click');
			},
			left : function () {
				video.currentTime = video.currentTime - 5;
			},
			right : function () {
				video.currentTime = video.currentTime + 5;
			},
			init: init,
			setTime: function (time) {
				video.currentTime = time;
			}
		}
	})($);

$(function () {
	DisplaySub.init();
	VideoPlay.init();
})

shortcut.add("Left",function() {
	VideoPlay.left();
});
shortcut.add("Right",function() {
	VideoPlay.right();
});
shortcut.add("Space",function() {
	VideoPlay.togglePlay();
});