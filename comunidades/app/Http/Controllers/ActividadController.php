<?php
namespace App\Http\Controllers;
use App\Models\actividades;
use App\Models\comunidad;
use App\Models\docente;
use App\Models\detalleActividad;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ActividadController extends Controller{

    public function PlanificarActividades ($external_docente){
            $docente=docente::where("external_do",$external_docente)->first();
            $comunidadObj=comunidad::where("tutor",$docente->id)->first();
            //$comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
            if($comunidadObj){
                $actividades = new actividades();
                $actividades->fk_comunidad = $comunidadObj->id;
                $actividades->estado=3;
                $external = "Act".Utilidades\UUID::v4();
                $actividades->external_actividades = $external;
                $actividades->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE","external_actividades"=>$external],200);
            }
    }

    public function RegistrarDetalleActividad(Request $request, $external_actividades){
        if ($request->json()){
            $data = $request->json()->all();
            
            $actividadesObj = actividades::where("external_actividades", $external_actividades)->first();
            if($actividadesObj){
                for($i=0; $i < count($data) ; $i++){
                    $detalleActividad = new detalleActividad();
                    $detalleActividad->fk_actividades = $actividadesObj->id;
                    $detalleActividad->nombre_actividad = $data[$i]["nombre_actividad"];
                    $detalleActividad->descripcion_actividad = $data[$i]["descripcion_actividad"];
                    $detalleActividad->fecha_inicio = $data[$i]["fecha_inicio"];
                    $detalleActividad->estado =3;
                    $external = "DetPost".Utilidades\UUID::v4();
                    $detalleActividad->external_detact = $external;
                    $detalleActividad->save();
                }
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }else{
                return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
            }
        }
    }

    public function ActivarPlanificacion($external_actividades){
        $actividadObj = actividades::where("external_actividades", $external_actividades)->first();
        $detalleactividadObj = detalleActividad::where("fk_actividades", $actividadObj->id)->get();
        if($actividadObj){
            foreach ($detalleactividadObj as $lista) {
                $lista->estado = 2;
                $lista->save();    
            }
            $actividad = actividades::where("id", $actividadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $actividad->estado = 2;
            $actividad->save();
                      
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        }
    }

    public function TermianrPlanificacion($external_comunidad){
        $actividad = actividad::where("estado",2)->where("fk_comunidad",$external_comunidad)->first();
        $actividad->estado=1;
        $actividad->save();
    }


    public function ListarPlanificacionEspera (){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = actividades::where("estado",3)->get();

        $data = array();
        foreach ($listas as $lista) {
            $dataAct = null;
            $actividades = detalleActividad::where("fk_actividades",$lista->id)->get();
            $comunidad = comunidad::where("id",$lista->fk_comunidad)->first();
            $tutor = docente::where("id", $comunidad->tutor)->first();
            foreach ($actividades as $act) {
                $dataAct[] =[
                    "nombre_actividad"=>$act->nombre_actividad,
                    "descripcion_actividad"=>$act->descripcion_actividad,
                    "fecha_inicio"=>$act->fecha_inicio
                ];
            }
            $datos['data'][] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "actividades"=>$dataAct,
                "external_actividades"=>$lista->external_actividades,
                "logo_comunidad"=>$comunidad->ruta_logo
            ];
        }
        
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ListarPlanificacionActivada (){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = actividades::where("estado",2)->get();

        $data = array();
        foreach ($listas as $lista) {
            $actividades = detalleActividad::where("fk_actividades",$lista->id)->get();
            $comunidad = comunidad::where("id",$lista->fk_comunidad)->first();
            $tutor = docente::where("id", $comunidad->tutor)->first();
            foreach ($actividades as $act) {
                $dataAct[] =[
                    "nombre_actividad"=>$act->nombre_actividad,
                    "descripcion_actividad"=>$act->descripcion_actividad,
                    "fecha_inicio"=>$act->fecha_inicio
                ];
            }
            $datos['data'][] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "tutor"=>$tutor->nombres." ". $tutor->apellidos,
                "actividades"=>$dataAct
            ];
        }
        
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function ListarPlanificacionByComunidad($external_comunidad){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $comunidad = comunidad::where("external_comunidad",$external_comunidad)->first();
        $listas = actividades::where("estado",1)->where("fk_comunidad",$comunidad->id)->get();

        $data = array();
        foreach ($listas as $lista) {
            $actividades = detalleActividad::where("fk_actividades",$lista->id)->where("estado",2)->get();

            foreach ($actividades as $act) {
                $datos['data'][] = [
                    "nombre_actividad"=>$act->nombre_actividad,
                    "descripcion_actividad"=>$act->descripcion_actividad,
                    "fecha_inicio"=>$act->fecha_inicio,
                    "external_det_actividad"=>$act->external_detact
                ];
            }
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