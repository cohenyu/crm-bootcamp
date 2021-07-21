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
        $result= $this->model->addWorkingTime($this->user_id, $this->getPostJsonData()->data);
        $this->response = $result;
        return $this->response;
    }

    public function isWorking()
    {
        $result= $this->model->isWorking($this->user_id);   
        $this->response = $result;
        return $this->response;
    }

    public function getWorkingDetails()
    {

        $total = $this->model->getWorkingTotal($this->getPostJsonData()->data);
        $works = $this->model->getWorkingTimes($this->getPostJsonData()->data, 'project');
        if($works){
            $this->response = ["works" => $works, "total" => $total];
            return $this->response;
        } 
        $this->response = false;
        return $this->response;
    }

    public function updateWorkingTime()
    {
        $result= $this->model->updateWorkingTime($this->getPostJsonData()->data);
        $this->response = $result;
        return $this->response;
    }

    public function exportWorkingTimeToCsv()
    {
        $result= $this->model->exportWorkingTimeToCsv($this->getPostJsonData()->data);   
        $this->response = $result;
        return $this->response;
    }


}
