let currentBranchID = null;

function loadChapters(branchID) {
    if (!branchID) return;

    console.log("Loading chapters for branch:", branchID);

    $.ajax({
        url: `${baseURL}/api/v1/chapters/branch/${branchID}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            const $container = $("#chapter-buttons");
            $container.empty();

            // Render chapters
            $.each(data, function (_, chapter) {
                const $button = $("<button>")
                    .addClass(
                        'chapter-btn w-[100%] py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700 ' +
                        'transition-all hover:bg-primary-50 hover:border-primary-300 hover:transform hover:scale-[1.02] focus:outline-none ' +
                        'focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 active:bg-primary-100 button-margin'
                    )
                    .text(chapter.chapterName)
                    .attr("data-chapter-id", chapter.chapterId);

                $container.append($button);
            });

            // Add "Add Chapter" button
            const $icon = $('<span>')
                .addClass('material-symbols-outlined')
                .text('add');

            const $addButton = $('<button>')
                .attr('id', 'add-chapter-btn')
                .addClass(
                    'w-full py-3 px-4 bg-green-600 text-white rounded-lg shadow-md font-medium ' +
                    'transition-all hover:bg-green-700 flex items-center justify-center gap-2'
                )
                .append($icon)
                .append(' Добавить главу');

            $container.append($addButton);
        },
        error: function (xhr) {
            console.error("Ошибка загрузки глав:", xhr.responseText);
        }
    });
}

$(document).ready(function () {

    // Branch click
    $(document).on('click', '.main-btn', function () {
        $('.main-btn').removeClass('active');
        $(this).addClass('active');

        currentBranchID = $(this).data('branch-id');
        loadChapters(currentBranchID);
    });

    // Open modal
    $(document).on("click", "#add-chapter-btn", function () {
        $("#chapterModal").fadeIn(150);
    });

    // Close modal
    $(".close-chapters-btn").on("click", function () {
        $("#chapterModal").fadeOut(150);
    });

    // Save chapter
    $("#saveChapter").on("click", function () {
        const chapterName = $("#chapterInput").val().trim();

        if (!chapterName) {
            alert("Введите название главы");
            return;
        }

        if (!currentBranchID) {
            alert("Выберите ветку");
            return;
        }

        $.ajax({
            url: `${baseURL}/api/v1/chapters`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                chapterName: chapterName,
                branchId: currentBranchID
            }),
            success: function () {
                loadChapters(currentBranchID);
                $("#chapterModal").fadeOut(150);
                $("#chapterInput").val("");
            },
            error: function (xhr) {
                console.error("Ошибка сохранения:", xhr.responseText);
                alert("Не удалось сохранить главу");
            }
        });
    });

    // ============================
    // AUTO LOAD FIRST BRANCH
    // ============================
    const firstBranchID = $('.main-btn.active').data('branch-id');
    if (firstBranchID) {
        currentBranchID = firstBranchID;
        loadChapters(firstBranchID);
    }
});
