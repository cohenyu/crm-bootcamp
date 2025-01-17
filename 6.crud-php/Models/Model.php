<?php

require_once('constants/db_constants.php');

class Model
{
    public static $db_instance = null;
    public $table;
    public $account_id;
    public $user_id;

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

    /**
     * Creates a sql query string and make an insert query.
     * Returns the id of the new inserted item.
     */
    protected function insertItem($queryData)
    {
        $columns = join(', ', array_keys($queryData));
        $values = join("', '", array_values($queryData));
        $values = "'" . $values . "'";
        $query = "INSERT INTO $this->table ($columns) VALUES ($values)";
        $query = str_replace("'NOW()'","NOW()", $query);
        return $this->insert($query);
    }


    public function deleteItem($queryData)
    {
        $where = $this->build($queryData, 'where');
        $query = "DELETE FROM $this->table $where";
        return $this->delete($query);
    }

    /**
     * Creates a sql query string and make an select query.
     * Returns all items that match the query.
     */
    protected function getAll($queryData, $allCols=false)
    {
        if($allCols){
            $columns = "*";
        } else {
            $columns = join(", ", $queryData["cols"]);
        }
        $where = $this->build($queryData, 'where');

        $join = '';
        if(!empty($queryData["join"])){
            $join = join(' ', $queryData["join"]);
        }

        $limit = '';
        if(!empty($queryData["limit"])){
            $limit = "LIMIT " . $queryData['limit'];
        }

        $order ='';
        if(!empty($queryData["orderBy"])){
            $order = "ORDER BY " . join(", ", $queryData["orderBy"]);
        }
        return $this->select("SELECT $columns FROM $this->table $join $where $order $limit;"); 
        // return "SELECT $columns FROM $this->table $join $where $order $limit;";   
    }

    protected function updateItem($queryData)
    {
        
        $where = $this->build($queryData, 'where');
        $set = $this->build($queryData, 'set');

        // return $this->update("UPDATE $this->table $set $where;");   
        $query =  "UPDATE $this->table $set $where;"; 
        $query = str_replace("'NOW()'","NOW()", $query);
        return $this->update($query);   
    }



    /**
     * Create string of where clause from queryData
     */
    public function build($queryData, $operation){
        if($operation == 'where'){
            if(!empty($queryData["specialCondition"])){
                $condition = $queryData["specialCondition"];
                return "WHERE $condition";
            }
        }

        if(!empty($queryData[$operation])){
            $conditions = [];
            foreach ($queryData[$operation] as $col => $value){
                array_push($conditions, "$col = '$value'");
            }
            return "$operation " . join($operation == 'where' ? " AND " : ', ', $conditions);
        } 
        return "";
    }

    /**
     * Make an insert query 
     */
    public function insert ($sql){
        $result = $this->getDB()->query($sql);
        if($result){
            return $this->getDB()->insert_id;
        }
        return -1;
    }

    /**
     * Make a select query 
     */
    public function select ($sql){
        $query = $this->getDB()->query($sql);
        if(!$query){
            return false;
        }
        $result = $query->fetch_all(MYSQLI_ASSOC);
        return $result;
    }

    /**
     * Make an update query 
     */
    public function update ($sql){
        $result = $this->getDB()->query($sql);
        if($result){
            return $this->getDB()->affected_rows;
        }
        return -1;
    }

    public function setAccountId($account_id){
        $this->account_id = $account_id;
        return $account_id;
    }

    public function setUserId($user_id){
        $this->user_id = $user_id;
        return $user_id;
    }

    public function delete($sql){
        $result = $this->getDB()->query($sql);
        if($result){
            return $this->getDB()->affected_rows;
        }
        return -1;
    }

}
?>
