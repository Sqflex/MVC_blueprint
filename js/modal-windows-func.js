
$(document).ready(function () {
    
    /* --- Разделы статистики --- */
    $("#add-main-btn").on("click", function () {
        $("#mainModal").fadeIn(150);
    });

    $(".close-btn").on("click", function () {
        $("#mainModal").fadeOut(150);
    });

    $("#saveMain").on("click", function () {
        const value = $("#mainInput").val();
        console.log("Saved main:", value);
        $("#mainModal").fadeOut(150);
        $('#add-main-btn').before(`
            <button
                class="main-btn px-6 py-3 bg-gray-200 text-gray-700
                font-medium rounded-t-lg ml-2 transition-all hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                ${value}
            </button>
        `);
    });

    $(window).on("click", function (e) {
        if ($(e.target).is("#mainModal")) {
            $("#mainModal").fadeOut(150);
        }
    });

    /* --- Года --- */
    $("#add-year-btn").on("click", function () {
        $("#yearModal").fadeIn(150);
    });

    $(".close-btn").on("click", function () {
        $("#yearModal").fadeOut(150);
    });

    $("#saveYear").on("click", function () {
        const value = $("#yearInput").val();
        console.log(value);
        
        if (value < 1900 || value > 2099) {
            alert("Введен неверный год!");
        } else {
            console.log("Saved year:", value);
            $("#yearModal").fadeOut(150);
            $('#year-buttons').append(`
                <button
                    class="year-btn buttom-width-height-year py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700
                        transition-all hover:bg-primary-50 hover:border-primary-300 hover:transform hover:scale-[1.02] focus:outline-none
                        focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 active:bg-primary-100 button-margin">
                        ${value}
                </button>
                `);
        }
    });

    $(window).on("click", function (e) {
        if ($(e.target).is("#yearModal")) {
            $("#yearModal").fadeOut(150);
        }
    });

    /* --- Главы статистики --- */
    $("#add-chapter-btn").on("click", function () {
        $("#chapterModal").fadeIn(150);
    });

    $(".close-btn").on("click", function () {
        $("#chapterModal").fadeOut(150);
    });

    $("#saveChapter").on("click", function () {
        const value = $("#chapterInput").val();
        console.log("Saved chapter:", value);
        $("#chapterModal").fadeOut(150);
        $('#add-chapter-button-section').before(`
            <button
                class="chapter-btn w-[100%] py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700
                    transition-all hover:bg-primary-50 hover:border-primary-300 hover:transform hover:scale-[1.02] focus:outline-none
                    focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 active:bg-primary-100 button-margin">
                    ${value}
            </button>
        `);
    });

    $(window).on("click", function (e) {
        if ($(e.target).is("#chapterModal")) {
            $("#chapterModal").fadeOut(150);
        }
    });

});