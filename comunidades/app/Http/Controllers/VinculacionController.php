<?php
namespace App\Http\Controllers;
use App\Models\vinculacion;
use App\Models\comunidad;

use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class VinculacionController extends Controller{
    public function RegistrarVinculacion(Request $request, $ext_comunidad,$ext_comunidad_solic){
        if ($request->json()){
            $data = $request->json()->all();
            
            $comunidadSolicitante=comunidad::where("external_comunidad",$ext_comunidad)->first();
            $comunidadSolicitada=comunidad::where("external_comunidad",$ext_comunidad_solic)->first();

            if($comunidadSolicitante && $comunidadSolicitada){
                $vinculacion = new vinculacion();
                $vinculacion->fk_comunidad_solicitante = $comunidadSolicitante->id;
                $vinculacion->fk_comunidad_solicitada = $comunidadSolicitada->id;
                $vinculacion->descripcion = $data["descripcion"];
                $vinculacion->fecha_inicio = $data["fecha_inicio"];
                $vinculacion->estado = 2;
                $external = "Vinc".Utilidades\UUID::v4();
                $vinculacion->external_vinculacion = $external;

                $vinculacion->save();
                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE","external_vinculacion"=>$external],200);
            }else{
                return response()->json(["mensaje"=>"No existen los datos", "siglas"=>"NED"],200);
            }

        }
    }

    public function AceptarVinculacion($external_vinculacion){
        $vinculacionObj = vinculacion::where("external_vinculacion",$external_vinculacion)->first();

        if($vinculacionObj){
            $vinculacionObj->estado = 1;
            $vinculacionObj->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        }
    }

    public function RechazarVinculacion($external_vinculacion){
        $vinculacionObj = vinculacion::where("external_vinculacion",$external_vinculacion)->first();

        if($vinculacionObj){
            $vinculacionObj->estado = 0;
            $vinculacionObj->save();
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos","siglas"=>"DI"],400);
        }
    }

    public function ListarVinculacionComunidad($external_comunidad){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        //if ($request->json()){
            //$data = $request->json()->all();
            $comunidad=comunidad::where("external_comunidad",$external_comunidad)->first();
            //$vinculacionObj = vinculacion::where("external_vinculacion",$external_vinculacion)->get();
            $vinculacionObj = vinculacion::where("fk_comunidad_solicitada",$comunidad->id)
            ->where("estado",2)->get();

            foreach ($vinculacionObj as $lista) {
                $comunidadSolicitante=comunidad::where("id",$lista->fk_comunidad_solicitante)->first();
                //$comunidadSolicitada=comunidad::where("id",$lista->fk_comunidad_solicitada)->first();

                $datos['data'][] = [
                    "comunidad_solicitante" => $comunidadSolicitante->nombre_comunidad,
                    "comunidad_solicitada"=>$comunidad->nombre_comunidad,
                    "descripcion"=>$lista->descripcion,
                    "fecha_inicio"=>$lista->fecha_inicio,
                    "external_vinculacion"=>$lista->external_vinculacion
                ];
            }

            self::estadoJson(200, true, '');
            return response()->json($datos, $estado);
        //}
        
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