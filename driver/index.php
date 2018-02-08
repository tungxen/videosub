<?php
require_once __DIR__ . '/vendor/autoload.php';


define('APPLICATION_NAME', 'Drive API PHP Quickstart');
define('CREDENTIALS_PATH',  __DIR__ . '/drive-php-quickstart.json');
define('CLIENT_SECRET_PATH', __DIR__ . '/client_id.json');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-php-quickstart.json
define('SCOPES', implode(' ', array(
  Google_Service_Drive::DRIVE,
  Google_Service_Drive::DRIVE_APPDATA,
  Google_Service_Drive::DRIVE_FILE,
  Google_Service_Drive::DRIVE_METADATA,
  Google_Service_Drive::DRIVE_METADATA_READONLY,
  Google_Service_Drive::DRIVE_PHOTOS_READONLY,
  Google_Service_Drive::DRIVE_READONLY,
  Google_Service_Drive::DRIVE_SCRIPTS
)
));

if (php_sapi_name() != 'cli') {
  //throw new Exception('This application must be run on the command line.');
}

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient() {
  $client = new Google_Client();
  $client->setApplicationName(APPLICATION_NAME);
  $client->setScopes(SCOPES);
  $client->setAuthConfig(CLIENT_SECRET_PATH);
  $client->setAccessType('offline');

  // Load previously authorized credentials from a file.
  $credentialsPath = expandHomeDirectory(CREDENTIALS_PATH);
  //var_dump($credentialsPath); die;
  if (file_exists($credentialsPath)) {
    $accessToken = json_decode(file_get_contents($credentialsPath), true);
  } else {
    // Request authorization from the user.
    $authUrl = $client->createAuthUrl();
    printf("Open the following link in your browser:\n%s\n", $authUrl);
    print 'Enter verification code: ';
    $authCode = trim(fgets(STDIN));

    // Exchange authorization code for an access token.
    $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

    // Store the credentials to disk.
    if(!file_exists(dirname($credentialsPath))) {
      mkdir(dirname($credentialsPath), 0700, true);
    }
    file_put_contents($credentialsPath, json_encode($accessToken));
    printf("Credentials saved to %s\n", $credentialsPath);
  }
  $client->setAccessToken($accessToken);

  // Refresh the token if it's expired.
  if ($client->isAccessTokenExpired()) {
    $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
    file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
  }
  return $client;
}

/**
 * Expands the home directory alias '~' to the full path.
 * @param string $path the path to expand.
 * @return string the expanded path.
 */
function expandHomeDirectory($path) {
  $homeDirectory = getenv('HOME');
  if (empty($homeDirectory)) {
    $homeDirectory = getenv('HOMEDRIVE') . getenv('HOMEPATH');
  }
  return str_replace('~', realpath($homeDirectory), $path);
}

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Drive($client);

// Print the names and IDs for up to 10 files.
$optParams = array(
  'pageSize' => 50,
  'fields' => 'nextPageToken, files(id, name)'
);

$fileId = '1EwidAFqYcsok9nrVBKGfC4LoVPGQOaGp';
$fileId = '1vWEuCuG88MYt8m1UK4RPHyEln9oJv5fc';
// $fileMetadata = new Google_Service_Drive_DriveFile(array(
//     'title' => 'Invoices',
//     'mimeType' => 'application/vnd.google-apps.folder'));
//     $file = $service->files->get($fileId);
    // print "dl: " . printFile($file);
// Google_Service_Drive_DriveFile
//printf("Folder ID: %s\n", $file->id);
//var_dump(get_class($service->files));
$file = $service->files->getTung($fileId, array(
    'alt' => 'media'));
    // echo '<br/>';
    // print "Title: " . $file->getName();
    // echo '<br/>';
    // print "Description: " . $file->getDescription();
    // echo '<br/>';
    // print "MIME type: " . $file->getMimeType();
    // echo '<br/>';
//file_put_contents('tung1', print_r($service->files,true));
// $content = $file->getBody();
//$content = $response->getBody();
//file_put_contents('tung1', print_r($service->files,true));
 die;

$results = $service->files->listFiles($optParams);

if (count($results->getFiles()) == 0) {
  print "No files found.\n";
} else {
  print "Files:\n";
  foreach ($results->getFiles() as $file) {
    printf("%s (%s)\n", $file->getName(), $file->getId());
    echo '<br/>';
  }
}