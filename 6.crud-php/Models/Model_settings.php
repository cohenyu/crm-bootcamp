<?php

require_once("Model.php");

class Model_settings extends Model
{
    public $table = "settings";
    
    public function __construct()
    {
        parent::__construct();
    }


    public function getSettings($accountId){

        $queryData = [
            "where" => [
                "account_id" => $accountId,
            ]
        ];

        return $this->getAll($queryData, true); 
    }


}
