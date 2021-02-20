<?php
namespace App\Http\Controllers;
use App\Models\actividades;
use App\Models\detalleActividad;
use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class DetalleActividadController extends Controller{

    public function RegistrarDetallesActividad(Request $request, $external_actividad){
        
        if ($request->json()){
            $data = $request->json()->all();

            $actividadObj = actividades::where("external_actividades", $external_actividad)->first();

            if($actividadObj){
                $detalle_actividad = new detalleActividad();
                $detalle_actividad->fk_actividades = $actividadObj->id;
                $detalle_actividad->nombre_actividad = $data["nombre_actividad"];
                $detalle_actividad->descripcion_actividad = $data["descripcion_actividad"];
                $detalle_actividad->fecha_inicio = $data["fecha_inicio"];
                $detalle_actividad->estado = 2;
                $external = "DetAct".Utilidades\UUID::v4();
                $detalle_actividad->external_detact = $external;
                $detalle_actividad->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
        }
    }
}