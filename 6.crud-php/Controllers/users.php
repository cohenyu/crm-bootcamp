<?php

require_once('controller.php');


class users extends controller
{

    public $model_cls = "users";
    public function __construct()
    {
        parent::__construct();
    }


    public function getUsers()
    {
        $users = $this->model->getAllUsers();
        $this->response["users"] = $users;
        return $this->response;
    }

    public function getPostData()
    {
        $this->response["post"] = $_POST;
        return $this->response;
    }

    public function getPostJsonData()
    {
        $json = file_get_contents('php://input');
        // Converts it into a PHP object
        $data = json_decode($json);
        $arr = ["1" => 2];
        $this->response["data"] = $data;
        $this->response["arr"] = $arr;
        $this->response["arr_stringify"] = json_encode($arr);
        return $this->response;
    }

    public function test($key)
    {

        $this->response = $this->model->getFakeData();
        $this->response["my_key"] = $key;
        $this->response["post"] = $_POST;
        return $this->response;
    }
}
