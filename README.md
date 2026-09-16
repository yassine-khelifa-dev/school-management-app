# School Management Application

A full-stack school management application built with Laravel and React.

The project focuses on real application concerns rather than simple CRUD screens: role-based access, teacher-scoped data, student enrollment history, exam management, bulk grade management, validation, API security, pagination, filtering, reusable authorization rules, and clean separation between frontend and backend responsibilities.

It is being developed as a portfolio project to demonstrate practical full-stack engineering with Laravel, REST APIs, React, TypeScript, and relational data modeling.

## Project Overview

The application currently supports two main roles:

- Admin
- Teacher

The backend is responsible for authentication, authorization, business rules, validation, database integrity, and API resources.

The frontend provides role-aware interfaces for managing students, enrollments, exams, and grades.

The repository is organized as:

```text
/
├── backend/
└── frontend/
```

A single root README is used because the backend and frontend belong to the same product and are designed to run together.

## Current Features

### Authentication and authorization

- Token-based authentication with Laravel Sanctum
- Login and logout
- Role-aware API access
- Laravel Policies for resource authorization
- Teacher-scoped access to exams and teaching assignments
- Frontend permission helpers for role-aware UI actions
- Backend remains the source of truth for authorization

### Student management

- Student listing
- Student details
- Create, update, and delete flows for administrators
- Enrollment history
- Current enrollment information
- Enrollment count
- Teacher-scoped student access

### Enrollment management

- Student enrollment management
- Academic year and class association
- Validation of enrollment data
- Admin-only mutation endpoints
- Student enrollment history API

### Exam management

- Exam listing with server-side pagination
- Filtering by academic year, class, and subject
- Sorting
- URL-based persistence for pagination and filters
- Exam creation
- Exam editing
- Exam deletion
- Exam details page
- Teacher-scoped exam access
- Teaching-assignment validation
- Protection against deleting exams that already contain grades

### Grade management

Teachers can manage grades for students belonging to the class and academic year associated with an exam.

The grade workflow is designed around the real use case rather than a traditional one-record-at-a-time CRUD interface.

The API returns every eligible student for an exam:

```text
Student with existing grade  -> score
Student without grade         -> null
```

The frontend then provides one grade-management screen where the teacher can:

- View all eligible students
- See existing grades
- Enter new scores
- Update existing scores
- Add or remove comments
- Save multiple grades in one request
- Delete an existing grade
- See graded and ungraded student counts

Grade updates use a bulk upsert workflow with a unique database constraint on:

```text
student_id + exam_id
```

This guarantees that a student cannot have multiple grades for the same exam.

## Engineering Highlights

Some of the main technical decisions in the project include:

- Laravel Policies instead of frontend-only authorization
- Form Requests for validation and authorization
- Eloquent query scopes for reusable teacher ownership rules
- API Resources for controlled response structures
- Database constraints for business invariants
- Bulk `upsert` for efficient grade persistence
- Transactions where multiple database operations must remain atomic
- Eager loading to avoid N+1 queries
- AbortController support for cancellable frontend requests
- Dedicated hooks for list state and mutation state
- Zod schemas shared with React Hook Form
- URL search parameters for persistent list filters
- Explicit loading, success, error, and empty states
- TypeScript contracts that reflect API nullability

## Technology Stack

### Backend

- PHP 8.3+
- Laravel 13
- Laravel Sanctum
- Eloquent ORM
- PHPUnit
- Laravel Pint
- Laravel Pail
- Laravel Debugbar
- Faker
- Mockery

### Frontend

- React 19
- TypeScript 6
- Vite 8
- React Router
- React Hook Form
- Zod
- Material UI
- Axios
- Moment.js
- ESLint

## Architecture

The application follows a REST API architecture.

```text
React / TypeScript
        |
        | HTTP / JSON
        v
Laravel API
        |
        | Policies
        | Form Requests
        | Controllers
        | Resources
        | Eloquent Models / Scopes
        v
Relational Database
```

The frontend is organized around feature responsibilities rather than putting all application logic into page components.

Typical flow:

```text
Page
  -> custom hook
      -> service
          -> API
```

The backend keeps controllers relatively small and delegates responsibility to:

```text
Form Request -> validation / request authorization
Policy       -> resource authorization
Model/Scope  -> reusable query rules
Resource     -> API representation
Database     -> integrity constraints
```

## Example Grade Workflow

An exam belongs to a teaching assignment.

The teaching assignment connects:

```text
Teacher
Subject
School Class
Academic Year
```

Eligible students are resolved through enrollments using the exam's class and academic year.

```text
Exam
  -> Teaching Assignment
      -> School Class
      -> Academic Year
          -> Enrollments
              -> Students
```

Grades are then matched using:

```text
exam_id + student_id
```

