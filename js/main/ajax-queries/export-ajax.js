$(".export-btn").on("click", function () { // get current plan dynamically
    if (!currentPlanId) {
        alert("Выберите план для экспорта!");
        return;
    }

    const url = `${baseURL}/api/v1/plans/${currentPlanId}/export/xls`;

    // Open the download in the browser, using server-provided filename
    window.open(url, "_blank");
});
