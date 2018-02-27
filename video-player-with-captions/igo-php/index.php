<?php

require_once 'lib/Igo.php';

$igo = new Igo(dirname(__FILE__) . "/lib/ipadic");
$text = "漢字は、古代中国に発祥を持つ文字。特に中国語を表記するための文字である。";

$result = $igo->parse($text);
$str = "";
file_put_contents('tung', print_r($result,true));
foreach($result as $value){
     $feature = explode(",", $value['feature']);
     $str .= isset($feature[7]) ? $feature[7] : $value['surface'];
    // break;
}
file_put_contents('tung1', print_r(mb_convert_kana($str, "c", "utf-8"),true));
file_put_contents('tung2', print_r($str,true));
echo mb_convert_kana($str, "c", "utf-8");