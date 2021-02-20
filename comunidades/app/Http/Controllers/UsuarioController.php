<?php

namespace App\Http\Controllers;

use App\Models\usuario;
use App\Models\estudiante;
use App\Models\docente;


use Illuminate\Http\Request;

class UsuarioController extends Controller
{

    //REGISTRO DE USUARIO
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
    //0 inactivo, 1 docente, 2 gestor, 3 secretaria, 4 Decano
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
                $docente->external_do = "Es" . Utilidades\UUID::v4();
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
        if ($request->json()) {
            try {
                $data = $request->json()->all();
                $clave = sha1($data["clave"] . "unl.");

                $usuario = usuario::where("correo", "=", $data["correo"])
                    ->where("clave", "=", $clave)
                    ->where("estado", 1)->first();
                if ($usuario) {
                        return response()->json([
                            "correo" => $usuario->correo,
                            "tipoUsuario" => $usuario->tipoUsuario,
                            "external_us" => $usuario->external_us,
                            "mensaje" => "Operacion exitosa", "siglas" => "OE"
                        ], 200);
                    
                    
                }else{
                return response()->json(["mensaje"=>"Datos incorrectos", "siglas"=>"DI"],400);

                }
            } catch (\Exception $e) {
                return response()->json(["mensaje"=>"faltan datos", "siglas"=>"FD"],400);
            }
        }
    }

    //DATOS PERFIL ESTUDIANTE
    public function datosEstudiante($external_id)
    {
        $estudianteObj = usuario::where("external_us", $external_id)->first();

        if ($estudianteObj) {
            $estudiante = estudiante::where("fk_usuario","=", $estudianteObj->id)->get();
            
            $data = array();
            foreach ($estudiante as $item) {
                $data[]= [
                    "nombres" => $item->nombres,
                    "apellidos" => $item->apellidos,
                    "ciclo" => $item->ciclo,
                    "external_estudiante" => $item->external_es,
                    "external_usuario" => $estudianteObj->external_us
                ];
                return response()->json($data,200);
            }
        }
    }

    public function datosDocente($external_id)
    {
        $docenteObj = usuario::where("external_us", $external_id)->first();

        if ($docenteObj) {
            $docente = docente::where("fk_usuario","=", $docenteObj->id)->get();
            
            $data = array();
            foreach ($docente as $item) {
                $data[]= [
                    "nombres" => $item->nombres,
                    "apellidos" => $item->apellidos,
                    "tipo_docente" => $item->tipo_docente,  //1 docente, 2 gestor
                    "external_docente" => $item->external_do,
                    "external_usuario" => $docenteObj->external_us
                ];
                return response()->json($data,200);
            }
        }
        else{
            return response()->json(["mensaje"=>"Datos no encontrados", "siglas"=>"DNE"],400);

        }
    }

    public function listarDocentes(){
        $listas = docente::where("estado",1)->get();

        $data = array();
        foreach ($listas as $lista) {
            $data[] = [
                "nombres" => $lista->nombres,
                    "apellidos" => $lista->apellidos,
                    "tipo_docente" => $lista->tipo_docente,  //1 docente, 2 gestor
                    "external_docente" => $lista->external_do,
                    "external_usuario" => $lista->usuario->external_us
            ];
        }
        return response()->json($data,200);
    }

}
