<?php

require_once('constants/db_constants.php');

class Model
{
    public static $db_instance = null;

    public function __construct()
    {
        $this->initDB();
    }

    public function initDB()
    {
        if (self::$db_instance == null) {
            self::$db_instance = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_SCHEMA);
        }
    }

    public function getDB()
    {
        return self::$db_instance;
    }
}
