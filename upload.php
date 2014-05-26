<?php
error_reporting(-1);
require_once('upyun.class.php');
$upyun = new UpYun('img-storage', 'ratwu', 'hello1234');
date_default_timezone_set('Asia/Shanghai');
$content = file_get_contents("php://input");
$content = base64_decode($content);

$time = time();
$salt = rand(100,999);
$file_name = $time.$salt;
$folder = "images/".date("Y-m-d", $time);
$server_name = $_SERVER['SERVER_NAME'];

if(!file_exists($folder)){
	mkdir($folder);
}


$file_path = $folder."/".$file_name.".jpg";
$img_url = "http://img-storage.b0.upaiyun.com/" . $file_path;

$result = file_put_contents($file_path, $content);

$fh = fopen($file_path, 'r');
$upyun->writeFile("/".$file_path, $fh, True);
fclose($fh);

if(!$result){
	header('Content-type: application/json');
    echo '{"status":"error"}';
    die();
}else{
	header('Content-type: application/json');
    echo '{"status":"success","url":"' . $img_url . '"}';
    die();
}