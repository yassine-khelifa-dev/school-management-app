@extends('welcome')
@section('title', 'Students')

@section('content')
    <div class="container">


        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Students</h2>
        </div>


        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif



        {{-- Table  --}}
        <div>
            <table class="table table-striped ">
                <thead>
                    <tr>

                        <th scope="col"> ID </th>
                        <th scope="col"> Full Name </th>
                        <th scope="col"> Email </th>
                        <th scope="col"> Action </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($students as $student)
                        <tr>
                            <th scope="row">{{ $student->id }}</th>
                            <td>{{ $student->full_name }}</td>
                            <td>{{ $student->user->email }}</td>
                            <td>
                                <a href="{{ route('students.academic-profile', $student->id) }}" class="btn btn-danger">
                                    Academic Profile</a>

                            </td>
                        </tr>
                    @endforeach

                </tbody>
            </table>
            {{ $students->links() }}
        </div>
    </div>
@endsection
