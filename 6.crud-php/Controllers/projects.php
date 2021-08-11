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
        $result= $this->model->addProject($this->getPostJsonData()->data);
        $this->response = $result;
        return $this->response;
    }

    public function getAllProjects()
    {
        $params = $this->getPostJsonData()->data;
        // $requried_fields = ["desc", "name" .. ]
        // $this->validate($requried_fields, $params);
        $data = [
            'account' => $this->account_id,
            'user' => $params->user ? $this->user_id : null,
        ];
        if(!empty($params->client)){
            $data['client'] = $params->client;
        }
  
        if(!empty($params->limit)){
            $data["limit"] = $params->limit;
        }

        $result= $this->model->getAllProjects($data);
        $this->response = $result;
        return $this->response;
    }

    public function updateProject()
    {
        $params = $this->getPostJsonData()->data;
        
        $data = [
            'account' => $this->account_id,
        ];

        $user = $params->user ?? false;
        if($user){
            $data['user'] = $this->user_id;
        }
        $result= $this->model->updateProject($data, $params);
        $this->response = $result;
        return $this->response;
    }

    public function getProject()
    {
        $params = $this->getPostJsonData()->data;
        if(!empty($params->projectId)){
            $data = [
                'projectId' => $params->projectId
             ];
            $result= $this->model->getAllProjects($data);
            if($result){
                $this->response = $result[0];
                return $this->response;
            } 
        }
        $this->response = false;
        return $this->response;
    }

}