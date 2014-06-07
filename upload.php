<?php
date_default_timezone_set('Asia/Shanghai');

$bucket    = isset($_COOKIE['bucket']) ? $_COOKIE['bucket'] : "";
$accessKey = isset($_COOKIE['ak']) ? $_COOKIE['ak'] : "";
$secretKey = isset($_COOKIE['sk']) ? $_COOKIE['sk'] : "";

if(isset($_GET['a']) && $_GET['a']="test"){
    $file_path = "file.jpg";
}else{
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
    

    $result = file_put_contents($file_path, $content);

    if(!$result){
        header('Content-type: application/json');
        echo '{"status":"error"}';
        die();
    }
}

// 转存到七牛
require_once("qiniu/io.php");
require_once("qiniu/rs.php");

$key1 = $file_path;
$file = $file_path;

if($bucket=="" && $accessKey=="" && $secretKey==""){
    $bucket = "img-storage";
    $accessKey = '5s4ORNUkz6wtUmPqdIUwUxXoXSwzZbf4v-cXpou4';
    $secretKey = 'k0UTJJE-lLLm6OyG38DhxcSwkbHakMOM9K704kxx'; 
}

$img_url = "http://" . $bucket . ".qiniudn.com/" . $file_path;

Qiniu_SetKeys($accessKey, $secretKey);
$putPolicy = new Qiniu_RS_PutPolicy($bucket);
$upToken = $putPolicy->Token(null);
$putExtra = new Qiniu_PutExtra();
$putExtra->Crc32 = 1;
list($ret, $err) = Qiniu_PutFile($upToken, $key1, $file, $putExtra);

if ($err !== null) {
    // var_dump($err);
    header('Content-type: application/json');
    echo '{"status":"error"}';
    die();
} else {
    header('Content-type: application/json');
    echo '{"status":"success","url":"' . $img_url . '"}';
    die();
}