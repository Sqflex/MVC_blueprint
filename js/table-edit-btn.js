let universalId = 0;

const ROW_FIELDS = [
    'rowsId',
    'mainStatisticalSourceRow',
    'additionalStatisticalSourceRow',
    'additionalSourceDeadlineRow',
    'workNameRow',
    'workPeriodicityRow',
    'industryRow',
    'executorDepartmentRow',
    'responsibleExecutorRow',
    'reportingPeriodRow',
    'primaryDataCollectionStartDateRow',
    'primaryDataSubmissionDeadlineRow',
    'departmentTransferToGsuDeadlineRow',
    'transferToBelstatGsuDeadlineRow',
    'transferTimeToBelstatRow',
    'correctedDataToLongtermDbDeadlineRow',
    'belstatWorkDeadlineRow',
    'gsuWorkDeadlineRow',
    'belstatDevelopmentBreakdownRow',
    'gsuDevelopmentBreakdownRow',
    'aggregatedDataRecipientDepartmentRow',
    'belstatWorkResultRow',
    'gsuWorkResultRow',
    'publicationDeadlineRow',
    'statusOfWorkRow',
    'workDeadlineRow',
    'executorsRow',
    'coexecutorsBelstatRow',
    'dataRegistrySourcesRow',
    'gsuWorkPeriodicityRow',
    'belstatWorkPeriodicityRow',
    'deadlineTransferGsuToBelstatRow',
    'deadlineTransferDepartmentsToGsuRow',
    'samplingSourceRow',
    'developmentBreakdownIdRow',
    'contractConclusionDeadlineRow',
    'industrialOperationStartDeadlineRow',
    'contractorOrganizationRow',
    'contractorExpectedOrganizationRow',
    'infoSubmissionDeadlineToContractorRow',
    'workExecutionDeadlineRow',
    'belstatResponsiblePersonsChoiceRow',
    'officialStatInfoNameRow',
    'officialStatInfoPeriodicityRow',
    'officialStatInfoRecipientOrgRow'
];

function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return '';

    const parts = dateStr.split('-'); // ['2025', '12', '31']
    if (parts.length !== 3) return dateStr;

    return `${parts[2]}.${parts[1]}.${parts[0]}`; // dd.mm.yyyy
}

function getCellValue($td) {
    const $input = $td.find('input, select');

    if ($input.length) {
        let val = $input.val();

        if (!val || val.trim() === '') return null;

        if (/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
            const [d, m, y] = val.split('.');
            return `${y}-${m}-${d}`;
        }

        return val;
    }

    const $span = $td.find('[contenteditable]');
    if ($span.length) {
        let text = $span.text().trim();
        return text === '' ? null : text;
    }

    return null;
}

// Get visible columns
function getVisibleFields() {
    const visibleFields = new Set();

    $('#Prod-plan-table thead th').each(function () {
        const field = $(this).data('field');

        if (!field) return;

        if (field === 'actionBtns') return;

        if ($(this).is(':visible')) {
            visibleFields.add(field);
        }
    });

    return visibleFields;
}

function renderActionsColumn(isApproved) {
    const checked = isApproved ? 'checked' : '';
    const bgClass = isApproved ? 'bg-green-600' : 'bg-red-500';
    const rowClass = isApproved ? 'approved' : 'not-approved';
    const disabledAttr = isApproved ? 'disabled' : '';

    const $td = $(`
        <td class="py-4 px-6 border-b border-gray-200 text-center"
            data-field="actionBtns"
            data-fixed="true">
            <div class="flex justify-center space-x-3">
                <button id="edit-row"
                        ${disabledAttr}
                        class="p-2 bg-yellow-100 text-yellow-600 rounded-full
                               hover:bg-yellow-200 disabled:opacity-40
                               disabled:cursor-not-allowed">
                    <span class="material-symbols-outlined text-sm">edit</span>
                </button>

                <button id="delete-row"
                        ${disabledAttr}
                        class="p-2 bg-red-100 text-red-600 rounded-full
                               hover:bg-red-200 disabled:opacity-40
                               disabled:cursor-not-allowed">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>

                <div class="py-2 px-4 text-white rounded-lg flex items-center gap-2 ${bgClass}">
                    <input type="checkbox"
                           class="row-approved-checkbox"
                           ${checked}>
                    <label>Подтверждён</label>
                </div>
            </div>
        </td>
    `);

    $td.closest('tr').addClass(rowClass);
    return $td;
}

