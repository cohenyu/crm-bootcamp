<?php 

require 'vendor/autoload.php';

use Mailgun\Mailgun;

class mailGunHelper {
    public function __construct()
    {
        
    }

    public function sendMail($from, $to, $subject, $html, $attachments=[]){
        $attachmentsData = [];
        foreach($attachments as $img){
            array_push($attachmentsData, ['filePath'=> __DIR__ . "/../imgs/$img"]);
        }
        try {          
            $mg = Mailgun::create(getenv('API_KEY')); 
            $mg->messages()->send(getenv('DOMAIN'), [
            'from'    => $from,
            'to'      => $to,
            'subject' => $subject,
            'html'    => $html,
            'attachment' => $attachmentsData
            ]);
            $this->response = true;
        } catch (Exception $e){
            $this->response = false;
        }
    }
}

?>
