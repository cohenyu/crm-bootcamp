<?php

require_once("Model.php");

class Model_clients extends Model
{
    public $table = "clients";
    
    public function __construct()
    {
        parent::__construct();
    }

    public function addClient($name, $mail, $phone)
    {
        $queryData = [
            'client_name' => $name,
            'account_id' => $this->account_id,
            'client_mail' => $mail,
            'client_phone' => $phone
        ];
        return $this->insertItem($queryData);
    }

    public function getAllClients($input, $limit)
    {   
        if(empty($input)){
            $queryData = [
                "where" => [
                    "account_id" => $this->account_id,
                ]
            ];
        } else {
            $queryData = [
                "specialCondition" => "account_id=$this->account_id AND client_name like '$input%'"
            ];
        }
        $limit = intval($limit) ?? -1;
        if($limit != -1){
            $queryData["limit"] = $limit;
        }

        return $this->getAll($queryData, true); 
    }

    
    public function getClient($clientId=-1)
    {   
        if($clientId == -1){
            return false;
        } 

        $queryData = [
            "where" => [
                // "account_id" => $this->account_id,
                "client_id" => $clientId
            ]
        ];

        return $this->getAll($queryData, true); 
    }
}
