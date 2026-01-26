$(document).on("click", ".copy-btn", function () {
    $.ajax({
        url: `${baseURL}/api/v1/planRows/copyFromPreviousYear?branchId=${currentBranchID}&chapterId=${currentChapterID}&year=${currentYear}&planId=${currentPlanId}`,
        type: "POST",
        contentType: "application/json",
        success: function () {
            console.log('Данные успешно скопированы!');
            fetchPlanRows(currentPlanId);
        },
        error: function (xhr) {
            console.error("Ошибка копирования:", xhr.responseText);
            alert("Не удалось скопировать данные прошлого года");
        }
    });
});