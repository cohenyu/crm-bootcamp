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

    public function isWorking($userId){
        $queryData = [
            "specialCondition" => "user_id = $userId AND stop_time is NULL"
        ];
        
        return $this->getAll($queryData, true); 
    }

    public function getWorkingTimes($params, $mode)
    {   
        $queryData = [
            "cols" => $mode === 'project' ? ['*'] : ['start_time', 'stop_time'],
            "where" => $mode === 'project' ? ["project_id" => $params->projectId] : ["user_id" =>$params->userId], 
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

    public function exportWorkingTimeToCsv($params)
    {
        $q = "SELECT start_time, stop_time FROM $this->table WHERE user_id = '$params->userId';";
        $result = $this->getDB()->query($q);
        if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        $csv[] = ["start working time", 'stop working time'];
        $result->data_seek(0);
        //SET THE CSV BODY LINES
            while ($data = $result->fetch_assoc()) {
                $csv[] = array_values($data);
            }
            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="myCSV.csv";');
            $f = fopen('php://output', 'w');
            foreach ($csv as $line) {
                fputcsv($f, $line, ',');
            }
            fpassthru($f);
            exit;
            
        } else {
            // TODO return empty csv file
            return false;
        }
    }
}
