<?php
namespace App\Http\Controllers;
use App\Models\DetalleActividad;
use App\Models\Comunidad;
use App\Models\Resultado;
use App\Models\Imagenes;
use App\Models\Actividades;
use App\Models\Estudiante;
use App\Models\Miembros;


use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ResultadoController extends Controller{


    public function registrarResultado(Request $request, $external_det_actividad){
        $data = $request->json()->all();
        
        $detActividad = DetalleActividad::where("external_detact",$external_det_actividad)->first();
        
        if($detActividad){
            if($data["resumen_resultado"] != "" && $data["descripcion_resultado"] != "" && $data["fecha_fin"] != ""){
                $resultado = new Resultado();
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
                return response()->json(["mensaje"=>"Datos Faltantes","siglas"=>"DF"], 200);
            }
        }else{
            return response()->json(["mensaje"=>"La actividad no ha sido registrada","siglas"=>"ANR"], 200);
        }
    }



    public function subirImagenResultado(Request $request, $external_resultado){
  
        $file = $request->file('file');
        $ruta= '../imagenes/resultados';
        $image_name = time().$file->getClientOriginalName();
            $file->move($ruta, $image_name);
            $resultado = Resultado::where("external_resultado",$external_resultado)->first();
            if($resultado){
                $imagenes = new Imagenes();
                $imagenes->fk_resultado = $resultado->id;
                $imagenes->ruta_imagen = $image_name;
                $imagenes->estado = 1;
                $external = "Img".Utilidades\UUID::v4();
                $imagenes->external_imagen = $external;
                $imagenes->save();
                return response()->json(["mensaje"=>"Operacion existosa","nombre_imagen" => $image_name, "siglas"=>"OE"], 200);
            }else{
                return response()->json(["mensaje"=>"La actividad no ha sido registrada", "siglas"=>"ANR"], 200);
            }
    
    }


    public function listarResultados(){
        global $estado, $datos; 
        self::iniciarObjetoJSon();
        $listas = Resultado::where("estado",1)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $lista_imagenes=null;
            $detActividad = DetalleActividad::where("id", $lista->fk_det_actividad)->first();
            $actividad = Actividades::where("id",$detActividad->fk_actividades)->first();
            $comunidad = Comunidad::where("id",$actividad->fk_comunidad)->first();
            $imagenes = Imagenes::where("fk_resultado",$lista->id)->get();
            foreach ($imagenes as $img) {
                $lista_imagenes[] =[
                    "ruta_imagen"=>$img->ruta_imagen//transformas base64
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
        $comunidad = Comunidad::where("external_comunidad",$external_comunidad)->first();
        if($comunidad){
            $actividad = Actividades::where("estado",1)->where("fk_comunidad",$comunidad->id)->first();
            if($actividad){
                $detActividad = DetalleActividad::where("fk_actividades", $actividad->id)->first();
                $listas = Resultado::where("estado",1)->where("fk_det_actividad",$detActividad->id)->get();
                if($listas){
                    $data = array();
                    foreach ($listas as $lista) {
                        $lista_imagenes=null;
            
                        $imagenes = Imagenes::where("fk_resultado",$lista->id)->get();
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
                }else{
                    self::estadoJson(200, false, 'La comunidad no ha generado resultados');
                }
            }else{
                self::estadoJson(200, false, 'La comunidad no ha planificado actividades');
            }
        }else{
            self::estadoJson(200, false, 'La comunidad no esta registrada');
        }
        return response()->json($datos, $estado);
    }

    public function listarResultadosByEstudiante($external_estudiante){
        global $estado, $datos; 
        self::iniciarObjetoJSon();
        $estudiante = Estudiante::where("external_es",$external_estudiante)->first();
        if($estudiante){
            $miembro = Miembros::where("fk_estudiante",$estudiante->id)->first();
            if($miembro){
                $comunidad = Comunidad::where("id",$miembro->fk_comunidad)->first();
                $actividad = Actividades::where("estado",1)->where("fk_comunidad",$comunidad->id)->first();
                if($actividad){
                    $detActividad = DetalleActividad::where("fk_actividades", $actividad->id)->first();
                    $listas = Resultado::where("estado",1)->where("fk_det_actividad",$detActividad->id)->get();
                    
                    $data = array();
                    foreach ($listas as $lista) {
                        $lista_imagenes=null;
                        $imagenes = Imagenes::where("fk_resultado",$lista->id)->get();
                        foreach ($imagenes as $img) {
                            $lista_imagenes[] =[
                                "ruta_imagen"=>$img->ruta_imagen
                            ];
                        }
                        $datos['data'][] = [
                            "actividad" => $detActividad->nombre_actividad,
                            "resumen_resultado"=>$lista->resumen_resultado,
                            "comunidad"=>$comunidad->nombre_comunidad,
                            "descripcion_resultado"=>$lista->descripcion_resultado,
                            "fecha_inicio"=>$detActividad->fecha_inicio,
                            "fecha_fin"=>$lista->fecha_fin,
                            "imagenes"=>$lista_imagenes,
                            "external_resultado"=>$lista->external_resultado
                        ];
                    }
                    self::estadoJson(200, true, '');
                }else{
                self::estadoJson(200, false, 'La comunidad no ha planificado actividades');
                }
            }else{
                self::estadoJson(200, false, 'El estudiante no es miembro de una comunidad');
            }
        }else{
            self::estadoJson(200, false, 'El estudiante no esta registrado');
        }
        return response()->json($datos, $estado);
    }

    public function listarResultado($external_resultado){
        global $estado, $datos; 
        self::iniciarObjetoJSon();

        $resultado = Resultado::where("external_resultado",$external_resultado)->first();
        if($resultado){
            $detActividad = DetalleActividad::where("id", $resultado->fk_det_actividad)->first();
            $actividad = Actividades::where("id",$detActividad->fk_actividades)->first();
            $comunidad = Comunidad::where("id",$actividad->fk_comunidad)->first();
            
            $imagenes = Imagenes::where("fk_resultado",$resultado->id)->get();
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
        }else{
            self::estadoJson(200, false, 'El resultado no esta registrado');
        }   
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