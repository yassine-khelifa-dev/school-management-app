# School Management Application

A full-stack school management platform built with Laravel and React for managing students, enrollments, teaching assignments, exams, and grades.

The application is designed around practical school workflows with role-based access, secure REST APIs, teacher-scoped data, bulk grade management, validation, database integrity, filtering, pagination, and a structured frontend architecture.

## Table of Contents

- [Project Overview](#project-overview)
- [Current Features](#current-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Grade Management Workflow](#grade-management-workflow)
- [Security and Data Integrity](#security-and-data-integrity)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Useful Commands](#useful-commands)
- [Roadmap](#roadmap)

## Project Overview

The project is organized as a single full-stack application with a dedicated Laravel backend and React frontend:

```text
/
├── backend/
├── frontend/
└── README.md
```

The backend handles authentication, authorization, validation, business rules, database access, API resources, and data integrity.

The frontend provides role-aware interfaces for managing school data and operational workflows.

The current implementation mainly supports:

- Admin
- Teacher

Additional student-facing features are planned.

## Current Features

### Authentication and Authorization

- Authentication with Laravel Sanctum
- Login and logout
- Role-based access control
- Laravel Policies for resource authorization
- Teacher-scoped access to exams and teaching assignments
- Frontend permission helpers for role-aware actions
- Backend authorization as the source of truth

### Student Management

- Student listing
- Student details
- Student creation, update, and deletion for administrators
- Enrollment history
- Current enrollment information
- Enrollment count
- Teacher-scoped access to students

### Enrollment Management

- Student enrollment management
- Academic year and class association
- Enrollment validation
- Admin-only enrollment mutations
- Student enrollment history API

### Exam Management

- Exam listing
- Server-side pagination
- Filtering by academic year, class, and subject
- Sorting
- URL-based persistence for filters, pagination, and sorting
- Exam creation
- Exam editing
- Exam deletion
- Exam details page
- Teacher-scoped exam access
- Teaching assignment validation
- Protection against deleting exams that already contain grades

### Grade Management

Teachers can manage grades for students associated with the class and academic year of an exam.

The grade workflow supports:

- Listing all eligible students for an exam
- Displaying existing grades
- Representing ungraded students with a null score
- Bulk grade creation and update
- Grade comments
- Grade deletion
- Maximum-score validation
- Graded and ungraded student counts
- Unique grade per student and exam

The frontend provides a dedicated grade-management page where a teacher can manage multiple scores in one workflow.

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
        | API Resources
        | Eloquent Models / Scopes
        v
Relational Database
```

### Backend Responsibilities

The backend keeps responsibilities separated:

```text
Form Request
→ validation and request authorization

Policy
→ resource authorization

Controller
→ request coordination

Model / Query Scope
→ reusable data access rules

API Resource
→ response structure

Database Constraints
→ data integrity
```

### Frontend Responsibilities

The frontend follows a feature-oriented structure:

```text
Page
→ custom hook
→ service
→ API
```

List fetching and mutation logic are separated where appropriate.

The frontend also handles:

- Loading states
- Error states
- Empty states
- Success feedback
- URL-based list state
- Form validation
- Role-aware actions

## Grade Management Workflow

An exam belongs to a teaching assignment.

A teaching assignment connects:

```text
Teacher
Subject
School Class
Academic Year
```

Eligible students are resolved through enrollments using the exam's class and academic year:

```text
Exam
→ Teaching Assignment
→ School Class + Academic Year
→ Enrollments
→ Students
```

Grades are matched using:

```text
exam_id + student_id
```

The API returns all eligible students, including students without an existing grade.

Example:

```json
{
  "id": 2148,
  "full_name": "Student Name",
  "grade": {
    "id": null,
    "score": null,
    "comment": null,
    "graded_at": null
  }
}
```

This allows the frontend to display the full class without creating empty grade records in the database.

Bulk grade updates use an upsert workflow while the database enforces a unique constraint on:

```text
student_id + exam_id
```

## Security and Data Integrity

The application enforces authorization and validation on the backend.

Examples:

- A teacher cannot manage another teacher's exams
- A teacher can only manage grades for exams assigned to them
- Students outside the exam's class and academic year cannot be graded
- A score cannot be lower than zero
- A score cannot exceed the exam maximum score
- Duplicate grades for the same student and exam are prevented at database level
- Exam deletion is blocked when grades already exist
- Nested grade deletion verifies that the grade belongs to the requested exam

Frontend permissions improve the user experience but are not used as the security layer.

## Project Structure

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

## Installation

### Requirements

Install the following:

```text
PHP 8.3+
Composer
Node.js
npm
MySQL or another supported relational database
```

Clone the repository:

```bash
git clone https://github.com/yassine-khelifa-dev/school-management-app.git
cd school-management-app
```

## Backend Setup

Open the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure the database in `.env`:

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

Start the Laravel API:

```bash
php artisan serve
```

Default development URL:

```text
http://127.0.0.1:8000
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

Start the Vite development server:

```bash
npm run dev
```

Default development URL:

```text
http://localhost:5173
```

If the frontend uses a Vite environment variable for the API URL, create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The environment variable name must match the Axios configuration used by the project.

## Running the Application

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

## Useful Commands

### Backend

Run tests:

```bash
php artisan test
```

Run Laravel Pint:

```bash
./vendor/bin/pint
```

Clear Laravel caches:

```bash
php artisan optimize:clear
```

Run the Composer test script:

```bash
composer test
```

### Frontend

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Roadmap

### Teacher Profile

Planned additions:

- Teacher profile page
- Assigned classes and subjects
- Teaching assignment overview
- Exam history
- Grade activity summary

### Student Profile

Planned additions:

- Student profile page
- Current enrollment
- Enrollment history
- Exam results
- Grade history
- Student dashboard

### Exam Statistics

Planned statistics for the exam details page:

- Average score
- Highest score
- Lowest score
- Number of graded students
- Number of ungraded students
- Success rate
- Grade distribution

### AI-Assisted Teacher Comments

A future feature will provide AI-assisted comment suggestions for teachers based on exam results and grade context.

Generated comments will remain editable suggestions and will require teacher review before being saved.

### Quality and Delivery

Planned improvements include:

- Extended Laravel Feature Tests
- Frontend component and integration tests
- End-to-end tests
- CI pipeline
- API documentation
