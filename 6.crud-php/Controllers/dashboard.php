<?php

require_once('controller.php');


class dashboard extends controller
{

    public $model_cls = "dashboard";
    public function __construct()
    {
        parent::__construct();
    }


    public function projectCostVsEstimated()
    {
        $this->response = $this->model->projectCostVsEstimated($this->getPostJsonData()->data);
        return $this->response;
    }

    public function getProjectStatusSum(){
        $this->response = $this->model->getProjectStatusSum($this->getPostJsonData()->data);
        return $this->response;
    }

    public function workingHours(){
        $this->response = $this->model->workingHours($this->getPostJsonData()->data);
        return $this->response;
    }

    public function leastRecentlyCreatedProject(){
        $this->response = $this->model->leastRecentlyCreatedProject($this->getPostJsonData()->data);
        return $this->response;
    }

}
