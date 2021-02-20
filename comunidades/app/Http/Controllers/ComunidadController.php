<?php
namespace App\Http\Controllers;
use App\Models\comunidad;
use App\Models\docente;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ComunidadController extends Controller{

    public function RegistrarComuidad(Request $request, $external_docente){
        
            if ($request->json()){
                $data = $request->json()->all();

                $docenteObj = docente::where("external_do", $external_docente)->first();

                if($docenteObj){
                    $comunidad = new comunidad();
                    $comunidad->nombre_comunidad = $data["nombre_comunidad"];
                    $comunidad->tutor = $docenteObj->id;
                    $comunidad->descripcion = $data["descripcion"];
                    $comunidad->mision = $data["mision"];
                    $comunidad->vision = $data["vision"];
                    $comunidad->ruta_logo = $data["ruta_logo"];
                    $comunidad->estado = 2;
                    $external = "Com".Utilidades\UUID::v4();
                    $comunidad->external_comunidad = $external;
        
                    $comunidad->save();
                    return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
                }else{
                    return response()->json(["mensaje"=>"Docente no enconrado", "siglas"=>"DNE"],400);
                } 
            }
    }

    public function ActivarComunidad ($external_comunidad){
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 1;
            $comunidad->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }
    }

    public function EditarComunidad (Request $request, $external_comunidad){
        if ($request->json()){
            $data = $request->json()->all();

            $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
            if($comunidadObj){
                $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
                $comunidad->descripcion = $data["descripcion"];
                $comunidad->mision = $data["mision"];
                $comunidad->vision = $data["vision"];
                $comunidad->ruta_logo = $data["ruta_logo"];
                $comunidad->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
        }
        
    }

    public function ListarComunidadesActivadas (){
        $listas = comunidad::where("estado",1)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $data[] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        return response()->json($data,200);
    }

    public function ListarComunidadesEspera(){
        $listas = comunidad::where("estado",2)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $data[] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        return response()->json($data,200);
    }
}
?>