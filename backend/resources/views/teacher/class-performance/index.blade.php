@extends('welcome')
@section('title', 'Class Performance')
@section('content')
    <div class="container">

        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Class Performance</h2>
        </div>


        {{-- show form's errors --}}
        @if ($errors->any())
            @foreach ($errors->all() as $error)
                <div class="alert alert-danger" role="alert">
                    {{ $error }}
                </div>
            @endforeach
        @endif


        {{-- Filter --}}

        @php
            $filterActive =
                (request()->filled('school_class') &&
                    request()->filled('subject') &&
                    request()->filled('academic_year')) ||
                request()->filled('q_field_sorted') ||
                request()->filled('q_dir_sorted');
        @endphp



        <form action="{{ route('teacher.class-performance.index') }}" method="GET">
            <div class="border border-primary p-3">
                <div class="row ">

                    <div class="col-md-4">
                        <label for="school_class" class="form-label">School Class</label>
                        <select class="form-select form-select-lg" name="school_class" id="school_class">
                            <option >Open this select school class ...</option>
                            @foreach ($school_classes as $school_class)
                                <option value="{{ $school_class->id }}" @selected(old('school_class', request('school_class')) == $school_class->id)>
                                    {{ $school_class->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="subject" class="form-label">Subject</label>
                        <select class="form-select form-select-lg" name="subject" id="subject">
                            <option >Open this select subject...</option>
                            @foreach ($subjects as $subject)
                                <option value="{{ $subject->id }}" @selected(old('subject', request('subject')) == $subject->id)>
                                    {{ $subject->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="academic_year" class="form-label">Academic Year</label>
                        <select class="form-select form-select-lg" name="academic_year" id="academic_year">
                            <option >Open this select academic year ...</option>
                            @foreach ($academic_years as $year)
                                <option value="{{ $year->id }}" @selected(old('academic_year', request('academic_year')) == $year->id)>
                                    {{ $year->name }}</option>
                            @endforeach
                        </select>
                    </div>

                </div>

                <div class="row">
                    <div class="col-md-4">
                        <div class="mt-3">
                            <label for="q_field_sorted" class="form-label">Field Sorted</label>
                            <select class="form-select" id="q_field_sorted" name="q_field_sorted">
                                <option value="">field sorted ...</option>
                                <option value="average_percentage" @selected(old('q_field_sorted', request('q_field_sorted')) == 'average_percentage')> Average Percentage
                                </option>
                                <option value="first_name" @selected(old('q_field_sorted', request('q_field_sorted')) == 'first_name')>First Name </option>
                                <option value="last_name" @selected(old('q_field_sorted', request('q_field_sorted')) == 'last_name')>Last Name </option>
                                <option value="exams_count" @selected(old('q_field_sorted', request('q_field_sorted')) == 'exams_count')>Exams Count</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mt-3">
                            <label for="q_dir_sorted" class="form-label">Direction</label>
                            <select class="form-select" id="q_dir_sorted" name="q_dir_sorted">
                                <option value="">direction sorted ...</option>
                                <option value="asc" @selected(old('q_dir_sorted', request('q_dir_sorted')) == 'asc')> ASC </option>
                                <option value="desc" @selected(old('q_dir_sorted', request('q_dir_sorted')) == 'desc')> DESC </option>
                            </select>
                        </div>

                    </div>
                    <div class="col-md-4 my-auto end-full">
                        <div class="d-flex flex-row-reverse gap-2">

                            @if ($filterActive)
                                <a href="{{ route('teacher.class-performance.index') }}" class="btn btn-primary">
                                    Reset
                                </a>
                            @endif

                            <button type="submit" class="btn btn-success">Valide</button>
                        </div>
                    </div>
                </div>
            </div>

        </form>






        <div class="row g-3 my-3">
            <div class="col-md">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Students</h6>
                        <h3>{{ $stats['students_count'] }}</h3>
                    </div>
                </div>
            </div>

            <div class="col-md">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Class Average</h6>
                        <h3>{{ number_format($stats['class_average'], 1) }}%</h3>
                    </div>
                </div>
            </div>

            <div class="col-md">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Highest Average</h6>
                        <h3>{{ number_format($stats['highest_average'], 1) }}%</h3>
                    </div>
                </div>
            </div>

            <div class="col-md">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Lowest Average</h6>
                        <h3>{{ number_format($stats['lowest_average'], 1) }}%</h3>
                    </div>
                </div>
            </div>

            <div class="col-md">
                <div class="card text-center">
                    <div class="card-body">
                        <h6 class="card-title">Total Exams</h6>
                        <h3>{{ $stats['total_exam_attempts'] }}</h3>
                    </div>
                </div>
            </div>

        </div>


        @if ($filterActive)
            <div class="container">
                <table class=" table table-striped  text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">student full name</th>
                            <th scope="col">student email</th>
                            <th scope="col">number of exams taken</th>
                            <th scope="col"> average score </th>
                            <th scope="col"> highest score </th>
                            <th scope="col"> lowest score </th>

                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($students as $student)
                            <tr>
                                <th scope="row">{{ $student->id }}</th>
                                <td>{{ $student->full_name }}</td>
                                <td>{{ $student->user->email }}</td>
                                <td>{{ $student->exams_count }}</td>

                                <td>{{ number_format($student->average_percentage, 2, '.', ',') }}%
                                </td>
                                <td>{{ $student->grades_max_score }}</td>
                                <td>{{ $student->grades_min_score }}</td>

                            </tr>
                        @endforeach

                    </tbody>
                </table>
                {{ $students->links() }}

            </div>
        @endif

    </div>
@endsection
