@extends('welcome')
@section('title', 'Student Academic Profile')

@section('content')
    <div class="container">


        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Student Academic Profile</h2>
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



        <div class="row">

            <div class="col-md-3">
                <div class="card" style="width: 18rem;">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"> ID : {{ $student->id }}</li>
                        <li class="list-group-item"> Full name : {{ $student->full_name }}</li>
                        <li class="list-group-item"> Email : {{ $student->user->email }}</li>
                        <li class="list-group-item"> Mobile : {{ $student->phone }}</li>

                        <li class="list-group-item"> <a href="{{ route('students.grades', $student->id) }}"
                                class="btn btn-success"> View Grade History</a> </li>




                    </ul>
                </div>
            </div>


            {{-- Enrollment History --}}
            <div class="col-md-8 m-2">
                <div class="d-flex justify-content-between p-2">
                    <h3>Enrollment History</h3>
                    <a href="{{ url()->previous() }}" class="btn btn-primary m-2">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                </div>
                @if (count($enrollments) == 0)
                    <div class="alert alert-warning" role="alert">
                        No enrollment history found for this student.
                    </div>
                @else
                    <table class="table table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Academic Year</th>
                                <th scope="col">School Class</th>
                                <th scope="col">Enrollment Date</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($enrollments as $enrollment)
                                <tr>
                                    <th scope="row">{{ $enrollment->id }}</th>
                                    <td>{{ $enrollment->academicYear->name }}</td>
                                    <td>{{ $enrollment->schoolClass->name }}</td>
                                    <td>{{ $enrollment->enrolled_at }}</td>
                                    <td>{{ $enrollment->status }}</td>
                                </tr>
                            @endforeach


                        </tbody>
                    </table>
                @endif
            </div>
        </div>






    </div>
@endsection
