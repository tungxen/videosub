<!DOCTYPE html> 
<html> 
<head>
	<script src="js/jquery-1.12.4.js"></script>
</head>
<body> 

tung
<div id="results"></div>
<script type="text/javascript">
	function handleResponse () {
		alert('tungjson');
	}
</script>
<script src="./tungjson.php?callback=handleResponse&_=1437907666366"></script>
<script type="text/javascript">
	$.ajax({
	  url: './tungjson.php?callback=handleResponse&_=1437907666366',
	  dataType: 'jsonp',
	  success: function (da) {
	  	console.log('tung1');
	  },
	  jsonpCallback: function (sa) {
	  	console.log(sa);
	  }
	});
</script>
</body> 
</html>
