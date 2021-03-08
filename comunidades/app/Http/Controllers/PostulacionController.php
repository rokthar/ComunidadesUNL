<?php
namespace App\Http\Controllers;
use App\Models\postulacion;
use App\Models\comunidad;
use App\Models\estudiante;
use App\Models\detallePostulacion;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class PostulacionController extends Controller{

    public function RegistrarPostulacion($external_estudiante, $external_comunidad){
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        $estudianteObj = estudiante::where("external_es", $external_estudiante)->first();
        if($comunidadObj && $estudianteObj){
            $postulacion = new postulacion();
            $postulacion->fk_estudiante = $estudianteObj->id;
            $postulacion->fk_comunidad = $comunidadObj->id;
            $postulacion->estado = 2;
            $external = "Post".Utilidades\UUID::v4();
                $postulacion->external_postulacion = $external;
                $postulacion->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE","external_postulacion"=>$external],200);
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        }
    }

    public function RegistrarDetallePostulacion(Request $request, $external_postulacion){
        if ($request->json()){
            $data = $request->json()->all();
            
            $postulacionObj = postulacion::where("external_postulacion", $external_postulacion)->first();
            if($postulacionObj){
                for($i=0; $i < count($data) ; $i++){
                    $detallePostulacion = new detallePostulacion();
                    $detallePostulacion->fk_postulacion = $postulacionObj->id;
                    $detallePostulacion->habilidad = $data[$i]["habilidad"];
                    $detallePostulacion->nivel = $data[$i]["nivel"];
                    $detallePostulacion->estado =2;
                    $external = "DetPost".Utilidades\UUID::v4();
                    $detallePostulacion->external_det_postulacion = $external;
                    $detallePostulacion->save();
                }
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }else{
                return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
            }
        }
    }

    public function ActivarPostulacion($external_postulacion){
        $postulacionObj = postulacion::where("external_postulacion", $external_postulacion)->first();
        $detallePostulacionObj = detallePostulacion::where("fk_postulacion", $postulacionObj->id)->get();
        
        if($postulacionObj){
            $postulacion = postulacion::where("id", $postulacionObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $postulacion->estado = 1;
            $postulacion->save();
            foreach ($detallePostulacionObj as $lista) {
                $lista->estado = 1;
                $lista->save();    
            }
            

            $estudiante = estudiante::where("id", $postulacion->fk_estudiante)->first();
            $estudiante->estado = 2; //estado del estudiante en 2 indica que es miembro de comunidad
            $estudiante->save();
            

            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        }
    }
    
    
    public function listarPostulacionesEspera(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = postulacion::where("estado",2)->get();

        $data = array();
        foreach ($listas as $lista) {
            $datadetpos=null;
            $detallepostulacion = detallePostulacion::where("fk_postulacion",$lista->id)->get();
            $estudiante = estudiante::where("id",$lista->fk_estudiante)->first();
            $comunidad = comunidad::where("id",$lista->fk_comunidad)->first();
            foreach ($detallepostulacion as $detpos) {
                //$datadetpos[]="";
                $datadetpos[] =[
                    "habilidad"=>$detpos->habilidad,
                    "nivel"=>$detpos->nivel
                ];
            }
            $datos['data'][] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "estudiante"=>$estudiante->nombres." ". $estudiante->apellidos,
                "habilidades"=>$datadetpos,
                "external_postulacion"=>$lista->external_postulacion,
                "ciclo"=>$estudiante->ciclo." ".$estudiante->paralelo
            ];
            
        }
        
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function listarPostulacionesAceptadas(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = postulacion::where("estado",1)->get();

        $data = array();
        foreach ($listas as $lista) {
            $datadetpos=null;
            $detallepostulacion = detallePostulacion::where("fk_postulacion",$lista->id)->get();
            $estudiante = estudiante::where("id",$lista->fk_estudiante)->first();
            $comunidad = comunidad::where("id",$lista->fk_comunidad)->first();
            foreach ($detallepostulacion as $detpos) {
                $datadetpos[] =[
                    "habilidad"=>$detpos->habilidad,
                    "nivel"=>$detpos->nivel
                ];
            }
            $datos['data'][] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "estudiante"=>$estudiante->nombres." ". $estudiante->apellidos,
                "habilidades"=>$datadetpos
            ];
            
        }
        
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
