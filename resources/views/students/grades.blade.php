@extends('welcome')
@section('title', 'Student Grades')

@section('content')
    <div class="container">


        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Student Grades</h2>
        </div>



        <div class="row">

            <div class="col-md-6">
                <div class="card" style="width: 18rem;">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"> ID : {{ $student->id }}</li>
                        <li class="list-group-item"> Full name : {{ $student->full_name }}</li>
                        <li class="list-group-item"> Email : {{ $student->user->email }}</li>
                    </ul>
                </div>
            </div>




            {{-- Grade History --}}
            <div class="col-md-12 m-2">
                <div class="d-flex justify-content-between p-2">
                    <h3>Grade History</h3>
                    <a href="{{ url()->previous() }}" class="btn btn-primary m-2">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                </div>
                @if (count($grades) == 0)
                    <div class="alert alert-warning" role="alert">
                        No grade history found for this student.
                    </div>
                @else
                    <table class="table table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">Exam Title</th>
                                <th scope="col">Subject</th>
                                <th scope="col">School Class</th>
                                <th scope="col">Academic Year</th>
                                <th scope="col">Exam Date</th>
                                <th scope="col">Score</th>
                                <th scope="col">Maximum Score</th>
                                <th scope="col">Percentage</th>

                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($grades as $grade)
                                <tr>
                                    <th scope="row">{{ $grade->exam->title }}</th>
                                    <th scope="row">{{ $grade->exam->teachingAssignment->subject->name }}</th>
                                    <th scope="row">{{ $grade->exam->teachingAssignment->schoolClass->name }}</th>
                                    <th scope="row">{{ $grade->exam->teachingAssignment->academicYear->name }}</th>
                                    <th scope="row">{{ $grade->exam->exam_date }}</th>
                                    <th scope="row">{{ $grade->score }}</th>
                                    <th scope="row">{{ $grade->exam->maximum_score }}</th>

                                    @php
                                        $percentage = ($grade->score / $grade->exam->maximum_score ?? 1 ) * 100;
                                    @endphp
                                    <th scope="row">{{ $percentage }} %</th>


                                </tr>
                            @endforeach


                        </tbody>
                    </table>
                @endif
            </div>
        </div>






    </div>
@endsection
