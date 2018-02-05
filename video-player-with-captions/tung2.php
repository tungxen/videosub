
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<style>
#div1 {
    width: 200px;
    height: 100px;
    margin: 10px;
    padding: 10px;
    border: 1px solid black;
}
</style>
<?php
$tung =  fopen('php://stdin','r') or die('chet');
var_dump($tung);
// define('STDIN', fopen( 'php://stdin', 'r' ));
$entityBody = file_get_contents('php://input');
$info = stream_get_contents($tung);
var_dump($info);


?>
<form action="" method="POST" enctype="multipart/form-data">
  <input type="text" name="hovaten" />
  <input id="tung" type="file" name="pic" >
  <input type="submit">
</form>
<input type="button" value= "click" onclick="fn()">
<script>
 function fn(){
    console.log($('#tung')[0].files);

    var js_obj = {plugin: 'jquery-json', version: 2.3};

    var encoded = JSON.stringify( js_obj );

var data= encoded


    $.ajax({
  type: "POST",
  data: data,
  contentType: "multipart/form-data",
  success: function(data){
  }

});

    }
</script>