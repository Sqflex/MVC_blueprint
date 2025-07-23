/* ------- Развернуть разделы глав и годов ----------------- */
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

    $('#main-stats .main-btn').on('click', function() {
        $('#main-stats .main-btn').removeClass('active');
        $(this).addClass('active');
        $('#years-wrapper').css('display', 'block');
        $('#chapters-wrapper').css('display', 'none');
        $('#table-wrapper').css('display', 'none');
        /* -------- reset -------- */
        let currentYear = $('#year-buttons').children('.active').text();
        $('#year-buttons .year-btn').removeClass('active');
        $('#year-buttons').css("display", "grid");
        $('#add-year-button-section').css("display", "flex");
        $('#year-section').addClass('mb-6');
        $('#current-year').html($('#current-year').html().replace("Текущий год производственного планирования - " + currentYear, "Года производственных планирований"));

        let currentChapter = $('#chapter-buttons').children('.active').text();
        $('#chapter-buttons .chapter-btn').removeClass('active');
        $('#chapter-buttons').css("display", "grid");
        $('#chapter-section').addClass('mb-6');
        $('#current-chapter').html($('#current-chapter').html().replace("Текущая глава статистики - " + currentChapter, "Главы статистики"));
    });

    $('#year-buttons .year-btn').on('click', function() {
        $('#year-buttons .year-btn').removeClass('active');
        $(this).addClass('active');
        $('#chapters-wrapper').css('display', 'block');
        $('#table-wrapper').css('display', 'none');

        /* ------- Свернуть главы -------- */
        let currentChapter = $('#chapter-buttons').children('.active').text();
        $('#chapter-buttons .chapter-btn').removeClass('active');
        $('#chapter-buttons').css("display", "grid");
        $('#chapter-section').addClass('mb-6');
        $('#current-chapter').html($('#current-chapter').html().replace("Текущая глава статистики - " + currentChapter, "Главы статистики"));

        /* ------- Свернуть года -------- */
        $('#year-buttons').css("display", "none");
        $('#add-year-button-section').css("display", "none");
        $('#year-section').removeClass();
        let currentYear = $('#year-buttons').children('.active').text();
        $('#current-year').html($('#current-year').html().replace("Года производственных планирований", "Текущий год производственного планирования - " + currentYear));
    });

    $('#chapter-buttons .chapter-btn').on('click', function() {
        $('#chapter-buttons .chapter-btn').removeClass('active');
        $(this).addClass('active');
        $('#table-wrapper').css('display', 'flex');
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
