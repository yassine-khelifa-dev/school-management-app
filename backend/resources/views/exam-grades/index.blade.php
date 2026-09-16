@extends('welcome')
@section('title', 'Exam Grades')
@section('content')

    <body>
        <div class="container">

            <div class="d-flex justify-content-between p-2">
                <h2 class="text-primary mt-3">Exam Grades</h2>
                <a href="{{ url()->previous() }}" class="btn btn-primary m-2">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
            </div>
            <div class="row">
                {{-- Infor Exam --}}
                <div class="col-md-3">
                    <div class="card" style="width: 18rem;">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"> Exam ID: <span class="text-primary"> {{ $exam->id }} </span>
                            </li>
                            <li class="list-group-item"> Exam Title: <span class="text-primary"> {{ $exam->title }} </span>
                            </li>
                            <li class="list-group-item"> Subject: <span class="text-primary">
                                    {{ $exam->teachingAssignment->subject->name }} </span></li>
                            <li class="list-group-item"> School Class: <span class="text-primary">
                                    {{ $exam->teachingAssignment->schoolClass->name }}
                                </span></li>
                            <li class="list-group-item"> Academic Year: <span class="text-primary">
                                    {{ $exam->teachingAssignment->academicYear->name }} </span>
                            </li>
                            <li class="list-group-item"> Exam Date: <span class="text-primary"> {{ $exam->exam_date }}
                                </span></li>
                            <li class="list-group-item"> Maximum Score: <span class="text-primary">
                                    {{ $exam->maximum_score }}
                                </span></li>
                            <li class="list-group-item"> Teacher Full Name:
                                <span class="text-primary">
                                    {{ $exam->teachingAssignment->teacher->first_name . ' ' . $exam->teachingAssignment->teacher->last_name }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                {{-- students --}}
                <div class="col-md-8 m-2">
                    <form action="{{ route('exams-grades.store', $exam->id) }}" method="post">
                        @csrf
                        <div class="d-flex justify-content-between p-2">
                            <h3>Students</h3>
                            <button class="btn btn-success " @disabled($students->isEmpty())>Submit Scores</button>
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

                        @if (session('success'))
                            <div class="alert alert-success">
                                {{ session('success') }}
                            </div>
                        @endif

                        @if (session('warning'))
                            <div class="alert alert-dark">
                                {{ session('warning') }}
                            </div>
                        @endif

                        @if (count($students) == 0)
                            <div class="alert alert-warning" role="alert">
                                No students are enrolled in this class for this academic year.
                            </div>
                        @else
                            <table class="table table-striped ">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Student Full Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Current Score</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($students as $index => $student)
                                        @php
                                            $grade = $student->grades->first()?->score;

                                        @endphp
                                        <tr>
                                            <th scope="row">{{ $student->id }}</th>
                                            <td>{{ $student->full_name }}</td>
                                            <td>{{ $student->user->email }}</td>
                                            <td @class(['bg-danger-subtle' => $grade === null])>
                                                <div class="input-group mb-3">
                                                    <span class="input-group-text">%</span>

                                                    <input type="number" class="form-control"
                                                        name="scores[{{ $index }}][score]"
                                                        value="{{ $grade }}" />

                                                    <input type="hidden" class="form-control"
                                                        name="scores[{{ $index }}][student_id]"
                                                        value="{{ $student->id }}" />
                                                </div>
                                            </td>
                                            <td>{{ $grade !== null ? 'Graded' : 'Not graded' }}
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        @endif
                    </form>
                </div>
            </div>
        </div>
    @endsection
