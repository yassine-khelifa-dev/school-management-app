 <form method="GET" action="{{ route('enrollments.index') }}">


     <div class="row">
         <div class="col-md-4">
             <div class="mb-3">
                 <label for="q_student_full_name" class="form-label">Full name</label>
                 <input type="text" name="q_student_full_name" class="form-control" id="q_student_full_name"
                     aria-describedby="emailHelp"
                     value="{{ old('q_student_full_name', request('q_student_full_name')) }}"
                     placeholder="first name / last name ...">
             </div>
         </div>
         <div class="col-md-4">
             <div class="mb-3">
                 <label for="q_school_class" class="form-label">School name</label>
                 <select class="form-select" id="q_school_class" name="q_school_class">
                     <option value="">School Class</option>
                     @foreach ($schoolClasses as $schoolClass)
                         <option value="{{ $schoolClass->id }}" @selected(old('q_school_class', request('q_school_class')) == $schoolClass->id)>{{ $schoolClass->name }}
                         </option>
                     @endforeach
                 </select>
             </div>

         </div>
         <div class="col-md-4">
             <div class="mb-3">
                 <label for="q_academic_year" class="form-label">Academic Year</label>
                 <select class="form-select" id="q_academic_year" name="q_academic_year">
                     <option value="">Academic Year</option>
                     @foreach ($academicYears as $academicYear)
                         <option value="{{ $academicYear->id }}" @selected(old('q_academic_year', request('q_academic_year')) == $academicYear->id)>
                             {{ $academicYear->name }}</option>
                     @endforeach

                 </select>
             </div>

         </div>
     </div>


     <div class="row">
         <div class="col-md-4">
             @use('App\Enums\EnrollmentStatus')
             <div class="mb-3">
                 <select class="form-select" id="q_status" name="q_status">
                     <option value="">Status ...</option>
                     @foreach (EnrollmentStatus::cases() as $status)
                         <option value="{{ $status->value }}" @selected(old('q_status', request('q_status')) == $status->value)>
                             {{ $status->label() }}</option>
                     @endforeach

                 </select>
             </div>
         </div>
         <div class="col-md-4">
             <div class="mb-3">
                 <select class="form-select" id="q_field_sorted" name="q_field_sorted">
                     <option value="">field sorted ...</option>
                     <option value="enrollment_id" @selected(old('q_field_sorted', request('q_field_sorted')) == 'enrollment_id')> ID's enrollment </option>
                     <option value="first_name" @selected(old('q_field_sorted', request('q_field_sorted')) == 'first_name')>First Name </option>
                     <option value="last_name" @selected(old('q_field_sorted', request('q_field_sorted')) == 'last_name')>Last Name </option>
                     <option value="class_name" @selected(old('q_field_sorted', request('q_field_sorted')) == 'class_name')> Class Name</option>
                 </select>
             </div>
         </div>
         <div class="col-md-4">
             <div class="mb-3">
                 <select class="form-select" id="q_dir_sorted" name="q_dir_sorted">
                     <option value="">direction sorted ...</option>
                     <option value="asc" @selected(old('q_dir_sorted', request('q_dir_sorted')) == 'asc')> ASC </option>
                     <option value="desc" @selected(old('q_dir_sorted', request('q_dir_sorted')) == 'desc')> DESC </option>
                 </select>
             </div>

         </div>
     </div>


     <div class="d-flex flex-row-reverse gap-2">
         <button type="submit" class="btn btn-danger">Search</button>
         <a href="{{ route('enrollments.index') }}" class="btn btn-outline-secondary">
             Reset
         </a>
     </div>




 </form>
