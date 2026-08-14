@extends('welcome')
@section('title', 'Students')

@section('content')
    <div class="container">


        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Students</h2>
        </div>


        {{--  Filter --}}

        <div class="row border border-primary p-2 mb-2">
            <div>
                <h4 class="text-primary">Filter</h4>
            </div>
            <form id="exam-filter-form" method="GET" action="{{ route('teacher.students.index') }}">
                <div class="row">
                    <div class="col-md-6">
                        <label for="school_class" class="form-label">School Class</label>
                        <select class="form-select form-select-lg" name="school_class" id="school_class">
                            <option value="">Open this select school class ...</option>
                            @foreach ($school_classes as $school_class)
                                <option value="{{ $school_class->id }}" @selected(old('school_class', request('school_class')) == $school_class->id)>
                                    {{ $school_class->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="col-md-6">
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

                <div class="row mt-3">
                    <div class="col-md-12">
                        <div class="d-flex flex-row-reverse gap-2">

                            <button type="submit" form="exam-filter-form" class="btn btn-success">Valide</button>


                            <a href="{{ route('teacher.students.index') }}" class="btn btn-primary">Reset</a>
                        </div>
                    </div>
                </div>
            </form>


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
                        <th scope="col"> Class </th>
                        <th scope="col"> Academic Year </th>


                    </tr>
                </thead>
                <tbody>
                    @foreach ($students as $student)
                        <tr>
                            <th scope="row">{{ $student->id }}</th>
                            <td>{{ $student->full_name }}</td>
                            <td>{{ $student->user->email }}</td>
                            <td>
                                {{ $student->enrollments->pluck('schoolClass.name')->join(', ') }}
                            </td>
                            <td>
                                {{ $student->enrollments->pluck('academicYear.name')->join(', ') }}
                            </td>
                        </tr>
                    @endforeach

                </tbody>
            </table>
            {{ $students->links() }}
        </div>
    </div>
@endsection
