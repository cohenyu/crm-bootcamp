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
        $fields = $projectDetails->fields;
        $clientId = intval($fields->clientId->value ?? -1);
        if($clientId <= 0){
            $this->clientModel->setAccountId($this->account_id);
           $clientId = $this->clientModel->addClient($fields->name->value, $fields->mail->value, $fields->phone->value);
        } 
        
        if($clientId <= 0){
            return false;
        }
        $queryData = [
            'client_id' => $clientId,
            'account_id' => $this->account_id,
            'item_type' => $fields->type->value,
            'description' => $fields->description->value,
            'deadline' => $fields->deadline->value,
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
