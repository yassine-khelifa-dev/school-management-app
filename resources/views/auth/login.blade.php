@extends('welcome')
@section('title', 'Login')
@section('content')

    <div class="container">


        <h2 class="text-primary mt-2">Login</h2>


        @if ($errors->any())
            <ul>
                @foreach ($errors->all() as $error)
                    <li class="text-danger"> {{ $error }}</li>
                @endforeach
            </ul>
        @endif

        <form method="POST" action="{{ route('login.store') }}">
            @csrf
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" name="email" id="email"
                    value="{{ old('email', request('email')) }}">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password">
            </div>

            <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="remember" name="remember" value="1"
                    @checked(old('remember', request('remember')))>
                <label class="form-check-label" for="remember">Remember me</label>
            </div>

            <button type="submit" class="btn btn-primary mt-2">Submit</button>
        </form>

    </div>



@endsection
