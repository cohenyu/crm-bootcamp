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
        // get the token and it to parse
        $this->model = new $model_class_name();
        $this->parseAuthentication();
        $this->model->setAccountId($this->account_id);
    }

    public function getPostJsonData()
    {
       return json_decode(file_get_contents('php://input'));
    }

    protected function parseAuthentication()
    {
        // TODO send request to auth service and parse the response
        $this->account_id = 1;
        $this->user_id = 1;
    }

    
}
