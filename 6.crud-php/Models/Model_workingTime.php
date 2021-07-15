<?php

require_once("Model.php");
class Model_workingTime extends Model
{
    public $table = "working_time";
    public $account_id;

    public function __construct()
    {
        parent::__construct();
    }

    public function addWorkingTime($userId, $data)
    {

        $queryData = [
            'project_id' => $data->projectId,
            'user_id' => $userId,
            'start_time' => 'NOW()',
        ];
        return $this->insertItem($queryData);
    }


    public function getWorkingTimes($params)
    {   
        $queryData = [
            "cols" => [
                '*',
            ],
            "where" => [
                "project_id" => $params->projectId,
            ], 
        ];
        
        return $this->getAll($queryData); 
    }

    public function getWorkingTotal($params)
    {   
        $queryData = [
            "cols" => [
                'sum(TIMESTAMPDIFF(MINUTE, start_time, stop_time)) as total'
            ],
            "where" => [
                "project_id" => $params->projectId,
            ], 
        ];
        return $this->getAll($queryData)[0]["total"]; 
    }

    public function updateWorkingTime($params)
    {
        $queryData = [
            "set" => $params->set,
            "where" => [
                "work_id" => $params->workId,
            ],
        ];
        return $this->updateItem($queryData);
    }
}
