<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StatisticsOverviewRequest;
use App\Http\Requests\TopStudentsRequest;
use App\Models\Subject;
use App\Services\StatisticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatisticController extends Controller
{

    public function __construct(
        public StatisticsService $service
    ) {}

    public function filterOptions(Request $requet)
    {
        return  $this->service->getFilterOptions(Auth::user());
    }

    public function topStudents(TopStudentsRequest $request, Subject $subject)
    {
        $filters = $request->validated();

        return $this->service->getTopStudents(
            Auth::user(),
            $subject,
            $filters
        );
    }

    public function overview(StatisticsOverviewRequest $requet)
    {
        $filters = $requet->validated();
        return  $this->service->getOverview(Auth::user(),  $filters);
    }
}
