@extends('welcome')
@section('title', 'Login')
@section('content')

    <div class="container">


        <h2 class="text-primary mt-2">Login</h2>

        <form method="POST" action="{{ route('login.store') }}">
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" name="email" id="email" aria-describedby="emailHelp">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password">
            </div>

            <button type="submit" class="btn btn-primary mt-2">Submit</button>
        </form>

    </div>



@endsection
