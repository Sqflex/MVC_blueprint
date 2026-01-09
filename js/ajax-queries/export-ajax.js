$(".export-btn").on("click", function () { // get current plan dynamically
    let planId = 1;
    if (!planId) {
        alert("Выберите план для экспорта!");
        return;
    }

    const url = `http://localhost:8080/api/v1/plans/${planId}/export/xls`;

    // Open the download in the browser, using server-provided filename
    window.open(url, "_blank");
});
