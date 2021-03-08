<?php
namespace App\Http\Controllers;
use App\Models\detalleActividad;
use App\Models\comunidad;
use App\Models\resultado;
use App\Models\imagenes;
use App\Models\actividades;
use App\Models\estudiante;
use App\Models\miembros;


use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ResultadoController extends Controller{


    public function registrarResultado(Request $request, $external_det_actividad){
        $data = $request->json()->all();
        
        $detActividad = detalleActividad::where("external_detact",$external_det_actividad)->first();
        
        if($detActividad){
            $resultado = new resultado();
            $resultado->fk_det_actividad = $detActividad->id;
            $resultado->resumen_resultado = $data["resumen_resultado"];
            $resultado->descripcion_resultado = $data["descripcion_resultado"];
            $resultado->fecha_fin = $data["fecha_fin"];
            $resultado->estado = 1;
            $external = "Res".Utilidades\UUID::v4();
            $resultado->external_resultado = $external;
            $resultado->save();

            $detActividad->estado=1;
            $detActividad->save();
            return response()->json(["mensaje"=>"Operacion existosa","external_resultado"=>$external ,"siglas"=>"OE"], 200);

        }else{
            return response()->json(["mensaje"=>"Error","siglas"=>"Error"], 400);

        }
    }



    public function subirImagenResultado(Request $request, $external_resultado){
  
        $file = $request->file('file');
        $ruta= '../imagenes/resultados';
        $image_name = time().$file->getClientOriginalName();
        //var_dump(json_encode($file)); -> ver que me devuelve
        $file->move($ruta, $image_name);
        $resultado = resultado::where("external_resultado",$external_resultado)->first();
        $imagenes = new imagenes();
        $imagenes->fk_resultado = $resultado->id;
        $imagenes->ruta_imagen = $image_name;
        $imagenes->estado = 1;
        $external = "Img".Utilidades\UUID::v4();
        $imagenes->external_imagen = $external;
        $imagenes->save();
        return response()->json(["mensaje"=>"Operacion existosa","nombre_imagen" => $image_name, "siglas"=>"OE"], 200);
    }


    public function listarResultados(){
        global $estado, $datos; 
        self::iniciarObjetoJSon();
        $listas = resultado::where("estado",1)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $lista_imagenes=null;
            $detActividad = detalleActividad::where("id", $lista->fk_det_actividad)->first();
            $actividad = actividades::where("id",$detActividad->fk_actividades)->first();
            $comunidad = comunidad::where("id",$actividad->fk_comunidad)->first();
            $imagenes = imagenes::where("fk_resultado",$lista->id)->get();
            foreach ($imagenes as $img) {
                //$lista_imagenes[]="";
                $lista_imagenes[] =[
                    "ruta_imagen"=>$img->ruta_imagen
                ];
            }

            $datos['data'][] = [
                "actividad" => $detActividad->nombre_actividad,
                "resumen_resultado"=>$lista->resumen_resultado,
                "descripcion_resultado"=>$lista->descripcion_resultado,
                "fecha_inicio"=>$detActividad->fecha_inicio,
                "fecha_fin"=>$lista->fecha_fin,
                "imagenes"=>$lista_imagenes,
                "comunidad"=>$comunidad->nombre_comunidad,
                "external_resultado"=>$lista->external_resultado
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function listarResultadosByComunidad($external_comunidad){
        global $estado, $datos; 
        self::iniciarObjetoJSon();
        $comunidad = comunidad::where("external_comunidad",$external_comunidad)->first();
        $actividad = actividades::where("estado",1)->where("fk_comunidad",$comunidad->id)->first();
        $detActividad = detalleActividad::where("fk_actividades", $actividad->id)->first();
        $listas = resultado::where("estado",1)->where("fk_det_actividad",$detActividad->id)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $lista_imagenes=null;

            $imagenes = imagenes::where("fk_resultado",$lista->id)->get();
            foreach ($imagenes as $img) {
                //$lista_imagenes[]="";
                $lista_imagenes[] =[
                    "ruta_imagen"=>$img->ruta_imagen
                ];
            }

            $datos['data'][] = [
                "actividad" => $detActividad->nombre_actividad,
                "resumen_resultado"=>$lista->resumen_resultado,
                "descripcion_resultado"=>$lista->descripcion_resultado,
                "fecha_inicio"=>$detActividad->fecha_inicio,
                "fecha_fin"=>$lista->fecha_fin,
                "imagenes"=>$lista_imagenes,
                "external_resultado"=>$lista->external_resultado
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function listarResultadosByEstudiante($external_estudiante){
        global $estado, $datos; 
        self::iniciarObjetoJSon();
        $estudiante = estudiante::where("external_es",$external_estudiante)->first();
        $miembro = miembros::where("fk_estudiante",$estudiante->id)->first();
        $comunidad = comunidad::where("id",$miembro->fk_comunidad)->first();
        $actividad = actividades::where("estado",1)->where("id",$comunidad->id)->first();
        $detActividad = detalleActividad::where("fk_actividades", $actividad->id)->first();
        $listas = resultado::where("estado",1)->where("fk_det_actividad",$detActividad->id)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $lista_imagenes=null;

            $imagenes = imagenes::where("fk_resultado",$lista->id)->get();
            foreach ($imagenes as $img) {
                //$lista_imagenes[]="";
                $lista_imagenes[] =[
                    "ruta_imagen"=>$img->ruta_imagen
                ];
            }

            $datos['data'][] = [
                "actividad" => $detActividad->nombre_actividad,
                "resumen_resultado"=>$lista->resumen_resultado,
                "descripcion_resultado"=>$lista->descripcion_resultado,
                "fecha_inicio"=>$detActividad->fecha_inicio,
                "fecha_fin"=>$lista->fecha_fin,
                "imagenes"=>$lista_imagenes,
                "external_resultado"=>$lista->external_resultado
            ];
        }
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function listarResultado($external_resultado){
        global $estado, $datos; 
        self::iniciarObjetoJSon();

        $resultado = resultado::where("external_resultado",$external_resultado)->first();
        $detActividad = detalleActividad::where("id", $resultado->fk_det_actividad)->first();
        $actividad = actividades::where("id",$detActividad->fk_actividades)->first();
        $comunidad = comunidad::where("id",$actividad->fk_comunidad)->first();
        
        $imagenes = imagenes::where("fk_resultado",$resultado->id)->get();
        $lista_imagenes=null;
            foreach ($imagenes as $img) {
                //$datadetpos[]="";
                $lista_imagenes[] =[
                    "ruta_imagen"=>$img->ruta_imagen
                ];
            }
        $datos['data'] = [
            "actividad" => $detActividad->nombre_actividad,
            "descripcion_resultado"=>$resultado->descripcion_resultado,
            "descripcion_actividad"=>$detActividad->descripcion_actividad,
            "fecha_inicio"=>$detActividad->fecha_inicio,
            "fecha_fin"=>$resultado->fecha_fin,
            "imagenes"=>$lista_imagenes,
            "external_resultado"=>$resultado->external_resultado,
            "comunidad"=>$comunidad->nombre_comunidad,
            "comunidad_logo"=>$comunidad->ruta_logo
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