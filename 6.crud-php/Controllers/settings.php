<?php

require_once('controller.php');


class workingTime extends controller
{

    public $model_cls = "settings";
    public function __construct()
    {
        parent::__construct();
    }


    public function getSettings()
    {
        $data = $this->getPostJsonData()->data;
        $result= $this->model->getSettings($data->accountId);
        $this->response = $result;
        return $this->response;
    }

    public function updateSettings()
    {

    }


}
