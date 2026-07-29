 <form method="GET" action="{{ route('enrollments.index') }}">

     <div class="mb-3">
         <label for="q_student_full_name" class="form-label">Full name</label>
         <input type="text" name="q_student_full_name" class="form-control" id="q_student_full_name"
             aria-describedby="emailHelp" value="{{ old('q_student_full_name', request('q_student_full_name')) }}">
     </div>

     <div class="mb-3">
         <select class="form-select"  id="q_academic_year" name="q_academic_year">
             <option value="" selected>Academic Year</option>
             @foreach ($academicYears as $academicYear)
                 <option value="{{ $academicYear->id }}" @selected(old('q_academic_year', request('q_academic_year')) == $academicYear->id)>
                     {{ $academicYear->name }}</option>
             @endforeach

         </select>
     </div>

     <div class="mb-3">
         <select class="form-select"  id="q_school_class" name="q_school_class">
             <option value="" selected>School Class</option>
             @foreach ($schoolClasses as $schoolClass)
                 <option value="{{ $schoolClass->id }}" @selected(old('q_school_class', request('q_school_class')) == $schoolClass->id)>{{ $schoolClass->name }}
                 </option>
             @endforeach
         </select>
     </div>

     <div class="mb-3 form-check">
         <input type="checkbox" name="q_status" value="1" @checked(old('q_status', request('q_status'))) class="form-check-input"
             id="q_status">
         <label class="form-check-label" for="q_status">Student Active ?</label>
     </div>



     <button type="submit" class="btn btn-danger">Search</button>
     <a href="{{ route('enrollments.index') }}" class="btn btn-outline-secondary">
         Reset
     </a>

 </form>
