<!DOCTYPE html>
<html lang="en-IE">
<head>
	<meta charset="utf-8" />
	<title>bbStyled Video Player with Subtitles - Mozilla</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="css/styles.css" />
	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="js/shortcut.js"></script>
	<script src="js/jquery.multi-select.js"></script>
	<link rel="stylesheet" type="text/css" href="css/play.css" />
	<link rel="stylesheet" type="text/css" href="css/example-styles.css" />
</head>
<body>
	<div class="videoContainerFull" style="display: inline-block;position:relative; width: 100%"
			data-paused="true">
		<input style="position: absolute; top:-100%; left: -100%" tabindex="-1" type="textl" class="subtemp" name="">
		<div class="videoContainer" style="position: relative;" data-fullscreen="false">
			<div class="videoContaineritem" style="position: relative;">
				<div class="draggable divsub draggablesub" style="position: absolute; width: 100%; text-align: center; user-select: none;">
					<div class="containsubtext" data-color="white">tung tung xen</div>
				</div>
				<video id="videotest" data="" class="video" width="100%" preload="metadata">
					<!-- <source src="video/tung.mp4" type="video/mp4"> -->
					<source src="https://r3---sn-npoe7n7s.c.drive.google.com/videoplayback?id=3f57a9d0ea6d0dbd&itag=18&source=webdrive&requiressl=yes&mm=30&mn=sn-npoe7n7s&ms=nxu&mv=m&pl=21&ttl=transient&ei=Ve13Wq-YKsy4uQXS1KOoCw&susc=dr&driveid=0B33q56-qh428Q1pYSjBxYXFMdFE&app=explorer&mime=video/mp4&lmt=1493821554352699&mt=1517808858&ip=14.161.5.67&ipbits=0&expire=1517812581&cp=QVNGWUlfUVVWQlhOOjIya1NYWlpIelB6&sparams=ip,ipbits,expire,id,itag,source,requiressl,mm,mn,ms,mv,pl,ttl,ei,susc,driveid,app,mime,lmt,cp&signature=729CDCA79AADDE711C0583BEF480CA2126332351.738B713BAFFD8136EC1F395BCBCDA7DDBDF0E60A&key=ck2&cpn=fHYdx1NO4csD8gDF&c=WEB_EMBEDDED_PLAYER&cver=20180131" type="video/mp4">
					<source src="video/developerStories-en.webm" type="video/webm">
					<source src="video/sintel-short.mp4" type="video/mp4">
					<source src="video/sintel-short.webm" type="video/webm">
					<track label="Japanese" kind="subtitles" srclang="ja" src="subtitles/vtt/jp/ghoul1.vtt" default>
					<track label="english" kind="subtitles" srclang="en" src="subtitles/vtt/developerStories-subtitles-en.vtt" default>
					<!-- <track label="English" kind="subtitles" srclang="en" src="subtitles/vtt/sintel-en.vtt" default> -->
					<track label="Hiragana" kind="subtitles" srclang="hi" src="subtitles/vtt/sintel-de.vtt">
					<track label="Katakana" kind="subtitles" srclang="ka" src="subtitles/vtt/sintel-es.vtt">
				</video>
			</div>
			<div class="videocontrolsinside" data-state="show" class="controls" style="position: absolute; bottom: 0; left: 0; right: 0;">
	    		<div style="display: inline-block; position: absolute; user-select: none; bottom: 2px; left: 1px;">
	    			<span class="curtimetext">00:00</span> / <span class="durtimetext">00:00</span>
	    		</div>
				<table style="width: 100%; position: relative;" onclick="console.log('tung1')">
					<tr>
						<td>
							<div class="svgprogress" data-state="red" style="padding-right: 9px">
								<svg height="20" width="100%" style="overflow: visible;">
								    <line class="linetotal line1" x1="0" y1="8" x2="100%" y2="8"
								    	style="stroke:rgb(153, 102, 51);stroke:transparent;stroke-width:2" />
								    <line class="lineload line2"  x1="0" y1="8" x2="0%" y2="8" />
								  <circle class="linecircle line3"  cx="0%" cy="8" r="3" />
								</svg>
							</div>
						</td>
						<td style="width:20px">
							<div  style="height: 20px; width: 20px" class="fs" type="button" data-state="go-fullscreen"></div>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="videoControls" class="controls" data-state="visible" style="user-select: none;">
			<button style="display: none;" class="playpause" type="button" data-state="play">play</button>
			<button style="display: none" class="stop" type="button" data-state="stop">stop</button>
			<div style="width: 28px; height: 28px; display: inline-block;" class="mute" type="button" data-state="mute"></div>
			<div class="muteSvg" style="display: inline-block; width: 50px">
				<svg height="20" width="100%"  style="overflow: visible;" >
				    <line x1="0" y1="8" x2="100%" y2="8"
				    	style="stroke:rgb(153, 102, 51);stroke-width:2" />
				    <line class="muteline2" x1="0" y1="8" x2="0%" y2="8" />
				  <circle class="muteline3" cx="0%" cy="8" r="3" />
				</svg>
			</div>
  			<input style="width: 50px; display: none" type="range" step="0.1" min="0" max="1" value="1" class="rangemute">
			<button class="turnlight" style="width: 30px; height: 30px" type="button" data-state="off"></button>
			<button style="display: none" class="zoomvd" type="button" data-state="-">phong to</button>
			<!-- <select class="listsub">
			</select> -->
		    <div class="listsubnewdiv" style="display: inline-block;">
		        <label for="listsubnew">chọn sub</label>
		        <select class="listsub" multiple>
		        <!--     <option value="ti">TiengViet</option>
		            <option value="ja">Japanese</option>
		            <option value="hi">Hiragana</option>
		            <option value="ka">Katakana</option>
		            <option value="ro">Romaji</option> -->
		        </select>
		    </div>
			<select class="fontsizesub">
				<option value="5">rất nhỏ</option>
				<option value="4.5">nhỏ vừa</option>
				<option selected="selected" value="4">nhỏ</option>
				<option value="3.5">bình thường</option>
				<option value="3">lớn</option>
				<option value="2.5">lớn vừa</option>
				<option value="2">rất lớn</option>
				<option value="1.5">rất lớn lớn</option>
			</select>
			<select class="colorsub">
				<option value="white">white</option>
				<option value="black">black</option>
				<option value="yellow">yellow</option>
				<option value="red">red</option>
			</select>
		    <button class='qtyminus'>-sub</button>
			<input class="timelatesub" readonly="readonly" type="text" value="0" style="width:30px" />
		    <button class='qtyplus'>+sub</button>
		</div>
	</div>
	<div id="parentdivsub" style="height: 400px; overflow: scroll; width: 600px">
		
	</div>


	<style type="text/css">
		#parentdivsub div {
			border: 1px solid black;
		}
		#parentdivsub div.selected {
			background-color: red;
		}
		#parentdivsub>div>span:first-of-type {
			display: inline-block;
			height: 20px;
			width: 50px;
			border: 1px solid black;
		}
	</style>
	<script src="js/video-player.js"></script>
	<script type="text/javascript">
	    $(function(){
	        $('.listsubnewdiv .listsub').val(["ja"]);
	        $('.listsubnewdiv .listsub').multiSelect();
	    });
    </script>
</body>
</html>