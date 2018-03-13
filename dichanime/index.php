<?php
// $_ENV["TUNG"] = 'aa';
putenv("GOOGLE_APPLICATION_CREDENTIALS=D:/working/videosub/dichanime/dichanime-62c21e438fd0.json");
# Includes the autoloader for libraries installed with composer
require __DIR__ . '/vendor/autoload.php';

# Imports the Google Cloud client library
use Google\Cloud\Translate\TranslateClient;

# Your Google Cloud Platform project ID
$projectId = 'dichanime-1519875288255';

# Instantiates a client
$translate = new TranslateClient([
    'projectId' => $projectId
]);

# The text to translate
$text = 'ご迷惑をおかけしますがよろしくお願い致します';
# The target language
$target = 'en';

# Translates some text into Russian
$translation = $translate->translate($text, [
    'target' => $target
]);

var_dump($translation);
// echo 'Text: ' . $text . '
// Translation: ' . $translation['text'];