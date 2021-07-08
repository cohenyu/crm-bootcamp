<?php


require_once("controller.php");

class test extends controller
{

    public $model_cls = "test";

    public function __construct()
    {
        parent::__construct();
    }

    public function test($key)
    {
        $this->response = $this->model->getFakeData();
        $this->response["my_key"] = $key;
        $this->response["post"] = $_POST;
        return $this->response;
    }
}
