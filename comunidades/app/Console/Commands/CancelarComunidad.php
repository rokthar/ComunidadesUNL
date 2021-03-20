<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\comunidad;


class CancelarComunidad extends Command{
    protected $signature = 'command:cancelarcomunidad';
    protected $description = 'Command Description';
    
    public function __construct(){
        parent::__construct();
    }

    public function handle(){
        
        // echo "hola mundo \n";
        $comunidad = comunidad::where('created_at','<',Carbon::now()->subDays(7))->get();
        for ($i=0; $i < count($comunidad) ; $i++) { 
            echo $comunidad[$i]->id."\n";
            // $comunidad[$i]->estado=0;
            // $comunidad[$i]->save();
            // llamar a la funcion para enviar correo
        }
    }
}
?>