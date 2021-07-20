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

}