function renderRow(rowData) {
    universalId++;

    let $tr = $('<tr>', {
        class: 'hover:bg-gray-50 transition-colors t-row',
        'data-row-id': rowData.rowsId
    });

    if (rowData.approved) {
        $tr.addClass('approved');
    } else {
        $tr.addClass('not-approved');
    }

    const columns = ROW_FIELDS;

    columns.forEach(col => {
        let $td = $('<td>', {
            class: 'py-4 px-6 border-b border-gray-200 td-prop',
            'data-field': col
        });

        let $div = $('<div>', {
            class: 'input-wrapper w-full p-2 border-gray-300 rounded-md'
        });

        $td.append($div);

        if (col === 'rowsId') {
            $div.append($('<span>', {
                class: 'input-field text-field font-semibold',
                text: universalId
            }));
            $tr.append($td);
            return;
        }

        let cellValue = rowData[col] ?? '';

        if (col.toLowerCase().includes('date') || col.toLowerCase().includes('deadline')) {
            $div.append(
                $('<input>', {
                    type: 'text',
                    class: 'datefield input-field',
                    value: formatDateToDDMMYYYY(cellValue),
                    disabled: true
                })
            );
        } else if (
            col.toLowerCase().includes('choice') ||
            col.toLowerCase().includes('result') ||
            col.toLowerCase().includes('periodicity')
        ) {
            $div.append(
                $('<select>', {
                    class: 'input-field dict-field',
                    disabled: true
                }).append(
                    $('<option>', {
                        value: '',
                        text: cellValue || 'Выберите из справочника'
                    })
                )
            );
        } else {
            $div.append(
                $('<span>', {
                    class: 'input-field text-field',
                    contenteditable: false,
                    text: cellValue
                })
            );
        }

        $tr.append($td);
    });

    $tr.append(renderActionsColumn(rowData.approved));

    $('#Prod-plan-table tbody').append($tr);

    $tr.find('.datefield').datepicker();

    columns.forEach((col, index) => {
        const colNumber = index + 1;
        const show = columnVisibilityMap[colMap[colNumber]] ?? true;
        toggleColumn(colNumber, show);
    });
}

// Fetch all rows
function fetchPlanRows(planId) {
    universalId = 0;

    $.ajax({
        url: `${baseURL}/api/v1/planRows/byPlan/${planId}`,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#Prod-plan-table tbody').empty();
            data.forEach(row => renderRow(row));
        },
        error: function(xhr, status, error) {
            console.error('Ошибка при получении строк:', error);
        }
    });
}