A missing grade is represented to the frontend as:

```json
{
  "grade": {
    "id": null,
    "score": null,
    "comment": null,
    "graded_at": null
  }
}
```

This allows the UI to display the whole class without creating empty grade rows in the database.

## Main API Areas

Examples of the current API structure:

```text
POST   /api/login
POST   /api/logout

GET    /api/students
GET    /api/students/{student}
GET    /api/students/{student}/enrollments

GET    /api/exams
GET    /api/exams/filter-options
GET    /api/exams/{exam}
POST   /api/exams
PATCH  /api/exams/{exam}
DELETE /api/exams/{exam}

GET    /api/exam/{exam}/grades
PATCH  /api/exam/{exam}/grades
DELETE /api/exam/{exam}/grades/{grade}

GET    /api/teaching-assignments/options
```

Route names may evolve while the project is being refined.

## Installation

### Requirements

Make sure the following are installed:

```text
PHP 8.3+
Composer
Node.js
npm
A supported relational database
```

## Backend Setup

From the project root:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure your database connection in `.env`.

Example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_app
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

If seeders are available:

```bash
php artisan db:seed
```

Start the API:

```bash
php artisan serve
```

The Laravel development server normally runs at:

```text
http://127.0.0.1:8000
```

### Backend development commands

Run tests:

```bash
php artisan test
```

Run Laravel Pint:

```bash
./vendor/bin/pint
```

Clear application caches when needed:

```bash
php artisan optimize:clear
```

Laravel also provides Composer scripts:

```bash
composer test
composer dev
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite normally runs at:

```text
http://localhost:5173
```

### Frontend commands

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Environment Configuration

The frontend must point to the Laravel API.

If the project uses a Vite environment variable, create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The exact variable name must match the Axios configuration used by the project.

For Sanctum authentication, backend CORS and stateful-domain settings must also match the frontend development URL.

## Running the Full Project

Terminal 1:

```bash
cd backend
php artisan serve
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Security and Data Integrity

The project applies security rules at the API level.

Examples:

- A teacher cannot manage another teacher's exams
- A teacher cannot grade students outside the exam's eligible class and academic year
- A grade cannot be lower than zero
- A grade cannot exceed the exam maximum score
- Duplicate grades for the same student and exam are prevented at database level
- Exam deletion is blocked when grades already exist
- Nested grade deletion verifies that the grade belongs to the requested exam

Frontend permissions improve the user experience, but they are never used as the only security layer.

## Project Structure

A simplified structure:

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Policies/
│   └── Queries/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
└── tests/

frontend/
├── src/
│   ├── api/
│   ├── features/
│   │   ├── students/
│   │   ├── enrollments/
│   │   ├── exams/
│   │   └── teachingAssignment/
│   ├── hooks/
│   └── router/
└── package.json
```

## Planned Work

The application is still evolving. Planned features include:

### Teacher profile

- Teacher profile page
- Assigned classes and subjects
- Teaching assignment overview
- Exam history
- Grade activity summary

### Student profile

- Student profile page
- Enrollment history
- Current class and academic year
- Exam results
- Grade history
- Student-facing dashboard

### Exam statistics

Statistics will be displayed primarily on the exam details page.

Planned metrics include:

- Average score
- Highest score
- Lowest score
- Number of graded students
- Number of ungraded students
- Success rate
- Grade distribution

### AI-assisted teacher comments

A future version will experiment with AI-assisted feedback.

The idea is to allow a teacher to request a suggested comment based on information such as:

```text
student score
exam maximum score
existing teacher context
```

AI output will remain a suggestion. The teacher will review and edit the comment before saving it.

The feature is intended to support teachers rather than automatically publish generated feedback.

### Testing and quality

Planned improvements:

- More Laravel Feature Tests
- Frontend component and integration tests
- End-to-end tests for critical workflows
- CI pipeline
- API documentation

## Development Status

Implemented:

```text
Authentication
Role-aware authorization
Student management
Enrollment management
Exam management
Exam filtering and pagination
Exam details
URL-persisted exam filters
Teacher-scoped teaching assignments
Bulk grade management
Grade comments
Grade deletion
Frontend validation
Backend validation
Database grade uniqueness
```

In progress / planned:

```text
Teacher profile
Student profile
Exam statistics
Automated test coverage
CI
API documentation
AI-assisted teacher feedback
```

## Why I Built This Project

This project was created to practice and demonstrate the type of work expected in a real full-stack application.

The focus is not only on building screens, but on handling the decisions behind them: authorization boundaries, relational data, API contracts, validation, database integrity, asynchronous frontend state, and maintainable separation of responsibilities.

The project is also being used to deepen my Laravel and React experience through progressively more complex features rather than isolated tutorials.

## License

This project is currently intended for educational and portfolio purposes.
