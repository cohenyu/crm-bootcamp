<?php

require_once("Model.php");

class Model_users extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllUsers()
    {
        try {
            $users = $this->getDB()
            ->query("SELECT * FROM  users")
            ->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            return null;
        }
        return $users;
    }
}
