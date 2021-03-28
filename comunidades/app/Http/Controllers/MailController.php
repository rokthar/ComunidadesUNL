<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use PHPMailer\PHPMailer\PHPMailer;
require 'Utilidades/PHPMailer/vendor/autoload.php';

//estado 0 Inactivo | 1 Activado | 2 revision Gestor | 3 revision secretaria | 4 en espera
class MailController extends Controller{

    
    public function enviarMail($usuario,$asunto,$mensaje){
        $mail = new PHPMailer(true);
        // if ($request->json()){
        //     $data = $request->json()->all();
            try {
                //Server settings
                $mail->SMTPDebug = 0;                      //Enable verbose debug output
                $mail->isSMTP();                                            //Send using SMTP
                $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
                $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
                $mail->Username   = 'comunidades.estudiantile@gmail.com';                     //Cuenta desde la que se va a enviar el correo
                $mail->Password   = 'ComunidadesUNL0322';                               //Contraseña desde la que se va a enviar el correo
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
                $mail->Port       = 587;                                    //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

                //Recipients
                $mail->setFrom('comunidades.estudiantile@gmail.com', 'ComunidadesEstudiantiles');
                $mail->addAddress("riky.paramore@gmail.com");               //Name is optional

                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Subject = $asunto;
                // $mail->Body    = $mensaje;
                $mail->Body    = "
                <img style='width: 300px;' src='https://unl.edu.ec/sites/default/files/inline-images/logogris.png'/>
                <p style='margin:0px; padding:0px'>Universidad Nacional de Loja</p>
                <h2 style='margin:0px; padding:0px; '>CARRERA DE INGENIERÍA EN SISTEMAS (UNL)</h2>
                <hr>
                <p>Estimado/a ". $usuario."</p> <p>".
                $mensaje.
                "</p> <p>Por favor, revise su perfil en el sistema web Comunidades Estudiantiles</p>
                <br>
                <a style='text-decoration: none;color:#fafafa;border-radius: 10px;padding:1%;background-color: #071831;' href='https://comunidadesestudiantiles.000webhostapp.com/' target='_blanck'>Acceder</a>
                <br><br>
                <p>Saludos Cordiales</p>
                <hr>
                <p style='font-weight: bold;margin:0px; padding:0px'>CARRERA DE INGENIERÍA EN SISTEMAS (UNL)</p>
                <p style='margin:0px; padding:0px'>07-2546384 / 07-2547252(ext. 154-155) Ciudad Universitaria 'Ing. Guillermo Falconi Espinosa'</p>
                ";

                $mail->send();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        // }else{
        //     return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        // }
    }

}
?>