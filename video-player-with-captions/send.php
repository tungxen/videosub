<!DOCTYPE html>
<html lang="en">
<head>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-33848682-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-33848682-1');
</script>

<meta charset="utf-8">
<meta name="description" content="Simplest possible examples of HTML, CSS and JavaScript.">
<meta name="author" content="//samdutton.com">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta itemprop="name" content="simpl.info: simplest possible examples of HTML, CSS and JavaScript">
<meta itemprop="image" content="/images/icons/icon192.png">
<meta id="theme-color" name="theme-color" content="#fff">

<link rel="icon" href="/images/icons/icon192.jpg">

<base target="_blank">


<title>RTCDataChannel</title>

<link rel="stylesheet" href="../css/main.css">

<style>
  button {
    margin: 0 1em 0 0;
    width: 5.2em;
  }
  div#buttons {
    margin: 0 0 1.7em 0;
  }
  div#send {
    float: left;
    margin: 0 3em 1em 0;
  }
  div#sendReceive {
    margin: 0 0 1em 0;
  }
  h1 {
    margin: 0 0 1em 0;
  }
  h2 {
    margin: 0 0 0.5em 0;
  }
  textarea {
    color: #444;
    font-family: 'Courier New', monospace;
    font-size: 1em;
    height: 7.0em;
    padding: 0.5em;
  }
</style>

</head>

<body>

  <div id="container">

    <div id="highlight">
      <p>New codelab: <a href="https://codelabs.developers.google.com/codelabs/webrtc-web">Realtime communication with WebRTC</a></p>
    </div>

    <h1><a href="../index.html" title="simpl.info home page">simpl.info</a> RTCDataChannel</h1>
    <div id="buttons">
      <button id="startButton">Start</button>
      <button id="sendButton">Send</button>
      <button id="closeButton">Stop</button>
    </div>

    <div id="sendReceive">
      <div id="send">
        <h2>Send</h2>
        <textarea id="dataChannelSend" disabled placeholder="Press Start, enter some text, then press Send."></textarea>
      </div>
      <div id="receive">
        <h2>Receive</h2>
        <textarea id="dataChannelReceive" disabled></textarea>
      </div>
    </div>

    <p>View the console to see logging.</p>

    <p>The <code>RTCPeerConnection</code> objects <code>localConnection</code> and <code>remoteConnection</code> are in global scope, so you can inspect them in the console as well.</p>
    <p>Code in this example used by kind permission of Vikas Marwaha.</p>
    <p>For more information about PeerConnection, see <a href="https://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-rtcdatachannel" title="RTCDataChannel section of HTML5 Rocks article about WebRTC">Getting Started With WebRTC</a>.</p>

    <script src="js/main.js"></script>

    <a href="https://github.com/samdutton/simpl/blob/gh-pages/rtcdatachannel" title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>

  </div>


</body>
</html>