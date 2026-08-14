@php
    $role = auth()->user()?->role;
@endphp

<nav @class([
    'navbar navbar-expand-lg navbar-dark',

    'bg-danger' => $role === \App\Enums\RoleEnum::ADMIN->value,

    'bg-primary' => $role === \App\Enums\RoleEnum::STUDENT->value,

    'bg-dark' => $role === \App\Enums\RoleEnum::TEACHER->value,

    'bg-secondary' => $role === null,
])>
    <div class="container-fluid">
        <a class="navbar-brand"> <i class="fa-solid fa-school-flag"></i> POP
            School</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                @auth
                    @if (auth()->user()->role === \App\Enums\RoleEnum::STUDENT->value)
                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('students.my-academic-profile') ? 'active' : '' }}"
                                aria-current="page" href="{{ route('students.my-academic-profile') }}">
                                My Academic Profile </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('students.my-grades') ? 'active' : '' }}"
                                aria-current="page" href="{{ route('students.my-grades') }}">
                                My Grades </a>
                        </li>
                    @elseif (auth()->user()->role === \App\Enums\RoleEnum::TEACHER->value)
                        <a class="nav-link {{ request()->routeIs('teacher.assigned-exams') ? 'active' : '' }}"
                            aria-current="page" href="{{ route('teacher.assigned-exams') }}">
                            <i class="fa-solid fa-folder-tree"></i> Exams
                        </a>

                        <a class="nav-link {{ request()->routeIs('teacher.students.index') ? 'active' : '' }}"
                            aria-current="page" href="{{ route('teacher.students.index') }}">
                            <i class="fa-solid fa-user-graduate"></i> Students
                        </a>

                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('teacher.class-performance.index') ? 'active' : '' }}"
                                href="{{ route('teacher.class-performance.index') }}">
                                <i class="fa-solid fa-magnifying-glass-chart"></i> Class
                                Performance</a>
                        </li>
                    @else
                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('enrollments.*') ? 'active' : '' }}"
                                aria-current="page" href="{{ route('enrollments.index') }}">
                                <i class="fa-solid fa-person-circle-plus"></i> Enrollments </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('students.*') ? 'active' : '' }}"
                                href="{{ route('students.index') }}"><i class="fa-solid fa-user-graduate"></i> Students</a>
                        </li>


                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('exams.*') ? 'active' : '' }}"
                                href="{{ route('exams.index') }}"><i class="fa-solid fa-clipboard-check"></i> Exams</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link  {{ request()->routeIs('class-performance.*') ? 'active' : '' }}"
                                href="{{ route('class-performance.index') }}"> <i class="fa-solid fa-chalkboard-user"></i>
                                Class
                                Performance</a>
                        </li>
                    @endif
                @endauth



            </ul>
            <span class="navbar-text">

                @guest

                    <a class="nav-link  {{ request()->routeIs('login.*') ? 'active' : '' }}" href="{{ route('login') }}">
                        Login</a>

                @endguest


                @auth

                    <span class="text-warning">
                        <i class="fa-solid fa-circle-user"></i> {{ auth()->user()->role }} | {{ auth()->user()->email }}

                    </span>


                    <form action="{{ route('logout') }}" method="post">
                        @csrf
                        <button class="nav-link text-warning" type="submit">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout </button>
                    </form>

                @endauth




            </span>
        </div>
    </div>
</nav>
