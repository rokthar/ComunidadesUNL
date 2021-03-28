<?php
namespace App\Http\Controllers;
use App\Models\comunidad;
use App\Models\docente;
use App\Models\miembros;
use App\Models\estudiante;
use App\Models\actividades;
use App\Models\detalleActividad;
use App\Models\resultado;
use App\Models\vinculacion;
use App\Http\Controllers\MailController;

use Illuminate\Http\Request;


//estado 0 Inactivo | 1 Activado | 2 revision Gestor | 3 revision secretaria | 4 en espera
class ComunidadController extends Controller{

    public function RegistrarComuidad(Request $request, $external_docente){
            $enviar = new MailController();
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
                    
                    $enviar->enviarMail("Secretaria","Solicitud para la creacion de una Comunidad","Ha sido enviada una nueva solicitud para la creacion de la comunidad ".$data["nombre_comunidad"]);
                    $enviar->enviarMail("Estudiante","Solicitud para la creacion de una Comunidad","Su solicitud para la creacion de la comunidad ".$data["nombre_comunidad"]. " ha sido enviada correctamente
                    debe esperar un aproximado de 3-24 dias para su respuesta");
                    
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
        $codificar = file_get_contents($file);
        $base64 = base64_encode($codificar);
        $file->move($ruta, $image_name);
        $comunidades = comunidad::where("external_comunidad",$external_comunidad)->first();
        $comunidades->ruta_logo = $base64;
        $comunidades->save();
        return response()->json(["mensaje"=>"Operacion existosa","nombre_imagen" => $image_name, "siglas"=>"OE"], 200);
    }

    public function ActivarComunidad ($external_comunidad){
        $enviar = new MailController();
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        $docenteObj = docente::where("id", $comunidadObj->tutor)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 1;
            $comunidad->save();
            //tipoDocente: 1 docente | 2 gestor | 3 secretaria | 4 Decano | 5 Tutor
            $docenteObj->tipoDocente = 5;
            $docenteObj->save();
            $enviar->enviarMail("Docente","Aprobacion de Solicitud","La comunidad ".$comunidadObj["nombre_comunidad"]." ha sido aprobada");

            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
        }
    }

    public function RechazarComunidad (Request $request, $external_comunidad){
        if ($request->json()){
            $data = $request->json()->all();
        $enviar = new MailController();
        $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
        if($comunidadObj){
            $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
            $comunidad->estado = 0;
            $comunidad->save();
            $enviar->enviarMail("Estudiante","Aprobacion de Solicitud","La comunidad ".$comunidadObj["nombre_comunidad"]." ha sido rechazada. <br> ".$data["comentario"]);
            
            return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
        }else{
            return response()->json(["mensaje"=>"Datos Incorrectos", "siglas"=>"DI"],400);
        }
    }

    public function RevisionInformacion (Request $request,$external_comunidad){
        if ($request->json()){
            $data = $request->json()->all();
            $enviar = new MailController();
            $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
            if($comunidadObj){
                $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
                $comunidad->estado = 3;
                $comunidad->save();
                $enviar->enviarMail("Gestor/a","Solicitud de Comunidad","La solicitud de la comunidad ".$comunidadObj["nombre_comunidad"]." ha sido verificada por la Secretaria <br>".$data["comentario"]);

                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
        }
    }

    public function RevisionGestor (Request $request,$external_comunidad){
        if ($request->json()){
            $data = $request->json()->all();
            $enviar = new MailController();
            $comunidadObj = comunidad::where("external_comunidad", $external_comunidad)->first();
            if($comunidadObj){
                $comunidad = comunidad::where("id", $comunidadObj->id)->first(); //veo si el usuario tiene una persona y obtengo todo el reglon
                $comunidad->estado = 2;
                $comunidad->save();
                $enviar->enviarMail("Decano/a","Solicitud de Comunidad","La solicitud de la comunidad ".$comunidadObj["nombre_comunidad"]." ha sido validada por el Gestor de la Carrera <br> ".$data["comentario"]);

                return response()->json(["mensaje"=>"Operación Exitosa", "siglas"=>"OE"],200);
            }
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
    public function ListarComunidadesVinculacion ($external_comunidad){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = comunidad::where("estado",1)->get();
        
        $data = array();
        foreach ($listas as $lista) {
            $tutor = docente::where("id", $lista->tutor)->first();
            if($lista->external_comunidad == $external_comunidad){

            }else{
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

    public function BuscarComunidadByMiembro($external_estudiante){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudiante = estudiante::where("external_es",$external_estudiante)->first();
        $miembro = miembros::where("fk_estudiante",$estudiante->id)->first();
        $comunidad = comunidad::where("id",$miembro->fk_comunidad)->first();
        $datos['data'] = [
            "nombre_comunidad" => $comunidad->nombre_comunidad,
            "external_comunidad"=>$comunidad->external_comunidad,
            "ruta_logo"=>$comunidad->ruta_logo
        ];
        self::estadoJson(200, true, '');
        return response()->json($datos, $estado);
    }

    public function historialComunidad($external_comunidad){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $data=null;
        $dataRes=null;
        $dataAct=null;
        $comunidad = comunidad::where("external_comunidad",$external_comunidad)->first();
        $miembro = miembros::where("fk_comunidad",$comunidad->id)->get();
        $listas = actividades::where("fk_comunidad",$comunidad->id)->get();
        $vinculaciones = vinculacion::where("fk_comunidad_solicitada",$comunidad->id)->get();
        foreach ($miembro as $item) {
            $data=null;
            $estudiante = estudiante::where("id",$item->fk_estudiante)->first();
            $data[] = [
                "estudiante"=>$estudiante->nombres." ".$estudiante->apellidos,
                "ciclo"=>$estudiante->ciclo,
                "paralelo"=>$estudiante->paralelo
            ];
        }
        foreach($vinculaciones as $vinc){
            $comunidad = comunidad::where("id",$vinc->fk_comunidad_solicitante)->first();
            $dataVinc[]=[
                "fecha_solicitud"=>$vinc->fecha_inicio,
                "comunidad_solicitante"=>$comunidad->nombre_comunidad
            ];
        }
        foreach ($listas as $act) {
            // $dataAct = null;
            $actividades = detalleActividad::where("fk_actividades",$act->id)->get();
            foreach ($actividades as $item) {
                $dataAct[] =[
                    "nombre_actividad"=>$item->nombre_actividad,
                    "descripcion_actividad"=>$item->descripcion_actividad,
                    "fecha_inicio"=>$item->fecha_inicio
                ];
                $resultados = resultado::where("fk_det_actividad",$item->id)->get();
                foreach ($resultados as $res) {
                    if($resultados != null){
                        $dataRes[] = [
                            "resumen_resultado"=>$res->resumen_resultado,
                            "fecha_fin"=>$res->fecha_fin
                        ];
                    }else{
                        $dataRes=null;
                    }
                    
                }
            }
            
        }
        
        $datos['data'] = [
            "miembros" => $data,
            "actividades"=>$dataAct,
            "resultados"=>$dataRes,
            "vinculaciones"=>$dataVinc
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