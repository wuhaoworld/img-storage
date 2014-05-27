<?php
error_reporting(-1);


date_default_timezone_set('Asia/Shanghai');
$content = file_get_contents("php://input");
$content = base64_decode($content);

$time = time();
$salt = rand(100,999);
if(isset($_GET['name']) && $_GET['name'] != ""){
	$file_name = urldecode($_GET['name']);	
}else{
	$file_name = $time.$salt.".jpg";	
}

$folder = "upload/".date("Y-m-d", $time);
$server_name = $_SERVER['SERVER_NAME'];

if(!file_exists($folder)){
	mkdir($folder);
}


$file_path = $folder."/".$file_name;
$img_url = "http://img-storage.qiniudn.com/" . $file_path;

$result = file_put_contents($file_path, $content);

if(!$result){
	header('Content-type: application/json');
    echo '{"status":"error"}';
    die();
}
// 转存到七牛

require_once("qiniu/io.php");
require_once("qiniu/rs.php");

$bucket = "img-storage";
$key1 = $file_path;
$file = $file_path;
$accessKey = '5s4ORNUkz6wtUmPqdIUwUxXoXSwzZbf4v-cXpou4';
$secretKey = 'k0UTJJE-lLLm6OyG38DhxcSwkbHakMOM9K704kxx';

Qiniu_SetKeys($accessKey, $secretKey);
$putPolicy = new Qiniu_RS_PutPolicy($bucket);
$upToken = $putPolicy->Token(null);
$putExtra = new Qiniu_PutExtra();
$putExtra->Crc32 = 1;
list($ret, $err) = Qiniu_PutFile($upToken, $key1, $file, $putExtra);
if ($err !== null) {
    var_dump($err);
} else {
    // var_dump($ret);
    header('Content-type: application/json');
    echo '{"status":"success","url":"' . $img_url . '"}';
    die();
}