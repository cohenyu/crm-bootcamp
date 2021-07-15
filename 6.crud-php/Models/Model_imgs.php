<?php

require_once("Model.php");

class Model_imgs extends Model
{
    public $table = "imgs";
    
    public function __construct()
    {
        parent::__construct();
    }


    public function saveImg() 
    {
        var_dump($_FILES);
        exit();
        move_uploaded_file($_FILES["newFile"]["tmp_name"], "imgs/" . $_FILES["newFile"]["name"]);
        return true;
    }

    public function addImg($url, $clientId, $projectId)
    {
        $queryData = [
            'img_url' => $url,
            'account_id' => $this->account_id,
            'client_id' => $clientId,
            'project_id' => $projectId
        ];
        return $this->insertItem($queryData);
    }

    public function getImgs($projectId){


        $queryData = [
            "where" => [
                "project_id" => $projectId,
            ]
        ];

        return $this->getAll($queryData, true); 
    }

}
