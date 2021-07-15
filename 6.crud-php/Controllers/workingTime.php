<?php

require_once('controller.php');


class workingTime extends controller
{

    public $model_cls = "workingTime";
    public function __construct()
    {
        parent::__construct();
    }


    public function addWorkingTime()
    {
        $result= $this->model->addWorkingTime($this->user_id, $this->getPostJsonData());
        $this->response = $result;
        return $this->response;
    }

    public function getAllWorkingTime()
    {

    }

    public function getWorkingDetails()
    {

        $total = $this->model->getWorkingTotal($this->getPostJsonData());
        $works = $this->model->getWorkingTimes($this->getPostJsonData());
        if($works){
            $this->response = ["works" => $works, "total" => $total];
            return $this->response;
        } 
        $this->response = false;
        return $this->response;
    }

    public function updateWorkingTime()
    {
        $result= $this->model->updateWorkingTime($this->getPostJsonData());
        $this->response = $result;
        return $this->response;
    }


}
