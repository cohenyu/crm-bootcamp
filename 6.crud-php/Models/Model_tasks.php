<?php

require_once("Model.php");

class Model_tasks extends Model
{
    public $table = "tasks";
    
    public function __construct()
    {
        parent::__construct();
    }

    public function addTask($userId, $projectId, $description, $index)
    {
        $queryData = [
            'user_id' => $userId,
            'account_id' => $this->account_id,
            'project_id' => $projectId,
            'description' => $description,
            'task_index' => $index,
        ];
        return $this->insertItem($queryData);
    }

    public function getAllTasks($projectId){


        $queryData = [
            "where" => [
                "project_id" => $projectId,
            ]
        ];

        return $this->getAll($queryData, true); 
    }

    public function updateTask($params){
        $queryData = [
            "set" => $params->set,
            "where" => [
                "task_id" => $params->taskId,
            ],
        ];
        return $this->updateItem($queryData); 
    }

    public function deleteTask($taskId){
        $queryData = [
            "where" => [
                "task_id" => $taskId,
            ],
        ];
        return $this->deleteItem($queryData); 
    }

}
