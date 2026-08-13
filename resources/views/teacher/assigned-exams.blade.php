@extends('welcome')
@section('title', 'Assigned Exams')

@section('content')
    <div class="container">


        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Assigned Exams</h2>
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

        {{-- Filter --}}
        <div class="border border-primary p-3 mb-2">
            <h4 class="text-dark">Filtre</h4>



            <form id="exam-filter-form" method="GET" action="{{ route('teacher.assigned-exams') }}">
                <div class="row">
                    <div class="col-md-4">
                        <label for="school_class" class="form-label">School Class</label>
                        <select class="form-select form-select-lg" name="school_class" id="school_class">
                            <option value="">Open this select school class ...</option>
                            @foreach ($school_classes as $school_class)
                                <option value="{{ $school_class->id }}" @selected(old('school_class', request('school_class')) == $school_class->id)>
                                    {{ $school_class->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="subject" class="form-label">Subject</label>
                        <select class="form-select form-select-lg" name="subject" id="subject">
                            <option value="">Open this select subject...</option>
                            @foreach ($subjects as $subject)
                                <option value="{{ $subject->id }}" @selected(old('subject', request('subject')) == $subject->id)>
                                    {{ $subject->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="academic_year" class="form-label">Academic Year</label>
                        <select class="form-select form-select-lg" name="academic_year" id="academic_year">
                            <option value="">Open this select academic year ...</option>
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
                                <option value="title_exam" @selected(old('q_field_sorted', request('q_field_sorted')) == 'title_exam')>Title Exam </option>
                                <option value="exam_date" @selected(old('q_field_sorted', request('q_field_sorted')) == 'exam_date')>Exam Date </option>
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

                            <button type="submit" form="exam-filter-form" class="btn btn-success">Valide</button>


                            <a href="{{ route('teacher.assigned-exams') }}" class="btn btn-primary">Reset</a>
                        </div>
                    </div>
                </div>
            </form>

        </div>

        {{-- Table  --}}
        <div>
            <table class="table table-striped ">
                <thead>
                    <tr>

                        <th scope="col"> Exam ID </th>
                        <th scope="col"> Exam Title </th>
                        <th scope="col"> Subject </th>
                        <th scope="col"> School Class </th>
                        <th scope="col"> Academic Year </th>
                        <th scope="col"> Exam Date </th>
                        <th scope="col"> Maximum Score </th>
                        <th scope="col"> Action </th>

                    </tr>
                </thead>
                <tbody>
                    @foreach ($exams as $exam)
                        <tr>
                            <th scope="row">{{ $exam->id }}</th>
                            <td>{{ $exam->title }}</td>
                            <td>{{ $exam->teachingAssignment->subject->name }}</td>
                            <td>{{ $exam->teachingAssignment->schoolClass->name }}</td>
                            <td>{{ $exam->teachingAssignment->academicYear->name }}</td>
                            <td>{{ $exam->exam_date }}</td>
                            <td class="text-center">{{ $exam->maximum_score }}</td>
                            <td>

                                @can('manageGrades', $exam)
                                    <a href="{{ route('teacher.assigned-exams.grades', $exam->id) }}" class="btn btn-danger">
                                        Manage Grades
                                    </a>
                                @else
                                    <a class="btn btn-danger disabled" aria-disabled="true">
                                        Manage Grades
                                    </a>
                                @endcan



                            </td>
                        </tr>
                    @endforeach

                </tbody>
            </table>
            {{ $exams->links() }}
        </div>
    </div>
@endsection
