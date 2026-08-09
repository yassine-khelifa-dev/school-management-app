@extends('welcome')
@section('title', 'Enrollments')
@section('content')
    <div class="container">

        <div class="d-flex justify-content-between p-2">
            <h2 class="text-primary mt-3">Enrollments</h2>
        </div>


        <div class="border border-primary p-3 my-2">
            <h4 class="text-dark">Filtre</h4>

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="row mx-2">
                <x-_filtre_enroll :academic-years="$academicYears" :school-classes="$schoolClasses" />
            </div>
        </div>

        <table class="table table-striped ">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Student</th>
                    <th scope="col">Student Email</th>
                    <th scope="col">Class</th>
                    <th scope="col">Academic Year</th>
                    <th scope="col">Enrolled at</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($enrollments as $enrollment)
                    <tr @class(['table-danger' => $enrollment->status == 'cancelled'])>
                        <th scope="row">{{ $enrollment->id }}</th>
                        <td>{{ $enrollment->student->full_name }}</td>
                        <td>{{ $enrollment->student->user->email }}</td>
                        <td>{{ $enrollment->schoolClass->name }}</td>
                        <td>{{ $enrollment->academicYear->name }}</td>
                        <td>{{ $enrollment->enrolled_at->format('d/m/Y') }}</td>
                        <td>{{ $enrollment->status }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            No results found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        {{ $enrollments->links() }}

    </div>
@endsection
