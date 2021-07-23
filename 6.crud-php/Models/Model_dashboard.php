<?php

require_once("Model.php");

class Model_dashboard extends Model
{
    
    public function __construct()
    {
        parent::__construct();
    }


    public function projectCostVsEstimated($data)
    {   
        if($data->interval == 'week'){
            $interval = 7;
        } else if($data->interval == 'month') {
            $interval = 27;
        } else {
            $interval = 1;
        }
        $query = "SELECT users.user_name,
                ROUND(avg(projects.estimated_time * settings.hour_cost)) as estimated_cost, 
                ROUND(avg(projects.total_cost)) as total_cost
                FROM users
                JOIN projects ON projects.assigned_user_id = users.user_id
                JOIN settings ON projects.account_id = settings.account_id
                WHERE (projects.project_status = 'closed' 
                    OR projects.project_status = 'done')
                    AND projects.total_cost IS NOT NULL 
                    AND projects.account_id = $this->account_id 
                    AND projects.updated >  now() - interval $interval day
                GROUP BY users.user_id
                ORDER BY ABS((projects.estimated_time * settings.hour_cost) - projects.total_cost) DESC
                LIMIT $data->limit;";
                // exit($query);

        return $this->select($query); 
    }

    public function workingHours($data){
        if($data->interval == 'week'){
            $interval = 6;
        } else if($data->interval == 'month') {
            $interval = 27;
        } else {
            $interval = 364;
        }

        $sort = $data->mode == 'max' ? 'DESC' : 'ASC';
        $query = "SELECT 
                users.user_name,
                DAYOFWEEK(working_time.start_time) AS day_in_week,
                sum(HOUR(TIMEDIFF(working_time.stop_time, working_time.start_time))) AS work_time
                FROM users
                JOIN (SELECT 
                    users.user_name,
                    sum(HOUR(TIMEDIFF(working_time.stop_time, working_time.start_time))) AS work_time
                    FROM users
                    JOIN working_time ON working_time.user_id = users.user_id
                    WHERE users.account_id = $this->account_id
                    AND working_time.stop_time IS NOT NULL
                    AND working_time.start_time > NOW() - INTERVAL $interval day
                    GROUP BY users.user_id
                    ORDER BY work_time $sort
                    LIMIT $data->limit) as workers 
                ON workers.user_name = users.user_name
                JOIN working_time
                ON working_time.user_id = users.user_id
                WHERE users.account_id = $this->account_id
                AND working_time.stop_time IS NOT NULL
                AND working_time.start_time > NOW() - INTERVAL $interval day
                GROUP BY users.user_id , day_in_week;";

        return $this->select($query);
    }

    public function getProjectStatusSum($data){
        if($data->interval == 'week'){
            $interval = 6;
        } else if($data->interval == 'month') {
            $interval = 27;
        } else {
            $interval = 1;
        }
        $query = "SELECT project_status, count(*) as count
        FROM projects
        WHERE account_id = $this->account_id
        AND updated > now() - interval $interval day
        GROUP BY project_status
        ;";
        return $this->select($query);
    }

    public function leastRecentlyCreatedProject($data){
        
        if($data->interval == 'week'){
            $interval = 6;
        } else if($data->interval == 'month') {
            $interval = 27;
        } else {
            $interval = 1;
        }
        $query = "SELECT *, ROUND(HOUR(timediff(now(),created)) / 24) as passed_days
        FROM projects
        WHERE project_status = 'open'
        AND created > now() - interval $interval day
        AND account_id = $this->account_id
        ORDER BY created
        limit $data->limit
        ;";
        return $this->select($query);
    }
}

 
