<?php

require_once("Model.php");
require_once("Model_clients.php");
require_once(__DIR__ . "/../helpers/mailgunHelper.php");
require_once("Model_imgs.php");
require_once("Model_workingTime.php");

class Model_projects extends Model
{
    public $table = "projects";
    public $clientModel;
    public $account_id;
    private $mailHelper;
    private $imgsModel;
    private $workingModel;

    public function __construct()
    {
        parent::__construct();
        $this->clientModel = new Model_clients();
        $this->imgsModel = new Model_imgs();
        $this->mailHelper = new mailgunHelper();
        $this->workingModel = new Model_workingTime();

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
                'clients.client_id',
                'clients.client_name',
                'clients.client_phone',
                'clients.client_mail',
                'users.user_id',
                'users.user_name',
                'users.user_mail',
                'users.user_phone',
            ],
            "where" => [
                "projects.account_id" => $this->account_id,
            ],
            "join" => [
                'INNER JOIN clients ON clients.client_id = projects.client_id',
                'LEFT JOIN users ON users.user_id = projects.assigned_user_id',
            ],
            "orderBy" => [
                "deadline"
            ]
            
        ];
        if(!empty($data['user'])){
            $queryData["where"]["assigned_user_id"] = $data['user'];
        }
        if(!empty($data['client'])){
            $queryData["where"]["clients.client_id"] = $data['client'];
        }
        if(!empty($data['projectId'])){
            $queryData["where"]["projects.project_id"] = $data['projectId'];
        }
        return $this->getAll($queryData); 
    }

    public function mailToClient($params){
        $projectId = $params->projectId;
        $costPerHour = 20;
        $from = 'coheen1@gmail.com';
        $to = 'coheen1@gmail.com';
        $project = $this->getAllProjects(["projectId" => $projectId]) ?? false;
        if($project){
            $project = $project[0];
            // $to = $project["client_mail"];
            if($project['project_status'] == 'in progress'){
                $estimatedHours = ((int) $project["estimated_time"]) * $costPerHour;
                $type = $project["item_type"];
                $description = $project["description"];
                
                $this->mailHelper->sendMail(
                    $from, 
                    $to, 
                    "Your project has been accepted!",
                    $this->projectAccepted($type, $description, $estimatedHours));
            } else if($project['project_status'] == 'done'){
                $totalWorking = intval($this->workingModel->getWorkingTotal($params) ?? 0) / 60 * $costPerHour;
                $imgs = $this->imgsModel->getImgs($projectId);
                $attachments = [];
                foreach($imgs as $imgsData){
                    array_push($attachments, $imgsData['img_url']);
                }
                $type = $project["item_type"];
                
                $this->mailHelper->sendMail(
                    $from, 
                    $to, 
                    "Your project is ready!", 
                    $this->projectDone($type, $totalWorking),
                    $attachments
                );
                    
            }
        }
        
    }


    public function updateProject($authData, $params)
    {
        $assignedUser = $authData["user"] ?? -1;
        if($assignedUser != -1){
            $params->set->assigned_user_id = $authData["user"];
        }
        $queryData = [
            "set" => $params->set,
            "where" => [
                "project_id" => $params->projectId,
            ],
        ];
        $result = $this->updateItem($queryData); 
        if(!empty($params->set->project_status)){
            $this->mailToClient($params);
        }
        return $result;
    }

    public function projectAccepted($type, $description, $estimatedHours){
        return "<html>
        <body style='background-color: #bdd5ea;
        padding: 44px;'>
            <div style='display: flex; width: 635px;
            margin: 10px auto; font-family: Roboto;'>
    
                <div style='background-color: #495867;
                            color: white;
                            padding: 30px;
                            width: 40%;
                            font-size: 26px;'>
                    <h3 style='color: #bdd5ea;'>Your project is underway...</h3>
                    <h3>Our best designers have started working on it!</h3>
                </div>
                <div style='background-color: white;
                            padding: 36px 41px;
                            width: 60%;
                            font-size: 14px;'>
                    <h4 style='color: #fe5f55;
                    font-size: 22px;'>Project Info:</h4>
                    <p style='font-weight: bold;'>Project type: <span style='font-weight: 100;'>$type</span><p>
                    <p style='font-weight: bold; margin-bottom: 50px;'>Project Description: <span style='font-weight: 100;'>$description</span><p>
                    <p> We assume the total price will be around <span style='font-weight: bold;'>$estimatedHours$</span>.</p>
                <p>Please feel free to contact us if you need any further information!</p>
                </div>
            </div>
            <div style='text-align: center; font-size: 16px;'>
            <span>RGB<span style='color: #fe5f55; font-size: 30px;'>.</span></span>
            </div>
        </body>
        </html>";
    }

    public function projectDone($type, $total){
        return "<html>
        <body style='background-color: #bdd5ea;
        padding: 44px;'>
            <div style='display: flex; width: 635px;
            margin: 10px auto; font-family: Roboto;'>
    
                <div style='background-color: #495867;
                            color: white;
                            padding: 30px;
                            width: 40%;
                            font-size: 40px;'>
                    <h3 style='color: #bdd5ea;'>Your project is ready!</h3>
                </div>
                <div style='background-color: white;
                            padding: 36px 41px;
                            width: 60%;
                            font-size: 14px;'>
                    <h4 style='color: #fe5f55;
                    font-size: 22px;'>Project Info:</h4>
                    <p style='font-weight: bold;'>Project type: <span style='font-weight: 100;'>$type</span><p>

                    <p>The total price is <span style='font-weight: bold;'>$total$</span>.</p>
                <p>Please take a look at the attached files and we will contact you soon.</p>
                <p>Feel free to contact us if you need any further information!</p>
                </div>
            </div>
            <div style='text-align: center; font-size: 16px;'>
            <span>RGB<span style='color: #fe5f55; font-size: 30px;'>.</span></span>
            </div>
        </body>
        </html>";
    }

}