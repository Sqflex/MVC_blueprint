
$(document).ready(function () {
    
    /* --- Разделы статистики --- */
    // $("#add-main-btn").on("click", function () {
    //     $("#mainModal").fadeIn(150);
    // });

    // $(".close-btn").on("click", function () {
    //     $("#mainModal").fadeOut(150);
    // });

    // $("#saveMain").on("click", function () {
    //     const value = $("#mainInput").val();
    //     console.log("Saved main:", value);
    //     $("#mainModal").fadeOut(150);
    //     $('#add-main-btn').before(`
    //         <button
    //             class="main-btn px-6 py-3 bg-gray-200 text-gray-700
    //             font-medium rounded-t-lg ml-2 transition-all hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
    //             ${value}
    //         </button>
    //     `);
    // });

    $(window).on("click", function (e) {
        if ($(e.target).is("#mainModal")) {
            $("#mainModal").fadeOut(150);
        }
    });

    /* --- Года --- */
    $("#add-year-btn").on("click", function () {
        $("#yearModal").fadeIn(150);
    });

    $(".close-years-btn").on("click", function () {
        $("#yearModal").fadeOut(150);
    });

    $("#saveYear").on("click", function () {
        const value = Number($("#yearInput").val().trim());
    
        // Validate year
        if (value < 1900 || value > 2099) {
            alert("Введен неверный год!");
            return;
        }
    
        if (!currentBranchID || !currentChapterID) {
            alert("Выберите ветку и главу перед добавлением года");
            return;
        }
    
        // Prepare data for API
        const postData = {
            branchId: currentBranchID,
            chapterId: currentChapterID,
            year: value
        };
    
        // POST request to create new plan
        $.ajax({
            url: `${baseURL}/api/v1/plans`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(postData),
            success: function(plan) {
                console.log("Plan created:", plan);
    
                // Add to year dropdown if not already there
                const $dropdown = $("#year-dropdown");
                if ($dropdown.find(`option[value='${value}']`).length === 0) {
                    $dropdown.append(
                        $("<option>").val(value).text(value)
                    );
                }
    
                // Select the new year
                $dropdown.val(value);
                currentYear = value;
    
                // Close modal
                $("#yearModal").fadeOut(150);
    
                // Optionally, load the plan immediately
                loadOrCreatePlan(currentBranchID, currentChapterID, value);
            },
            error: function(xhr) {
                console.error("Ошибка при создании года:", xhr.responseText);
                alert("Не удалось создать план для указанного года");
            }
        });
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