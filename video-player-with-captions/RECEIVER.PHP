<?php
	$input = file_get_contents('php://input');
	$stdin = file_get_contents('php://stdin');

	print "FILES: ";
	print_r($_FILES);
	
	print("<br>POST: ");
	print_r($_POST);
	
	print("<br>input: ".$input);
	print("<br>stdin: ".$stdin);
?>