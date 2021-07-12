<?php

require_once("Model.php");

class Model_clients extends Model
{
    public $table = "clients";
    public $account_id = 1;
    
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

    public function getAllClients($input)
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
        return $this->getAll($queryData, true); 
    }
}
