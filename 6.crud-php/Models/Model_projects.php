<?php

require_once("Model.php");
require_once("Model_clients.php");
class Model_projects extends Model
{
    public $table = "projects";
    public $clientModel;
    public $account_id;

    public function __construct()
    {
        parent::__construct();
        $this->clientModel = new Model_clients();
    }

    public function addProject($projectDetails)
    {
        $this->clientModel->setAccountId($this->account_id);
        $clientDetails = $projectDetails->client;
        $clientId = intval($clientDetails->clientId ?? -1);
        if($clientId <= 0){
           $clientId = $this->clientModel->addClient($clientDetails->name, $clientDetails->mail, $clientDetails->phone);
        } 

        $queryData = [
            'client_id' => $clientId,
            'account_id' => $this->account_id,
            'item_type' => $projectDetails->type,
            'description' => $projectDetails->description,
            'deadline' => $projectDetails->deadline,
            'project_status' => $projectDetails->status
        ];
        return $this->insertItem($queryData);
    }

    public function getAllProjects($data)
    {   
        $queryData = [
            "cols" => [
                'projects.*',
                'clients.client_name'
            ],
            "where" => [
                "projects.account_id" => $this->account_id,
            ],
            "join" => 'INNER JOIN clients ON clients.client_id=projects.client_id'
        ];
        if(!empty($data['user'])){
            $queryData["where"]["assigned_user_id"] = $data['user'];
        }
        if(!empty($data['client'])){
            $queryData["where"]["clients.client_id"] = $data['client'];
        }
        return $this->getAll($queryData); 
    }

    public function updateProject($authData, $params)
    {
        $params->set->assigned_user_id = $authData["user"];
        $queryData = [
            "set" => $params->set,
            "where" => [
                "project_id" => $params->project_id,
            ],
        ];
        return $this->updateItem($queryData); 
    }
}
