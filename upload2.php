<?php 
error_reporting(-1);
date_default_timezone_set('Asia/Shanghai');
$content = file_get_contents("php://input");
$content = base64_decode($content);

$time = time();
$salt = rand(100,999);
$file_name = $time.$salt;
$folder = "images/".date("Y-m-d", $time);
$server_name = $_SERVER['SERVER_NAME'];

if(!file_exists ($folder)){
	mkdir($folder);
}


$file_path = $folder."/".$file_name.".jpg";
$img_url = "http://".$server_name.substr($_SERVER['PHP_SELF'], 0, -10) . $file_path;

file_put_contents($file_path, $content);

$conn = mysql_connect("localhost","root","root");
if (!$conn) {
	die('数据库连接错误');
}
mysql_select_db("img_storage",$conn);
$sql = "insert into imgs (path,time) values ('" . $file_path . "', " . $time . ")";
$result = mysql_query($sql,$conn);
if(!$result){
	header('Content-type: application/json');
    echo '{"status":"error"}';
    die();
}else{
	header('Content-type: application/json');
    echo '{"status":"success","url":"' . $img_url . '"}';
    die();
}