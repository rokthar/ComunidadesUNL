<?php
namespace App\Http\Controllers;
use App\Models\comunidad;
use App\Models\docente;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 revision Gestor | 3 revision secretaria | 4 en espera
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
                    $comunidad->ruta_logo = "default.png";
                    $comunidad->estado = 4;
                    $external = "Com".Utilidades\UUID::v4();
                    $comunidad->external_comunidad = $external;
        
                    $comunidad->save();
                    return response()->json(["mensaje"=>"Operación Exitosa","external_comunidad"=>$external ,"siglas"=>"OE"],200);
                }else{
                    return response()->json(["mensaje"=>"Docente no enconrado", "siglas"=>"DNE"],400);
                } 
            }
    }

    public function subirImagenComunidad(Request $request, $external_comunidad){
  
        $file = $request->file('file');
        $ruta= '../imagenes/comunidad';
        $image_name = time().$file->getClientOriginalName();
        //var_dump(json_encode($file)); -> ver que me devuelve
        $file->move($ruta, $image_name);
        $comunidades = comunidad::where("external_comunidad",$external_comunidad)->first();
        $comunidades->ruta_logo = $image_name;
        $comunidades->save();
        return response()->json(["mensaje"=>"Operacion existosa","nombre_imagen" => $image_name, "siglas"=>"OE"], 200);
    }

    public function ActivarComunidad ($external_comunidad){
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        $docenteObj = docente::where("id", $comunidadObj->tutor)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 1;
            $comunidad->save();
            //tipoDocente: 1 docente | 2 gestor | 3 secretaria | 4 Decano | 5 Tutor
            $docenteObj->tipoDocente = 5;
            $docenteObj->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }
    }

    public function RevisionInformacion ($external_comunidad){
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 3;
            $comunidad->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }
    }

    public function RevisionGestor ($external_comunidad){
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 2;
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
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = comunidad::where("estado",1)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $datos['data'][] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "external_comunidad"=>$lista->external_comunidad,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ListarComunidadesSecretaria(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = comunidad::where("estado",4)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $datos['data'][] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "external_comunidad"=>$lista->external_comunidad,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ListarComunidadesGestor(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = comunidad::where("estado",3)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $datos['data'][] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "external_comunidad"=>$lista->external_comunidad,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ListarComunidadesDecano(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = comunidad::where("estado",2)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();

            $datos['data'][] = [
                "nombres" => $lista->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "descripcion"=>$lista->descripcion,
                "mision"=>$lista->mision,
                "vision"=>$lista->vision,
                "external_comunidad"=>$lista->external_comunidad,
                "ruta_logo"=>$lista->ruta_logo
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function BuscarComunidad($external_docente){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $docente = docente::where("external_do",$external_docente)->first();
        $comunidad = comunidad::where("tutor",$docente->id)->first();
        $datos['data'] = [
            "nombre_comunidad" => $comunidad->nombre_comunidad,
            "external_comunidad"=>$comunidad->external_comunidad,
            "ruta_logo"=>$comunidad->ruta_logo
        ];
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    private static function estadoJson($estadoPeticion, $satisfactorio, $mensaje)
    {
        global $estado, $datos;
        $estado = $estadoPeticion;
        $datos['sucess'] = $satisfactorio;
        $datos['mensaje'] = $mensaje;
    }

    private static function iniciarObjetoJSon(){
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
    }
}
?>