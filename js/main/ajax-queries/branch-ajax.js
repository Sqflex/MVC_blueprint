function loadBranches() {
        $.ajax({
        url: `${baseURL}/api/v1/branches`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            const $container = $("#main-stats");
            $container.empty();

            $.each(data, function (index, branch) {

                const $button = $("<button></button>")
                    .addClass("main-btn px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-t-lg ml-2 transition-all hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50")
                    .text(branch.branchName)
                    .attr("data-branch-id", branch.branchId);

                // // обработчик клика
                // $button.on("click", function () {
                //     $(".main-btn").removeClass("bg-blue-500 text-white");
                //     $(this).addClass("bg-blue-500 text-white");

                //     // console.log("Выбрана ветка:", branch.branchId);
                // });

                $container.append($button);
            });

            // Кнопка "+"
            const $addButton = $("<button></button>")
                .attr("id", "add-main-btn")
                .addClass("px-6 py-3 bg-green-600 text-white rounded-t-lg ml-2 shadow-sm font-medium transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50")
                .text("+");

            $container.append($addButton);
        },
        error: function (xhr, status, error) {
            console.error("Ошибка загрузки веток:", error);
        }
    });
}

$(document).ready(function () {
    loadBranches();
    $(document).on("click", "#add-main-btn", function () {
        $("#mainModal").fadeIn(150);
    });

    $(".close-main-btn").on("click", function () {
        $("#mainModal").fadeOut(150);
    });

     $("#saveMain").on("click", function () {
        const branchName = $("#mainInput").val().trim();

        if (!branchName) {
            alert("Введите название раздела");
            return;
        }

        $.ajax({
            url: `${baseURL}/api/v1/branches`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                branchName: branchName
            }),
            success: function (response) {
                loadBranches();

                $("#mainModal").fadeOut();
                $("#mainInput").val("");
            },
            error: function (xhr) {
                console.error("Ошибка сохранения:", xhr.responseText);
                alert("Не удалось сохранить раздел");
            }
        });

        $("#mainModal").fadeOut(150);
    });
});