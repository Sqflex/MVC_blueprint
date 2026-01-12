// Column map: maps checkbox data-col to API field
const colMap = {
    1: "isMainStatisticalSourceColVisible",
    2: "isAdditionalStatisticalSourceColVisible",
    3: "isAdditionalSourceDeadlineColVisible",
    4: "isWorkNameColVisible",
    5: "isWorkPeriodicityColVisible",
    6: "isIndustryColVisible",
    7: "isExecutorDepartmentColVisible",
    8: "isResponsibleExecutorColVisible",
    9: "isReportingPeriodColVisible",
    10: "isPrimaryDataCollectionStartDateColVisible",
    11: "isPrimaryDataSubmissionDeadlineColVisible",
    12: "isDepartmentTransferToGsuDeadlineColVisible",
    13: "isTransferToBelstatGsuDeadlineColVisible",
    14: "isTransferTimeToBelstatColVisible",
    15: "isCorrectedDataToLongtermDbDeadlineColVisible",
    16: "isBelstatWorkDeadlineColVisible",
    17: "isGsuWorkDeadlineColVisible",
    18: "isBelstatDevelopmentBreakdownColVisible",
    19: "isGsuDevelopmentBreakdownColVisible",
    20: "isAggregatedDataRecipientDepartmentColVisible",
    21: "isBelstatWorkResultColVisible",
    22: "isGsuWorkResultColVisible",
    23: "isPublicationDeadlineColVisible",
    24: "isStatusOfWorkColVisible",
    25: "isWorkDeadlineColVisible",
    26: "isExecutorsColVisible",
    27: "isCoexecutorsBelstatColVisible",
    28: "isDataRegistrySourcesColVisible",
    29: "isGsuWorkPeriodicityColVisible",
    30: "isBelstatWorkPeriodicityColVisible",
    31: "isDeadlineTransferGsuToBelstatColVisible",
    32: "isDeadlineTransferDepartmentsToGsuColVisible",
    33: "isSamplingSourceColVisible",
    34: "isDevelopmentBreakdownIdColVisible",
    35: "isContractConclusionDeadlineColVisible",
    36: "isIndustrialOperationStartDeadlineColVisible",
    37: "isContractorOrganizationColVisible",
    38: "isContractorExpectedOrganizationColVisible",
    39: "isInfoSubmissionDeadlineToContractorColVisible",
    40: "isWorkExecutionDeadlineColVisible",
    41: "isBelstatResponsiblePersonsChoiceColVisible",
    42: "isOfficialStatInfoNameColVisible",
    43: "isOfficialStatInfoPeriodicityColVisible",
    44: "isOfficialStatInfoRecipientOrgColVisible"
};

// Track current visibility
const columnVisibilityMap = {};

// Toggle column by number (1-based)
function toggleColumn(colNumber, show) {
    const display = show ? "" : "none";
    const table = $("#Prod-plan-table");

    // Never hide index column
    if (colNumber === 0) return;

    // Toggle header
    table.find("thead tr").each(function () {
        $(this).find("th").eq(colNumber).css("display", display);
    });

    // Toggle body
    table.find("tbody tr").each(function () {
        $(this).find("td").eq(colNumber).css("display", display);
    });
}

// Load column visibility from API
function loadColumnVisibility(planId) {
    if (!planId) return;
    $.ajax({
        url: `http://localhost:8080/api/v1/plan-columns/plan/${planId}`,
        method: "GET",
        success: function (data) {
            if (!data || !data.length) return;
            const columnData = data[0];

            $(".col-toggle").each(function () {
                const colNumber = parseInt($(this).data("col"));
                const field = colMap[colNumber];
                if (!field) return;

                const isVisible = !!columnData[field];
                $(this).prop("checked", isVisible);
                columnVisibilityMap[field] = isVisible;

                toggleColumn(colNumber, isVisible);
            });
        },
        error: function (xhr) {
            console.error("Failed to load column visibility", xhr.responseText);
        }
    });
}

// Checkbox change
$(document).on("change", ".col-toggle", function () {
    const $checkbox = $(this);
    const colNumber = parseInt($checkbox.data("col"));
    const field = colMap[colNumber];
    if (!field) return;

    const isChecked = $checkbox.prop("checked");
    columnVisibilityMap[field] = isChecked;

    toggleColumn(colNumber, isChecked);

    // Update backend
    if (typeof currentPlanId !== "undefined") {
        $.ajax({
            url: `http://localhost:8080/api/v1/plan-columns/${currentPlanId}/visibility/${field}?visibility=${isChecked}`,
            method: "PUT",
            success: function(){
                fetchPlanRows(currentPlanId);
            },
            error: function (xhr) {
                alert("Не удалось обновить видимость колонки");
                console.error(xhr.responseText);

                // Revert
                $checkbox.prop("checked", !isChecked);
                columnVisibilityMap[field] = !isChecked;
                toggleColumn(colNumber, !isChecked);
            }
        });
    }
});

// Dropdown toggle + search
$(document).ready(function () {
    // Dropdown open/close
    $(".drop-hid-col-btn").on("click", function () {
        $(".dropdown-content-hidden-col").toggleClass("show");
    });
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".dropdown-hid-col").length) {
            $(".dropdown-content-hidden-col").removeClass("show");
        }
    });

    // Search
    $("#col-search").on("keyup", function () {
        const search = $(this).val().toLowerCase().trim();
        $(".checkbox-grid label").each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });
});
