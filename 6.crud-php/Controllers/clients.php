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
        $data = $this->getPostJsonData()->data;
        $this->response = $this->model->addClient($data->name, $data->mail, $data->phone);
        return $this->response;
    }

    public function getAllClients()
    {
        $data = $this->getPostJsonData()->data;
        $result= $this->model->getAllClients($data->input ?? '', $data->limit ?? -1);
        $this->response = $result;
        return $this->response;
    }

    public function getClient()
    {
        $data = $this->getPostJsonData()->data;
        $result= $this->model->getClient($data->clientId);
        $this->response = $result ? $result[0] : false;
        return $this->response;
    }

}
