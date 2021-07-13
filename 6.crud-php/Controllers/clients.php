<?php

require_once('controller.php');


class clients extends controller
{

    public $model_cls = "clients";
    public function __construct()
    {
        parent::__construct();
    }


    public function addClient()
    {
        $data = $this->getPostJsonData();
        $this->response = $this->model->addClient($data->name, $this->account_id , $data->mail, $data->phone);
        return $this->response;
    }

    public function getAllClients()
    {
        $data = $this->getPostJsonData();
        $result= $this->model->getAllClients($data->input, $data->limit);
        $this->response = $result;
        return $this->response;
    }

    public function getClient()
    {
        $data = $this->getPostJsonData();
        $result= $this->model->getClient($data->clientId);
        $this->response = $result ? $result[0] : false;
        return $this->response;
    }

}
