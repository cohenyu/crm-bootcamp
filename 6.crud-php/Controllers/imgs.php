<?php

require_once('controller.php');


class imgs extends controller
{

    public $model_cls = "imgs";
    public function __construct()
    {
        parent::__construct();
    }


    public function saveImg()
    {
        $this->response = $this->model->saveImg();
        return $this->response;
    }

    public function addImg(){
        $data = $this->getPostJsonData()->data;
        $this->response = $this->model->addImg($data->img_url, $data->clientId, $data->projectId);
        return $this->response;
    }

    public function getImgs(){
        $data = $this->getPostJsonData()->data;
        $this->response = $this->model->getImgs($data->projectId);
        return $this->response;
    }

}
