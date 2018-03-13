<?php
ini_set('memory_limit', '-1');
function set_bit_on_byte($bit_index, $current_bit, $byte){
		if($byte < 0 || $byte > 255){
			exit();
		}
		if($current_bit != 0 && $current_bit != 1){
			exit();
		}
		if(($bit_index % 8) == 0)
			return (0xFE & $byte) + ($current_bit * 0x01);
		else if(($bit_index % 8) == 1)
			return (0xFD & $byte) + ($current_bit * 0x02);
		else if(($bit_index % 8) == 2)
			return (0xFB & $byte) + ($current_bit * 0x04);
		else if(($bit_index % 8) == 3)
			return (0xF7 & $byte) + ($current_bit * 0x08);
		else if(($bit_index % 8) == 4)
			return (0xEF & $byte) + ($current_bit * 0x10);
		else if(($bit_index % 8) == 5)
			return (0xDF & $byte) + ($current_bit * 0x20);
		else if(($bit_index % 8) == 6)
			return (0xBF & $byte) + ($current_bit * 0x40);
		else if(($bit_index % 8) == 7)
			return (0x7F & $byte) + ($current_bit * 0x80);
		else
			exit();
	}
	function get_bit_on_byte($bit_index, $byte){
		if(($bit_index % 8) == 0)
			return ($byte & 0x01) == 0?0:1;
		else if(($bit_index % 8) == 1)
			return ($byte & 0x02) == 0?0:1;
		else if(($bit_index % 8) == 2)
			return ($byte & 0x04) == 0?0:1;
		else if(($bit_index % 8) == 3)
			return ($byte & 0x08) == 0?0:1;
		else if(($bit_index % 8) == 4)
			return ($byte & 0x10) == 0?0:1;
		else if(($bit_index % 8) == 5)
			return ($byte & 0x20) == 0?0:1;
		else if(($bit_index % 8) == 6)
			return ($byte & 0x40) == 0?0:1;
		else if(($bit_index % 8) == 7)
			return ($byte & 0x80) == 0?0:1;
		else
			exit();
	}

	function read_stego($filename){
		$im = imagecreatefrompng($filename);
		if($im === false){
			echo "Error: bad image format ".$filename.PHP_EOL;
			exit();
		}
		$a = getimagesize($filename);
		$code_height_start = 0;
		$code_height_end = $a[0];
		$code_width_start = 0;
		$code_width_end = $a[1];

		$bit_ary = array();
		for ($j=$code_width_start; $j<$code_width_end; $j++){
			for ($i=$code_height_start; $i<$code_height_end; $i++){
				$rgb = imagecolorat($im, $i, $j);
				$r = ($rgb >> 16) & 0x01;
				$g = ($rgb >> 8) & 0x01;
				$b = $rgb & 0x01;
				$bit_ary[] = $r;
				$bit_ary[] = $g;
				$bit_ary[] = $b;
			}
		}
		// $bit_ary is now the $stack input string, just in a { 1, 0, 0, 1, 0, 1, 1, 1, ... } formated array
		$n = intval(floor(count($bit_ary)/8)); //throw out last partial byte
		$stack = '';
		for($i=0; $i < $n; $i++){
			$current_byte = 0;
			$current_byte = set_bit_on_byte(0, $bit_ary[$i*8], $current_byte);
			$current_byte = set_bit_on_byte(1, $bit_ary[$i*8+1], $current_byte);
			$current_byte = set_bit_on_byte(2, $bit_ary[$i*8+2], $current_byte);
			$current_byte = set_bit_on_byte(3, $bit_ary[$i*8+3], $current_byte);
			$current_byte = set_bit_on_byte(4, $bit_ary[$i*8+4], $current_byte);
			$current_byte = set_bit_on_byte(5, $bit_ary[$i*8+5], $current_byte);
			$current_byte = set_bit_on_byte(6, $bit_ary[$i*8+6], $current_byte);
			$current_byte = set_bit_on_byte(7, $bit_ary[$i*8+7], $current_byte);
			$stack .= chr($current_byte);
		}
		imagedestroy($im);
		return $stack;
	}
	function write_stego($input_filename, $output_filename, $str){
		$im = imagecreatefrompng($input_filename);
		$a = getimagesize($input_filename, $imageinfo);

		$code_height_start = 0;
		$code_height_end = $a[0];
		$code_width_start = 0;
		$code_width_end = $a[1];
		$im2 = imagecreatetruecolor($code_height_end, $code_width_end);

		$bit_index = 0;
		$current_byte = 0;
		$stack = $str;
		$max_num_bits = ($code_height_end - $code_height_start) * ($code_width_end - $code_width_start) * 3;
		$max_num_bytes = floor($max_num_bits/8);
		$n = strlen($str);
		$bit_ary = array();
		if( $n > $max_num_bytes ){
			imagedestroy($im);
			imagedestroy($im2);
			echo "Error: input string too long, limit input string to ".$max_num_bytes." for the image: ".$input_filename.PHP_EOL;
			exit();
		}
		for($i=0; $i < $n; $i++){
			$current_char = substr($str, $i, 1);
			$bit_ary[] = get_bit_on_byte(0, ord($current_char));
			$bit_ary[] = get_bit_on_byte(1, ord($current_char));
			$bit_ary[] = get_bit_on_byte(2, ord($current_char));
			$bit_ary[] = get_bit_on_byte(3, ord($current_char));
			$bit_ary[] = get_bit_on_byte(4, ord($current_char));
			$bit_ary[] = get_bit_on_byte(5, ord($current_char));
			$bit_ary[] = get_bit_on_byte(6, ord($current_char));
			$bit_ary[] = get_bit_on_byte(7, ord($current_char));
		} // $bit_ary is now the $str input string in a { 1, 0, 0, 1, 0, 1, 1, 1, ... } format array
		$bit_index = 0;
		for ($j=$code_width_start; $j<$code_width_end; $j++){
			for ($i=$code_height_start; $i<$code_height_end; $i++){
				$rgb = imagecolorat($im, $i, $j);
				$current_bit = 0;
				if($bit_index < count($bit_ary)){
					$current_bit = $bit_ary[$bit_index];
				}
				$r = (($rgb >> 16) & 0xFE) + $current_bit;
				$bit_index++;
				$current_bit = 0;
				if($bit_index < count($bit_ary)){
					$current_bit = $bit_ary[$bit_index];
				}
				$g = (($rgb >> 8) & 0xFE) + $current_bit;
				$bit_index++;
				$current_bit = 0;
				if($bit_index < count($bit_ary)){
					$current_bit = $bit_ary[$bit_index];
				}
				$b = ($rgb & 0xFE) + $current_bit;
				$bit_index++;
				imagesetpixel($im2, $i, $j, imagecolorallocate($im2, $r, $g, $b));
			}
		}
		imagepng($im2, $output_filename);
		imagedestroy($im);
		imagedestroy($im2);
	}

$input_filename = './cat.png';
$output_filename = './cat_new.png';
$string = "tungtungxen";
	//write_stego($input_filename, $output_filename, $string);
echo read_stego($output_filename);