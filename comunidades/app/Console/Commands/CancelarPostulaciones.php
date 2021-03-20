<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\postulacion;


class CancelarPostulaciones extends Command{
    protected $signature = 'command:cancelarpostulaciones';
    protected $description = 'Command Description';
    
    public function __construct(){
        parent::__construct();
    }

    public function handle(){
        
        // echo "hola mundo \n";
        $postulaciones = postulacion::where('created_at','<',Carbon::now()->subDays(7))->get();
        for ($i=0; $i < count($postulaciones) ; $i++) { 
            echo $postulaciones[$i]->id."\n";
            // $postulaciones[$i]->estado=0;
            // $postulaciones[$i]->save();
            // llamar a la funcion para enviar correo
        }
    }
}
?>