<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

/* USUARIOS */
$router->post('/usuario/registro', 'UsuarioController@RegistrarUsuario');
$router->post('/usuario/login', 'UsuarioController@login');

/* ESTUDIANTES */
$router->post('/estudiante/registro/{external_id}', 'UsuarioController@RegistrarEstudiante');
$router->get('/estudiante/perfil/{external_id}', 'UsuarioController@datosEstudiante');

/* DOCENTE */
$router->post('/docente/registro/{external_id}', 'UsuarioController@RegistrarDocente');
$router->get('/docente/perfil/{external_id}', 'UsuarioController@datosDocente');
$router->get('/docente/lista', 'UsuarioController@listarDocentes');

// COMUNIDAD
$router->post('/comunidad/registro/{external_docente}', 'ComunidadController@RegistrarComuidad');
$router->post('/comunidad/activar/{external_comunidad}', 'ComunidadController@ActivarComunidad');
$router->post('/comunidad/editar/{external_comunidad}', 'ComunidadController@EditarComunidad');
$router->get('/comunidad/listar/comunidadesactivadas', 'ComunidadController@ListarComunidadesActivadas');
$router->get('/comunidad/listar/comunidadesespera', 'ComunidadController@ListarComunidadesEspera');

//ACTIVIDADES
$router->post('/comunidad/planficaractividades/{external_comunidad}', 'ActividadController@PlanificarActividades');
$router->get('/comunidad/actividadesespera', 'ActividadController@ListarPlanificacionEspera');
$router->get('/comunidad/actividadesactivadas', 'ActividadController@ListarPlanificacionActivada');
$router->post('/comunidad/activaractividad/{external_actividades}', 'ActividadController@ActivarPlanificacion');

//DETALLE ACTIVIDADES
$router->post('/comunidad/detalleactividad/{external_actividad}', 'DetalleActividadController@RegistrarDetallesActividad');
