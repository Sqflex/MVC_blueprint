function parseDdMmYyyyToDate(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts.map(Number);

    // Month is 0-based in JS
    return new Date(yyyy, mm - 1, dd);
}

function applyDateFilter() {
    const selectedDateStr = $('#filter-date').val(); // dd.mm.yyyy
    const operator = $('#filter-operator').val();
    const column = $('#filter-column').val();

    if (!selectedDateStr || !operator || !column) return;

    const selectedDate = parseDdMmYyyyToDate(selectedDateStr);
    if (!selectedDate) return;

    const selectedTime = selectedDate.setHours(0, 0, 0, 0);

    $('#Prod-plan-table tbody tr').each(function () {
        const $row = $(this);
        const cellStr = $row.find(`td[data-field="${column}"] input`).val();

        if (!cellStr) {
            $row.hide();
            return;
        }

        const cellDate = parseDdMmYyyyToDate(cellStr);
        if (!cellDate) {
            $row.hide();
            return;
        }

        const cellTime = cellDate.setHours(0, 0, 0, 0);
        let show = false;

        switch (operator) {
            case '=':
                show = cellTime === selectedTime;
                break;
            case '>':
                show = cellTime > selectedTime;
                break;
            case '>=':
                show = cellTime >= selectedTime;
                break;
            case '<':
                show = cellTime < selectedTime;
                break;
            case '<=':
                show = cellTime <= selectedTime;
                break;
        }

        $row.toggle(show);
    });
}

function resetDateFilter() {
    $('#filter-date').val('');
    $('#filter-operator').prop('selectedIndex', 0);
    $('#filter-column').prop('selectedIndex', 0);

    $('#Prod-plan-table tbody tr').show();
}

$('#reset-date-filter').on('click', resetDateFilter);
$('#apply-date-filter').on('click', applyDateFilter);