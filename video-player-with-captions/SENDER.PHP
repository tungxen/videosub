<?php
	// when 'true' multipart data is NOT parsed, but is present at php://stdio
	// when 'false' multipart is parsed into $_FILES and $_POST
	$chunked = false;

	$body1 =
	"--AaB03x\r\n".
	"Content-Disposition: form-data; name=\"forPOST\"\r\n".
	"\r\n".
	"1257880790\r\n".
	"--AaB03x\r\n";
	
	$body2 =
	"Content-Disposition: form-data; name=\"test_file\"; filename=\"test.file\"\r\n".
	"Content-Type: application/octet-stream\r\n".
	"\r\n".
	"binary data\r\n".
	"--AaB03x--";
	
	// change the POST to the location of your "receiver.php"
	$header = 
	"POST /videosub/video-player-with-captions/receiver.php HTTP/1.1\r\n".
	"Connection: close\r\n".
	"Host: ".$_SERVER['HTTP_HOST']."\r\n".
	"Content-Type: multipart/form-data, boundary=AaB03x\r\n";
	
	if ($chunked){
		$body = dechex(strlen($body1))."\r\n".$body1."\r\n".
				dechex(strlen($body2))."\r\n".$body2."\r\n0\r\n\r\n";	
		$header .= "Transfer-Encoding: chunked\r\n";
	}
	else{
		$body = $body1 . $body2;
		$header .= 	"Content-Length: ".strlen($body)."\r\n"; 	
	}
	$header .= "\r\n";

	$final = $header . $body;
	print "<pre>".$final."<br><br>tung";
	
	$fp = fsockopen($_SERVER['HTTP_HOST'], 80, $errno, $errstr, 30);
	if (!$fp) {
		echo "$errstr  tung 22 ($errno)<br />\n";
	} 
	else {
		fwrite($fp, $final);
		while (!feof($fp)) {
			print fgets($fp, 128);
		}
		fclose($fp);
	}
	print "</pre>";
?>