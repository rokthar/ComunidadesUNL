<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer\PHPMailer;
require 'Utilidades/PHPMailer/vendor/autoload.php';

//estado 0 Inactivo | 1 Activado | 2 revision Gestor | 3 revision secretaria | 4 en espera
class MailController extends Controller{

    public function enviarMail($asunto,$correo,$mensaje){
        require base_path("vendor/autoload.php");
            $mail = new PHPMailer(true);
            $mail->CharSet='UTF-8';
            $mail->isMail();
            $mail->setFrom('jmmorochoaunl.edu.ec@gmail.com','Proeditsclub.com');
            $mail->addReplyTo('jmmorochoaunl.edu.ec@gmail.com','Proeditsclub.com');
            $mail->Subject=($asunto); //asunto del correo
            $mail->addAddress($correo);
            $mail->msgHTML($mensaje);
            $mail->Send();
    }

}
?>