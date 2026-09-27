<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class InternationalPrimarySchoolSeeder extends Seeder
{
    private const FIRST_ACADEMIC_YEAR = 2023;

    private const LAST_ACADEMIC_YEAR = 2025;

    private const STUDENTS_PER_CLASS = 15;

    private const MAXIMUM_SCORE = 100;

    /**
     * Four first-year classes, three second-year classes and three third-year
     * classes. With 15 students per class, the school has 150 active students.
     */
    private const CLASS_NAMES_BY_LEVEL = [
        1 => ['Grade 1 - A', 'Grade 1 - B', 'Grade 1 - C', 'Grade 1 - D'],
        2 => ['Grade 2 - A', 'Grade 2 - B', 'Grade 2 - C'],
        3 => ['Grade 3 - A', 'Grade 3 - B', 'Grade 3 - C'],
    ];

    /**
     * Seven subjects suitable for an international private primary school.
     */
    private const SUBJECTS = [
        'English Language' => 'Reading, writing, speaking and communication skills.',
        'Mathematics' => 'Arithmetic, geometry, logic and problem-solving skills.',
        'Science' => 'An introduction to living things, matter, energy and the environment.',
        'French Language' => 'Foundational reading, speaking and writing skills in French.',
        'Social Studies' => 'Communities, geography, history and responsible citizenship.',
        'Computer Science' => 'Digital literacy, computational thinking and online safety.',
        'Physical Education' => 'Movement, health, teamwork and age-appropriate sports.',
    ];

    private const TEACHERS = [
        ['Oliver', 'Bennett', 'English Language'],
        ['Sophia', 'Williams', 'Mathematics'],
        ['Daniel', 'Anderson', 'Science'],
        ['Camille', 'Martin', 'French Language'],
        ['Emily', 'Thompson', 'Social Studies'],
        ['James', 'Wilson', 'Computer Science'],
        ['Chloe', 'Harris', 'Physical Education'],
    ];

    private const FIRST_NAMES = [
        'Oliver', 'George', 'Harry', 'Jack', 'Noah', 'Leo', 'Arthur', 'Oscar',
        'Charlie', 'Henry', 'Thomas', 'Lucas', 'Louis', 'Adam', 'Daniel', 'Amelia',
        'Olivia', 'Isla', 'Ava', 'Mia', 'Sophia', 'Lily', 'Emily', 'Grace',
        'Chloe', 'Ella', 'Charlotte', 'Alice', 'Lucy', 'Sophie',
    ];

    private const LAST_NAMES = [
        'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson',
        'Davies', 'Patel', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker',
        'White', 'Roberts', 'Green', 'Hall', 'Thomas', 'Clarke', 'Jackson',
        'Wood', 'Harris', 'Edwards', 'Turner', 'Martin', 'Cooper', 'Hill',
        'Ward', 'Morris',
    ];

    /** @var array<int, AcademicYear> */
    private array $academicYears = [];

    /** @var array<string, SchoolClass> */
    private array $classes = [];

    /** @var array<string, Subject> */
    private array $subjects = [];

    /** @var array<string, Teacher> */
    private array $teachersBySubject = [];

    /**
     * Students grouped by academic year and class for exam-grade generation.
     *
     * @var array<int, array<int, array<int, array{student: Student, profile: string, level: int}>>>
     */
    private array $studentsByYearAndClass = [];

    private int $studentSequence = 0;

    private ?string $defaultPasswordHash = null;

    public function run(): void
    {
        DB::transaction(function (): void {
            $this->createAdmin();
            $this->createAcademicYears();
            $this->createClasses();
            $this->createSubjects();
            $this->createTeachers();
            $this->createStudentCohortsAndEnrollments();
            $this->createTeachingAssignmentsExamsAndGrades();
        });

        $this->command?->info('International primary-school dataset created successfully.');
        $this->command?->table(
            ['Dataset', 'Count'],
            [
                ['Academic years', AcademicYear::count()],
                ['Classes', SchoolClass::count()],
                ['Subjects', Subject::count()],
                ['Teachers', Teacher::count()],
                ['Students', Student::count()],
                ['Enrollments', Enrollment::count()],
                ['Teaching assignments', TeachingAssignment::count()],
                ['Exams', Exam::count()],
                ['Grades', Grade::count()],
            ]
        );
    }

    private function createAdmin(): void
    {
        $this->saveUser(
            'admin@northstar-school.test',
            'admin'
        );
    }

    private function createAcademicYears(): void
    {
        foreach (range(self::FIRST_ACADEMIC_YEAR, self::LAST_ACADEMIC_YEAR) as $startYear) {
            $academicYear = AcademicYear::query()->updateOrCreate(
                ['name' => $startYear.'-'.($startYear + 1)],
                [
                    'starts_at' => $startYear.'-09-01',
                    'ends_at' => ($startYear + 1).'-06-30',
                ]
            );

            $this->academicYears[$startYear] = $academicYear;
        }
    }

    private function createClasses(): void
    {
        foreach (self::CLASS_NAMES_BY_LEVEL as $level => $classNames) {
            foreach ($classNames as $className) {
                $class = SchoolClass::query()->firstOrNew(['name' => $className]);
                $class->forceFill([
                    'name' => $className,
                    'description' => "Grade {$level} primary-school class",
                ])->save();

                $this->classes[$className] = $class;
            }
        }
    }

    private function createSubjects(): void
    {
        foreach (self::SUBJECTS as $name => $description) {
            $this->subjects[$name] = Subject::query()->updateOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }
    }

    private function createTeachers(): void
    {
        foreach (self::TEACHERS as $index => [$firstName, $lastName, $subjectName]) {
            $email = sprintf(
                '%s.%s@northstar-school.test',
                $this->slug($firstName),
                $this->slug($lastName)
            );

            $user = $this->saveUser($email, 'teacher');

            $teacher = Teacher::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => '+447911'.str_pad((string) ($index + 1), 6, '0', STR_PAD_LEFT),
                ]
            );

            $this->teachersBySubject[$subjectName] = $teacher;
        }
    }

    /**
     * Cohorts start in 2018 so that the 2020-2021 dataset already contains
     * first-, second- and third-year students. Each new cohort contains 60
     * students. Forty-five continue to years two and three, while fifteen
     * finish their tracked history after year one (including some cancelled
     * enrollments). This provides one-, two- and three-year histories.
     */
    private function createStudentCohortsAndEnrollments(): void
    {
        foreach (range(self::FIRST_ACADEMIC_YEAR - 2, self::LAST_ACADEMIC_YEAR) as $entryYear) {
            $plans = $this->buildCohortPlans($entryYear);

            foreach ($plans as &$plan) {
                $lastLevel = $plan['promoted'] ? 3 : 1;
                $hasEnrollmentInDataset = $entryYear + $lastLevel - 1 >= self::FIRST_ACADEMIC_YEAR;

                if (! $hasEnrollmentInDataset) {
                    continue;
                }

                $plan['student'] = $this->createStudent($entryYear);
            }
            unset($plan);

            $this->enrollFirstYearStudents($entryYear, $plans);

            $promotedPlans = array_values(array_filter(
                $plans,
                fn (array $plan): bool => $plan['promoted'] && isset($plan['student'])
            ));

            $this->enrollPromotedStudents($entryYear, 2, $promotedPlans);
            $this->enrollPromotedStudents($entryYear, 3, $promotedPlans);
        }
    }

    /**
     * @return array<int, array{index: int, profile: string, promoted: bool, student?: Student}>
     */
    private function buildCohortPlans(int $entryYear): array
    {
        $profilePattern = [
            ...array_fill(0, 5, 'high'),
            ...array_fill(0, 7, 'average'),
            ...array_fill(0, 3, 'struggling'),
        ];

        $plans = [];

        foreach (range(0, 59) as $index) {
            $plans[] = [
                'index' => $index,
                'profile' => $profilePattern[$index % self::STUDENTS_PER_CLASS],
                'promoted' => false,
            ];
        }

        $promotionTargets = [
            'high' => 15,
            'average' => 21,
            'struggling' => 9,
        ];

        foreach ($promotionTargets as $profile => $target) {
            $candidateIndexes = array_keys(array_filter(
                $plans,
                fn (array $plan): bool => $plan['profile'] === $profile
            ));

            usort(
                $candidateIndexes,
                fn (int $left, int $right): int => $this->stableNumber("promotion-{$entryYear}-{$left}")
                    <=> $this->stableNumber("promotion-{$entryYear}-{$right}")
            );

            foreach (array_slice($candidateIndexes, 0, $target) as $index) {
                $plans[$index]['promoted'] = true;
            }
        }

        return $plans;
    }

    /**
     * @param  array<int, array{index: int, profile: string, promoted: bool, student?: Student}>  $plans
     */
    private function enrollFirstYearStudents(int $entryYear, array $plans): void
    {
        if (! $this->isTrackedAcademicYear($entryYear)) {
            return;
        }

        $classNames = self::CLASS_NAMES_BY_LEVEL[1];

        foreach ($plans as $plan) {
            if (! isset($plan['student'])) {
                continue;
            }

            $className = $classNames[intdiv($plan['index'], self::STUDENTS_PER_CLASS)];
            $status = $this->enrollmentStatus(
                $entryYear,
                ! $plan['promoted'] && $this->stableNumber("cancelled-{$entryYear}-{$plan['index']}") % 4 === 0
            );

            $this->storeEnrollment(
                $plan['student'],
                $this->classes[$className],
                $this->academicYears[$entryYear],
                $entryYear,
                1,
                $status,
                $plan['profile']
            );
        }
    }

    /**
     * @param  array<int, array{index: int, profile: string, promoted: bool, student: Student}>  $plans
     */
    private function enrollPromotedStudents(int $entryYear, int $level, array $plans): void
    {
        $academicYearStart = $entryYear + $level - 1;

        if (! $this->isTrackedAcademicYear($academicYearStart)) {
            return;
        }

        $distributedPlans = $this->distributeByProfile($plans);
        $classNames = self::CLASS_NAMES_BY_LEVEL[$level];

        foreach ($distributedPlans as $classIndex => $classPlans) {
            foreach ($classPlans as $plan) {
                $this->storeEnrollment(
                    $plan['student'],
                    $this->classes[$classNames[$classIndex]],
                    $this->academicYears[$academicYearStart],
                    $academicYearStart,
                    $level,
                    $this->enrollmentStatus($academicYearStart),
                    $plan['profile']
                );
            }
        }
    }

    /**
     * Distribute 45 promoted students into three balanced classes. Every class
     * receives five high-performing, seven average and three struggling pupils.
     *
     * @param  array<int, array{index: int, profile: string, promoted: bool, student: Student}>  $plans
     * @return array<int, array<int, array{index: int, profile: string, promoted: bool, student: Student}>>
     */
    private function distributeByProfile(array $plans): array
    {
        $byProfile = [
            'high' => [],
            'average' => [],
            'struggling' => [],
        ];

        foreach ($plans as $plan) {
            $byProfile[$plan['profile']][] = $plan;
        }

        $classes = [[], [], []];

        foreach (range(0, 2) as $classIndex) {
            $classes[$classIndex] = [
                ...array_splice($byProfile['high'], 0, 5),
                ...array_splice($byProfile['average'], 0, 7),
                ...array_splice($byProfile['struggling'], 0, 3),
            ];
        }

        return $classes;
    }

    private function createStudent(int $entryYear): Student
    {
        $sequence = $this->studentSequence++;
        $firstName = self::FIRST_NAMES[$sequence % count(self::FIRST_NAMES)];
        $lastName = self::LAST_NAMES[intdiv($sequence, count(self::FIRST_NAMES)) % count(self::LAST_NAMES)];
        $email = sprintf('student.%d.%03d@northstar-school.test', $entryYear, $sequence + 1);
        $user = $this->saveUser($email, 'student');

        return Student::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone' => '+447700'.str_pad((string) ($sequence + 1), 6, '0', STR_PAD_LEFT),
            ]
        );
    }

    private function storeEnrollment(
        Student $student,
        SchoolClass $class,
        AcademicYear $academicYear,
        int $academicYearStart,
        int $level,
        string $status,
        string $profile
    ): void {
        Enrollment::query()->updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
            ],
            [
                'class_id' => $class->id,
                'enrolled_at' => sprintf('%d-09-%02d', $academicYearStart, 3 + ($student->id % 8)),
                'status' => $status,
            ]
        );

        $this->studentsByYearAndClass[$academicYearStart][$class->id][] = [
            'student' => $student,
            'profile' => $profile,
            'level' => $level,
        ];
    }

    private function createTeachingAssignmentsExamsAndGrades(): void
    {
        $gradeRows = [];
        $termDates = [
            1 => [12, 10],
            2 => [3, 15],
            3 => [5, 25],
        ];

        foreach ($this->studentsByYearAndClass as $academicYearStart => $studentsByClass) {
            foreach ($studentsByClass as $classId => $studentRows) {
                foreach ($this->subjects as $subjectName => $subject) {
                    $assignment = TeachingAssignment::query()->updateOrCreate(
                        [
                            'class_id' => $classId,
                            'subject_id' => $subject->id,
                            'academic_year_id' => $this->academicYears[$academicYearStart]->id,
                        ],
                        ['teacher_id' => $this->teachersBySubject[$subjectName]->id]
                    );

                    foreach ($termDates as $term => [$month, $day]) {
                        $examYear = $term === 1 ? $academicYearStart : $academicYearStart + 1;
                        $examDate = CarbonImmutable::create($examYear, $month, $day);
                        $title = "Term {$term} Exam - {$subjectName}";

                        $exam = Exam::query()->updateOrCreate(
                            [
                                'teaching_assignment_id' => $assignment->id,
                                'title' => $title,
                            ],
                            [
                                'exam_date' => $examDate->toDateString(),
                                'maximum_score' => self::MAXIMUM_SCORE,
                            ]
                        );

                        foreach ($studentRows as $studentRow) {
                            $student = $studentRow['student'];

                            // Roughly 2% of exam attempts are missing to model absences.
                            if ($this->stableNumber("absence-{$exam->id}-{$student->id}") % 50 === 0) {
                                continue;
                            }

                            $score = $this->generateScore(
                                $student->id,
                                $subject->id,
                                $term,
                                $studentRow['level'],
                                $studentRow['profile']
                            );

                            $now = now();
                            $gradeRows[] = [
                                'student_id' => $student->id,
                                'exam_id' => $exam->id,
                                'score' => $score,
                                'comment' => $this->gradeComment($score),
                                'graded_at' => $examDate->addDays(7)->toDateTimeString(),
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];
                        }
                    }
                }
            }
        }

        foreach (array_chunk($gradeRows, 1000) as $chunk) {
            Grade::query()->upsert(
                $chunk,
                ['student_id', 'exam_id'],
                ['score', 'comment', 'graded_at', 'updated_at']
            );
        }
    }

    /**
     * A student's profile remains stable between school years. Subject affinity,
     * trimester variation and a small progression bonus create realistic changes
     * without turning a strong first-year pupil into a random second-year pupil.
     */
    private function generateScore(
        int $studentId,
        int $subjectId,
        int $term,
        int $level,
        string $profile
    ): int {
        $variationSeed = $this->stableNumber("score-{$studentId}-{$subjectId}-{$term}");
        $affinitySeed = $this->stableNumber("affinity-{$studentId}-{$subjectId}");
        $affinity = ($affinitySeed % 7) - 3;
        $termVariation = ($variationSeed % 7) - 3;
        $progression = $level - 1;

        if ($profile === 'struggling' && $variationSeed % 8 === 0) {
            return 0;
        }

        $baseScore = match ($profile) {
            'high' => 82 + ($variationSeed % 15),
            'average' => 52 + ($variationSeed % 25),
            default => 8 + ($variationSeed % 38),
        };

        return max(0, min(self::MAXIMUM_SCORE, $baseScore + $affinity + $termVariation + $progression));
    }

    private function gradeComment(int $score): string
    {
        return match (true) {
            $score >= 90 => 'Excellent work and consistently strong achievement.',
            $score >= 75 => 'Very good progress throughout the term.',
            $score >= 60 => 'Satisfactory and consistent results.',
            $score >= 50 => 'Developing well, with room for further progress.',
            $score > 0 => 'Further support and regular practice are recommended.',
            default => 'Core concepts should be reviewed with additional support.',
        };
    }

    private function enrollmentStatus(int $academicYearStart, bool $cancelled = false): string
    {
        if ($academicYearStart === self::LAST_ACADEMIC_YEAR) {
            return 'active';
        }

        return $cancelled ? 'cancelled' : 'completed';
    }

    private function isTrackedAcademicYear(int $startYear): bool
    {
        return $startYear >= self::FIRST_ACADEMIC_YEAR
            && $startYear <= self::LAST_ACADEMIC_YEAR;
    }

    private function saveUser(string $email, string $role): User
    {
        $user = User::query()->firstOrNew(['email' => $email]);
        $user->forceFill([
            'email' => $email,
            'email_verified_at' => now(),
            'password' => $this->defaultPasswordHash ??= Hash::make('password'),
            'role' => $role,
        ]);
        $user->save();

        return $user;
    }

    private function stableNumber(string $value): int
    {
        return (int) sprintf('%u', crc32($value));
    }

    private function slug(string $value): string
    {
        return strtolower(str_replace(' ', '.', $value));
    }
}
