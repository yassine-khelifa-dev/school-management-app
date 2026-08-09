<nav class="navbar navbar-expand-lg   navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('enrollments.index') }}">POP School</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link  {{ request()->routeIs('enrollments.*') ? 'active' : '' }}" aria-current="page"
                        href="{{ route('enrollments.index') }}">Enrollments</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link  {{ request()->routeIs('exams.*') ? 'active' : '' }}"
                        href="{{ route('exams.index') }}">Exams</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link  {{ request()->routeIs('class-performance.*') ? 'active' : '' }}"
                        href="{{ route('class-performance.index') }}">Class Performance</a>
                </li>


            </ul>
            <span class="navbar-text">
                Login
            </span>
        </div>
    </div>
</nav>
