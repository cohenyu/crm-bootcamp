<?php

require_once('controller.php');


class projects extends controller
{

    public $model_cls = "projects";
    public function __construct()
    {
        parent::__construct();
    }


    public function addProject()
    {
        $result= $this->model->addProject($this->getPostJsonData());
        $this->response = $result;
        return $this->response;
    }

    public function getAllProjects()
    {
        $params = $this->getPostJsonData();
        $data = [
            'account' => $this->account_id,
            'user' => $params->user ? $this->user_id : null,
        ];
        if(!empty($params->client)){
            $data['client'] = $params->client;
        }

        $result= $this->model->getAllProjects($data);
        $this->response = $result;
        return $this->response;
    }

    public function updateProject()
    {
        $params = $this->getPostJsonData();
        $data = [
            'account' => $this->account_id,
            'user' => $this->user_id,
        ];
        $result= $this->model->updateProject($data, $params);
        if($result == -1){
            $this->response->valid = false;
            $this->response->serverError = "serverError";
        }
        else {
            $this->response->valid = true;
            $this->response->affectedRows = $result;
        }
        return $this->response;
    }

}
