<?php

require_once('controller.php');


class tasks extends controller
{

    public $model_cls = "tasks";
    public function __construct()
    {
        parent::__construct();
    }


    public function addTask()
    {
        $data = $this->getPostJsonData();
        $this->response = $this->model->addTask($this->user_id, $data->projectId, $data->description);
        return $this->response;
    }

    public function getAllTasks()
    {
        $data = $this->getPostJsonData();
        $result= $this->model->getAllClients($data);
        $this->response = $result;
        return $this->response;
    }

    public function updateTask()
    {
        $data = $this->getPostJsonData();
        $this->response = $this->model->updateTask($data);
        return $this->response;
        
    }

    public function deleteTask(){
        $data = $this->getPostJsonData();
        $this->response = $this->model->deleteTask($data->taskId);
        return $this->response;
    }
}
