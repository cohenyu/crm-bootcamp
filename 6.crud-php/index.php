<?php 
DEFINE('BASE_PATH',__DIR__);
ini_set('html_errors', 0);
ini_set("xdebug.overload_var_dump", "off");//Disable XDEBUG pretty error
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

$data = array();

try 
{
        if(isset($_GET["cls"]) && isset($_GET["method"]))
        {
            $method = $_GET["method"];
            $cls = $_GET["cls"];
            $key = $_GET["key"] ?? null;
            require_once(__DIR__."/Controllers/$cls.php");
            $instance = new $cls();
            $response = $instance->$method($key);
            exit(json_encode($response));
        }
        else 
        {
            throw new Exception("Invalid Params");
        }

} 
catch(Exception $e) 
{
    exit(json_encode([
        "error"=>"something went wrong"
    ]));
}
