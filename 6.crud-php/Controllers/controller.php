<?php



class controller
{
    public $response;
    public $errors = "";
    public $model;
    public $model_cls;
    protected $user_id;
    protected $account_id;

    public function __construct()
    {
        $model_class_name = "Model_" . $this->model_cls;
        require_once("./Models/$model_class_name.php");
        $this->model = new $model_class_name();
        $this->parseAuthentication();
        $this->model->setAccountId($this->account_id);
        $this->model->setUserId($this->user_id);
    }

    public function getPostJsonData()
    {
       return json_decode(file_get_contents('php://input'));
    }

    protected function parseAuthentication()
    {
        $token = $this->getPostJsonData()->token;
        $path = getenv('URL');
        $url = $path . "getUser";
        
        
            $ch = curl_init();
            
            $headers = array(
                'Accept: application/json',
                'Content-Type: application/json',
                "authorization: $token"
            );
    
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            $user = curl_exec($ch);
            if($user){
                $user = json_decode($user);
                $this->account_id = $user->accountId;
                $this->user_id = $user->userId;
            } else {
                header('HTTP/1.0 401 Unauthorized');
                exit();
            }
    }

    protected function validateAll($data){
        return true;
    }

    
}
