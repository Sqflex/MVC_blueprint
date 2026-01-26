/* ------- Развернуть разделы глав и годов ----------------- */

let currentChapterID = null;
let currentPlanId = null;
let currentYear = new Date().getFullYear();
// let baseURL = "http://172.16.251.93:8010";
let baseURL = "http://localhost:8080";

function loadYearsFromPlans(branchId, chapterId, defaultYear) {

    $.ajax({
        url: `${baseURL}/api/v1/plans/years?branchId=${branchId}&chapterId=${chapterId}`,
        type: 'GET',
        dataType: 'json',
        success: function (plans) {

            const $dropdown = $('#year-dropdown');
            $dropdown.empty();

            // Extract UNIQUE years from plans
            let years = [...new Set(plans.map(p => p.year))];

            // If no plans yet → use current year
            if (years.length === 0) {
                years = [defaultYear];
            }

            // Sort years DESC
            years.sort((a, b) => b - a);

            // Fill dropdown
            years.forEach(year => {
                $dropdown.append(
                    $('<option>').val(year).text(year)
                );
            });

            // Ensure current year exists
            if (!years.includes(defaultYear)) {
                $dropdown.append(
                    $('<option>').val(defaultYear).text(defaultYear)
                );
            }

            $dropdown.val(defaultYear);

            loadOrCreatePlan(branchId, chapterId, defaultYear);
        },
        error: function (xhr) {
            console.error('Failed to load years:', xhr.responseText);
        }
    });
}

function loadOrCreatePlan(branchId, chapterId, year) {
    $.ajax({
        url: `${baseURL}/api/v1/plans/unique?branchId=${branchId}&chapterId=${chapterId}&year=${year}`,
        type: 'GET',
        success: function (plan) {
            currentPlanId = plan.planId;
            loadColumnVisibility(currentPlanId);
            loadPlanRows();
            fetchPlanRows(currentPlanId);
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                createPlan(branchId, chapterId, year, function (planId) {
                    currentPlanId = planId;
                    loadColumnVisibility(currentPlanId);
                    loadPlanRows();
                    fetchPlanRows(currentPlanId);
                });                
            } else {
                console.error('Failed to load plan:', xhr.responseText);
            }
        }
    });
}

function createPlan(branchId, chapterId, year, onSuccess) {
    $.ajax({
        url: `${baseURL}/api/v1/plans`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            branchId: branchId,
            chapterId: chapterId,
            year: year
        }),
        success: function (plan) {
            $.ajax({
                url: `${baseURL}/api/v1/plans/unique?branchId=${branchId}&chapterId=${chapterId}&year=${year}`,
                type: 'GET',
                success: function (plan) {
                    console.log("Fetched after create:", plan);
                    onSuccess(plan.planId);
                }
            });
        },
        error: function (xhr) {
            console.error("Failed to create plan:", xhr.responseText);
        }
    });
}


$('#year-dropdown').on('change', function () {

    const selectedYear = Number($(this).val());
    currentYear = selectedYear;

    if (!currentBranchID || !currentChapterID) return;

    loadOrCreatePlan(currentBranchID, currentChapterID, selectedYear);
});


jQuery(document).ready(function($) {                
    $(document).on('click', '.max-chapter', function(){
        $('#chapter-buttons').css("display", "grid");
        $('#chapter-section').addClass('mb-6');
        let currentChapter = $('#chapter-buttons').children('.active').text();
        $('#current-chapter').html($('#current-chapter').html().replace("Текущая глава статистики - " + currentChapter, "Главы статистики"));
    });

    $(document).on('click', '.max-year', function(){
        $('#year-buttons').css("display", "grid");
        $('#add-year-button-section').css("display", "flex");
        $('#year-section').addClass('mb-6');
        let currentYear = $('#year-buttons').children('.active').text();
        $('#current-year').html($('#current-year').html().replace("Текущий год производственного планирования - " + currentYear, "Года производственных планирований"));
    });

    /* ---------- Эмуляция кликов по кнопкам ----------------- */

    $('#main-stats').on('click', '.main-btn', function() {
        $('#main-stats .main-btn').removeClass('active');
        $(this).addClass('active');
        $('#years-wrapper').css('display', 'none');
        $('#year-floating-selector').css('display', 'none');
        $('#chapters-wrapper').css('display', 'block');
        $('#table-wrapper').css('display', 'none');
        $('#approved-wrapper').css('display', 'none');

        /* -------- reset -------- */
        // let currentYear = $('#year-buttons').children('.active').text();
        // $('#year-buttons .year-btn').removeClass('active');
        // $('#year-buttons').css("display", "grid");
        // $('#add-year-button-section').css("display", "flex");
        // $('#year-section').addClass('mb-6');
        // $('#current-year').html($('#current-year').html().replace("Текущий год производственного планирования - " + currentYear, "Года производственных планирований"));

        let currentChapter = $('#chapter-buttons').children('.active').text();
        $('#chapter-buttons .chapter-btn').removeClass('active');
        $('#chapter-buttons').css("display", "grid");
        $('#chapter-section').addClass('mb-6');
        $('#current-chapter').html($('#current-chapter').html().replace("Текущая глава статистики - " + currentChapter, "Главы статистики"));
    });

    $('#chapter-buttons').on('click', '.chapter-btn', function () {

        currentChapterID = $(this).data('chapter-id');
        currentYear = new Date().getFullYear();
    
        if (!currentBranchID || !currentChapterID) return;
    
        loadYearsFromPlans(currentBranchID, currentChapterID, currentYear);
        $('#year-floating-selector').fadeIn(200);
    });


    $('#chapter-buttons').on('click', '.chapter-btn', function() {
        $('#chapter-buttons .chapter-btn').removeClass('active');
        $(this).addClass('active');
        $('#table-wrapper').css('display', 'flex');
        $('#approved-wrapper').css('display', 'flex');
        /* -------- Свернуть главы -------- */
        $('#chapter-buttons').css("display", "none");
        $('#chapter-section').removeClass();
        let currentChapter = $('#chapter-buttons').children('.active').text();
        $('#current-chapter').html($('#current-chapter').html().replace("Главы статистики", "Текущая глава статистики - " + currentChapter));
        $('html, body').animate({
            scrollTop: $("#table-wrapper").offset().top
            }, 1000);
        });
    });