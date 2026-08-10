<nav class="navbar navbar-expand-lg   navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('enrollments.index') }}"> <i class="fa-solid fa-school-flag"></i> POP
            School</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link  {{ request()->routeIs('enrollments.*') ? 'active' : '' }}" aria-current="page"
                        href="{{ route('enrollments.index') }}">
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
                        href="{{ route('class-performance.index') }}"> <i class="fa-solid fa-chalkboard-user"></i> Class
                        Performance</a>
                </li>


            </ul>
            <span class="navbar-text">
                <a class="nav-link  {{ request()->routeIs('login.*') ? 'active' : '' }}" href="{{ route('login') }}">
                    Login</a>
            </span>
        </div>
    </div>
</nav>
