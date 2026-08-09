<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <title>Exam Grades</title>
</head>

<body>
    <div class="container">

        <div class="d-flex justify-content-between p-2">
            <h1 class="text-primary">Exam Grades</h1>
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
            <div class="col-md-8">
                <h3>Students</h3>
                @if (count($students) == 0)
                    <div class="alert alert-warning" role="alert">
                        No students are enrolled in this class for this academic year.
                    </div>
                @else
                    <table class="table">
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
                            @foreach ($students as $student)
                                <tr>
                                    <th scope="row">{{ $student->id }}</th>
                                    <td>{{ $student->full_name }}</td>
                                    <td>{{ $student->user->email }}</td>
                                    <td>{{ $students_grades->get($student->id) ?? '-' }}</td>
                                    <td>{{ $students_grades->get($student->id) !== null ? 'Graded' : 'Not graded' }}
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @endif
            </div>
        </div>
    </div>
</body>

</html>
