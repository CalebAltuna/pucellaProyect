<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class gastuakController extends Controller
{
    //

    public function zureGasutak(){
                // lortu user-aren pisuak
        $pisuak = Pisua::where('user_id', Auth::id())->get();

        return Inertia::render('myGastuak', [
            'gastuak' => $gastuak
        ]);
    }


    }



