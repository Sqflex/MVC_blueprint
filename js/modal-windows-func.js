/* --- Главы статистики --- */
$(document).ready(function () {
    
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
    });

    // Close if clicking outside modal content
    $(window).on("click", function (e) {
        if ($(e.target).is("#chapterModal")) {
            $("#chapterModal").fadeOut(150);
        }
    });

});