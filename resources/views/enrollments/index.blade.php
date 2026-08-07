<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <title>Enrollment Index</title>
</head>

<body>

    <div class="container">

        <h1 class="text-primary">Enrollments</h1>
        <div class="border border-danger p-3 my-2">
            <h2 class="text-danger">Filtre</h2>

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

        <table class="table table-dark table-striped">
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
    </script>
</body>

</html>
