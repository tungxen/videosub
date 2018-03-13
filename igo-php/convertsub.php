<?php
class ConvertSub {
    public static function convert()
    {
		include('./editsubtitles/phpEditSubtitles.php');
		$st = new phpEditSubtitles();
		$kata = new phpEditSubtitles();

		$st->setFile('Violet Evergarden - 01.jpn.srt');
		$st->setType('vtt');
		$st->readFile();
		$st->saveFile('newfile');

		// get array of subtitles
		$subtitles = $st->getSubtitles();


		require_once 'lib/Igo.php';
		$igo = new Igo(dirname(__FILE__) . "/lib/ipadic");
		$arraykata = $subtitles;
		foreach ($subtitles as $key => $items) {
			$arraykata[$key] = $items;
			$subtitlelist = explode(' ', $items['subtitle']);
			$str = "";
			$strhira = "";
			foreach ($subtitlelist as $v) {
			    $result = $igo->parse($v);
			    $sub = '';
			    foreach($result as $value){
			         $feature = explode(",", $value['feature']);
			         $sub .= isset($feature[7]) ? $feature[7] : $value['surface'];
			    }
			    $str .= $sub;
				$strhira .= mb_convert_kana($sub, "c", "utf-8");
			    $str .= " ";
				$strhira .= " ";
			}
		    $arraykata[$key]['subtitle'] = $str;
		    $items['subtitle'] = $strhira;
		    $subtitles[$key] = $items;
		}
		$st->setSubtitles($subtitles);
		$st->saveFile('newfile-hira');
		$st->setSubtitles($arraykata);
		$st->saveFile('newfile-kata');
    }
}
ConvertSub::convert();