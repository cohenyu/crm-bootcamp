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
        // move_uploaded_file($_FILES["newFile"]["tmp_name"], "imgs/" . $_FILES["newFile"]["name"]);
        $this->response = $this->model->saveImg();
        return $this->response;
    }

    public function addImg(){
        $data = $this->getPostJsonData();
        $this->response = $this->model->addImg($data->img_url, $data->clientId, $data->projectId);
        return $this->response;
    }

    public function getImgs(){
        $data = $this->getPostJsonData();
        $this->response = $this->model->getImgs($data->projectId);
        return $this->response;
    }

}
