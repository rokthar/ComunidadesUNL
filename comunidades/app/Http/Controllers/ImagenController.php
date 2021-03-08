<?php
namespace App\Http\Controllers;
use App\Models\vinculacion;
use App\Models\comunidad;

use Illuminate\Http\Request;

//estado 0 Inactivo | 1 Activado | 2 En espera
class ImagenController extends Controller{


    public function subirImagen(Request $request, $external_comunidad){
  
        $file = $request->file('file');
        $ruta= '../imagenes/comunidad';
        $image_name = time().$file->getClientOriginalName();
        //var_dump(json_encode($file)); -> ver que me devuelve
        $file->move($ruta, $image_name);
        $comunidades = comunidad::where("external_comunidad",$external_comunidad)->first();
        $comunidades->ruta_logo = $image_name;
        $comunidades->save();
        return response()->json(["mensaje"=>"Operacion existosa","nombre_imagen" => $image_name, "siglas"=>"OE"], 200);
    }

}