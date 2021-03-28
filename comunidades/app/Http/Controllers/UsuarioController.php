<?php

namespace App\Http\Controllers;

use App\Models\usuario;
use App\Models\estudiante;
use App\Models\docente;
use App\Http\Controllers\MailController;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    private $estado = 400;
    private $datos = [];

    //REGISTRO DE USUARIO
    //1 docente | 2 estudiante
    public function RegistrarUsuario(Request $request)
    {
        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = new usuario();
            $usuario->correo = $data["correo"];
            $clave = sha1($data["clave"] . "unl.");
            $usuario->clave = $clave;
            $usuario->tipoUsuario = $data["tipo"];
            $usuario->estado = 1;
            $usuario->external_us = "UuA" . Utilidades\UUID::v4();

            $usuario->save();
            return response()->json(["mensaje" => "Operacion existosa", "siglas" => "OE"], 200);
            
        } else {
            return response()->json(["mensaje" => "La data no tiene el formato deseado", "siglas" => "DNF"], 400);
        }
    }

    //REGISTRO DE ESTUDIANTE

    public function RegistrarEstudiante(Request $request, $external_id)
    {
        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = usuario::where("external_us", $external_id)->first();
            
            if ($usuario->tipoUsuario == 2) {
                $persona = new estudiante();
                $persona->nombres = $data["nombres"];
                $persona->apellidos = $data["apellidos"];
                $persona->ciclo = $data["ciclo"];
                $persona->paralelo = $data["paralelo"];
                $persona->estado = 1;
                $persona->fk_usuario = $usuario->id;
                $persona->external_es = "Es" . Utilidades\UUID::v4();
                $persona->save();
                return response()->json(["mensaje" => "Operacion existosa", "siglas" => "OE"], 200);
            }
        } else {
            return response()->json(["mensaje" => "La data no tiene el formato deseado", "siglas" => "DNF"], 400);
        }
    }

    //REGISTRO DE DOCENTE
    //0 inactivo, 1 docente, 2 gestor, 3 secretaria, 4 Decano, 5 tutor
    public function RegistrarDocente(Request $request, $external_id)
    {
        if ($request->json()) {
            $data = $request->json()->all();
            $usuario = usuario::where("external_us", $external_id)->first();
            if ($usuario->tipoUsuario == 1) {
                $docente = new docente();
                $docente->nombres = $data["nombres"];
                $docente->apellidos = $data["apellidos"];
                $docente->tipoDocente = $data['tipo_docente'];
                $docente->estado = 1;
                $docente->fk_usuario = $usuario->id;
                $docente->external_do = "Doc" . Utilidades\UUID::v4();
                $docente->save();
                return response()->json(["mensaje" => "Operacion existosa", "siglas" => "OE"], 200);
            }
        } else {
            return response()->json(["mensaje" => "La data no tiene el formato deseado", "siglas" => "DNF"], 400);
        }
    }

    //REGISTRO DE LOGIN
    public function login(Request $request)
    {
        global $estado, $datos;
        $datos['data'] = null;
        $datos['sucess'] = 'false';
        $datos['mensaje'] = '';
        if ($request->json()) {
            try {
                $data = $request->json()->all();
                $clave = sha1($data["clave"] . "unl.");

                $usuario = usuario::where("correo", "=", $data["correo"])
                    ->where("clave", "=", $clave)
                    ->where("estado", 1)->first();
                if ($usuario) {
                    
                        $datos['data'] = [
                            "correo" => $usuario->correo,
                            "tipoUsuario" => $usuario->tipoUsuario,
                            "external_us" => $usuario->external_us,
                            "siglas"=>"OE"
                        ];
                        self::estadoJson(200, true, '');
                }else{
                    $datos['data'] = [
                        "siglas"=>"UNE"
                    ];
                    self::estadoJson(200, true, 'Datos Incorrectos');
                }
            } catch (\Exception $e) {
                $datos['data'] = [
                    "siglas"=>"UNE"
                ];
                self::estadoJson(400, false, 'Datos Incorrectos');
                
            }
            return response()->json($datos, $estado);
        }
    }

    //DATOS PERFIL ESTUDIANTE
    public function datosEstudiante($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $estudianteObj = usuario::where("external_us", $external_id)->first();

        if ($estudianteObj) {
            $estudiante = estudiante::where("fk_usuario", $estudianteObj->id)->first();
            if($estudiante){
                $datos['data']= [
                    "nombres" => $estudiante->nombres,
                    "apellidos" => $estudiante->apellidos,
                    "ciclo" => $estudiante->ciclo,
                    "paralelo" => $estudiante->paralelo,
                    "estado"=>$estudiante->estado,
                    "external_estudiante" => $estudiante->external_es,
                    "external_usuario" => $estudianteObj->external_us
                ];
                self::estadoJson(200, true, '');
            }else{
                self::estadoJson(400, false, 'Datos Incorrectos');
            }
            }else{
                self::estadoJson(400, false, 'Datos Incorrectos');
            } 
        return response()->json($datos, $estado);
    }

    public function datosDocente($external_id)
    {
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $docenteObj = usuario::where("external_us", $external_id)->first();

        if ($docenteObj) {
            $docente = docente::where("fk_usuario", $docenteObj->id)->first();
            
            $data = array();
            if ($docente) {
                $datos['data']= [
                    "correo"=>$docenteObj->correo,
                    "nombres" => $docente->nombres,
                    "apellidos" => $docente->apellidos,
                    "tipo_docente" => $docente->tipoDocente, 
                    "external_docente" => $docente->external_do,
                    "external_usuario" => $docenteObj->external_us
                ];
                self::estadoJson(200, true, '');
            }else{
                self::estadoJson(400, false, 'Datos Incorrectos');
            }
        }
        else{
            self::estadoJson(400, false, 'Datos Incorrectos');
        }
        return response()->json($datos, $estado);
    }

    public function listarDocentes(){
        global $estado, $datos;
        self::iniciarObjetoJSon();
        $listas = docente::where("estado",1)->get();

        $data = array();
        foreach ($listas as $lista) {
            $usuario = usuario::where("id", $lista->fk_usuario)->first();
            $datos['data'][] = [
                "nombres" => $lista->nombres,
                "apellidos" => $lista->apellidos,
                "tipo_docente" => $lista->tipoDocente,  //1 docente, 2 gestor
                "external_docente" => $lista->external_do,
                "external_usuario" => $usuario->external_us
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
