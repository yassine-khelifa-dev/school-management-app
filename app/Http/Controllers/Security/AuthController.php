<?php

namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function login()
    {

        return view('auth.login');
    }

    public function store(Request $request)
    {

        dd($request->all());
    }
}
