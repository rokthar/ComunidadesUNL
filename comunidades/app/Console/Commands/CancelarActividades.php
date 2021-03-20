<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\actividades;


class CancelarActividades extends Command{
    protected $signature = 'command:cancelaractividades';
    protected $description = 'Command Description';
    
    public function __construct(){
        parent::__construct();
    }

    public function handle(){
        
        // echo "hola mundo \n";
        $actividades = actividades::where('created_at','<',Carbon::now()->subDays(7))->get();
        for ($i=0; $i < count($actividades) ; $i++) { 
            echo $actividades[$i]->id."\n";
            // $actividades[$i]->estado=0;
            // $actividades[$i]->save();
            // llamar a la funcion para enviar correo
        }
    }
}
?>