<?php
include('./editsubtitles/phpEditSubtitles.php');

$st = new phpEditSubtitles();

$st->setFile('Violet Evergarden - 01.jpn.srt');
// set output type to vtt (it will convert from srt to vtt type)
$st->setType('vtt');
$st->readFile();

// Edit subtitle on position 23
// IMPORTANT: it will reordenate the time. If the amount of time is smaller than $timeIni or bigger than $timeEnd the request will not be processed
// $order = 23;
// $timeIni = '00:01:10,880';
// $timeEnd = '00:01:18,830';
// $subtitle = 'Edit subtitle';
// $st->editSubtitle($order,$timeIni,$timeEnd,$subtitle);

// remove subtitle on position 25
//$st->deleteSubtitle(25);

// add subtitle on position 25
// IMPORTANT: it will reordenate the time. If the amount of time is smaller than $timeIni or bigger than $timeEnd the request will not be processed
// $order = 25;
// $timeIni = '00:01:31,010';
// $timeEnd = '00:01:32,790';
// $subtitle = 'New subtitle';
// $st->addSubtitle($order,$timeIni,$timeEnd,$subtitle);

// save subtitles in a new file
$st->saveFile('newfile');

// get array of subtitles
$subtitles = $st->getSubtitles();

echo '<pre>';
print_r($subtitles);
echo '</pre>';

require_once 'lib/Igo.php';
$igo = new Igo(dirname(__FILE__) . "/lib/ipadic");
foreach ($subtitles as $key => $items) {
    $result = $igo->parse($items['subtitle']);
    $str = "";
    foreach($result as $value){
         $feature = explode(",", $value['feature']);
         $str .= isset($feature[7]) ? $feature[7] : $value['surface'];
    }
    $items['subtitle'] = mb_convert_kana($str, "c", "utf-8");
    $subtitles[$key] = $items;
}
$st->setSubtitles($subtitles);
$st->saveFile('newfile-hira');