// Delete row handler
$(document).on('click', '#delete-row', function () {
    const $row = $(this).closest('tr');
    const rowId = Number($row.data('rowId'));

    if (!rowId) {
        console.error('Row ID not found!');
        return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту строку?')) return;

    $.ajax({
        url: `${baseURL}/api/v1/planRows/${rowId}`,
        type: 'DELETE',
        success: function () {
            $row.remove();
            console.log(`Row ${rowId} deleted successfully`);
        },
        error: function (err) {
            console.error('Error deleting row:', err);
            alert('Не удалось удалить строку.');
        }
    });
});

$(document).ready(function($) {

    $('#add-row-pp-table').on('click', function() {
        let newRowBody = {
            planId: currentPlanId,
            mainStatisticalSourceRow: '',
            additionalStatisticalSourceRow: '',
            additionalSourceDeadlineRow: null,
            workNameRow: '',
            workPeriodicityRow: '',
            industryRow: '',
            executorDepartmentRow: '',
            responsibleExecutorRow: '',
            reportingPeriodRow: '',
            primaryDataCollectionStartDateRow: null,
            primaryDataSubmissionDeadlineRow: null,
            departmentTransferToGsuDeadlineRow: null,
            transferToBelstatGsuDeadlineRow: null,
            transferTimeToBelstatRow: '',
            correctedDataToLongtermDbDeadlineRow: null,
            belstatWorkDeadlineRow: null,
            gsuWorkDeadlineRow: null,
            belstatDevelopmentBreakdownRow: '',
            gsuDevelopmentBreakdownRow: '',
            aggregatedDataRecipientDepartmentRow: null,
            belstatWorkResultRow: '',
            gsuWorkResultRow: '',
            publicationDeadlineRow: null,
            statusOfWorkRow: '',
            workDeadlineRow: null,
            executorsRow: '',
            coexecutorsBelstatRow: '',
            dataRegistrySourcesRow: '',
            gsuWorkPeriodicityRow: '',
            belstatWorkPeriodicityRow: '',
            deadlineTransferGsuToBelstatRow: null,
            deadlineTransferDepartmentsToGsuRow: null,
            samplingSourceRow: '',
            developmentBreakdownIdRow: '',
            contractConclusionDeadlineRow: null,
            industrialOperationStartDeadlineRow: null,
            contractorOrganizationRow: '',
            contractorExpectedOrganizationRow: '',
            infoSubmissionDeadlineToContractorRow: null,
            workExecutionDeadlineRow: null,
            belstatResponsiblePersonsChoiceRow: '',
            officialStatInfoNameRow: '',
            officialStatInfoPeriodicityRow: '',
            officialStatInfoRecipientOrgRow: ''
        };

        $.ajax({
            url: `${baseURL}/api/v1/planRows`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newRowBody),
            success: function () {
                fetchPlanRows(currentPlanId);
            },
            error: function(xhr, status, error) {
                console.error('Ошибка при добавлении строки:', error);
            }
        });
    });

    $(document).on('click', '#edit-row', function () {
    const $row = $(this).closest('tr');

    if ($row.hasClass('approved')) return;

    // Switch button
    $(this)
        .attr('id', 'done-row')
        .removeClass('bg-yellow-100 text-yellow-600')
        .addClass('bg-green-100 text-green-600')
        .children().text('Done');

    // EDIT ONLY DATA CELLS
    $row.find('td.td-prop').each(function () {
        const field = $(this).data('field');
        if (!field || field === 'rowsId') return;

        $(this).find('.text-field').attr('contenteditable', true);
        $(this).find('input, select').prop('disabled', false);
        $(this).find('.input-wrapper').addClass('in-edit-mode');
    });
});


// Кнопка "сохранить"
$(document).on('click', '#done-row', function () {
    const $row = $(this).closest('tr');
    const rowId = $row.data('rowId');

    if (!rowId) return;

    // Switch button
    $(this)
        .attr('id', 'edit-row')
        .removeClass('bg-green-100 text-green-600')
        .addClass('bg-yellow-100 text-yellow-600')
        .children().text('edit');

    // LOCK DATA CELLS BACK
    $row.find('td.td-prop').each(function () {
        const field = $(this).data('field');
        if (!field || field === 'rowsId') return;

        $(this).find('.text-field').attr('contenteditable', false);
        $(this).find('input, select').prop('disabled', true);
        $(this).find('.input-wrapper').removeClass('in-edit-mode');
    });

    // BUILD BODY
    let body = {
        rowsId: rowId,
        planId: currentPlanId
    };

    $row.find('td.td-prop').each(function () {
        const field = $(this).data('field');
        if (!field || field === 'rowsId') return;
        body[field] = getCellValue($(this));
    });

    $.ajax({
        url: `${baseURL}/api/v1/planRows`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body),
        error: function () {
            alert('Не удалось сохранить изменения');
        }
        });
    });
});

$('#Prod-plan-table').on('change', '.row-approved-checkbox', function () {
    const $checkbox = $(this);
    const $container = $checkbox.closest('div');
    const $row = $checkbox.closest('tr');
    const $editBtn = $row.find('#edit-row');
    const $deleteBtn = $row.find('#delete-row');

    const approved = $checkbox.is(':checked');
    const rowId = $row.data('rowId');

    if (!rowId || !currentPlanId) return;

    // Optimistic UI
    if (approved) {
        $container.removeClass('bg-red-500').addClass('bg-green-600');
        $row.removeClass('not-approved').addClass('approved');
        $editBtn.prop('disabled', true);
        $deleteBtn.prop('disabled', true);
    } else {
        $container.removeClass('bg-green-600').addClass('bg-red-500');
        $row.removeClass('approved').addClass('not-approved');
        $editBtn.prop('disabled', false);
        $deleteBtn.prop('disabled', false);
    }

    $.ajax({
        url: `${baseURL}/api/v1/planRows/approved`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            rowsId: rowId,
            planId: currentPlanId,
            approved: approved
        }),
        error: function () {
            $checkbox.prop('checked', !approved);

            if (!approved) {
                $container.removeClass('bg-red-500').addClass('bg-green-600');
                $row.removeClass('not-approved').addClass('approved');
                $editBtn.prop('disabled', true);
                $deleteBtn.prop('disabled', true);
            } else {
                $container.removeClass('bg-green-600').addClass('bg-red-500');
                $row.removeClass('approved').addClass('not-approved');
                $editBtn.prop('disabled', false);
                $deleteBtn.prop('disabled', false);
            }

            alert('Ошибка при изменении статуса подтверждения');
        }
    });
});