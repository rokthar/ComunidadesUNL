<?php
namespace App\Http\Controllers;
use App\Models\actividades;
use App\Models\comunidad;
use App\Models\docente;
use App\Models\detalleActividad;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ActividadController extends Controller{

    public function PlanificarActividades ($external_comunidad){
            $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
            if($comunidadObj){
                $actividades = new actividades();
                $actividades->fk_comunidad = $comunidadObj->id;
                $actividades->estado=2;
                $external = "Act".Utilidades\UUID::v4();
                $actividades->external_actividades = $external;
                $actividades->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
    }

    public function ActivarPlanificacion($external_actividades){
        $actividadObj = actividades::where("external_actividades", $external_actividades)->first();
        if($actividadObj){
            $actividad = actividades::where("id", $actividadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $actividad->estado = 1;
            $actividad->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }
    }

    public function ListarPlanificacionEspera (){
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
            $data[] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "tutor"=>$tutor->nombres,
                "actividades"=>$dataAct
            ];
        }
        
        return response()->json($data,200);
    }

    public function ListarPlanificacionActivada (){
        $listas = actividades::where("estado",1)->get();

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
            $data[] = [
                "comunidad" => $comunidad->nombre_comunidad,
                "tutor"=>$tutor->nombres,
                "actividades"=>$dataAct
            ];
        }
        
        return response()->json($data,200);
    }
}