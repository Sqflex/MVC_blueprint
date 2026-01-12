let universalId = 1;

// Get visible columns
function getVisibleColumns() {
    let visibleCols = [];
    $('#Prod-plan-table thead th').each(function(index) {
        if ($(this).is(':visible')) {
            visibleCols.push(index);
        }
    });
    return visibleCols;
}

// Render a single row based on API data and visible columns
function renderRow(rowData) {
    const visibleCols = getVisibleColumns();
    universalId++;

    let $tr = $('<tr>', {
        class: 'hover:bg-gray-50 transition-colors t-row not-approved',
        'data-row-id': rowData.rowsId
    });

    // Columns order matches your table
    const columns = [
        'rowsId', 'mainStatisticalSourceRow', 'additionalStatisticalSourceRow', 'additionalSourceDeadlineRow',
        'workNameRow', 'workPeriodicityRow', 'industryRow', 'executorDepartmentRow', 'responsibleExecutorRow',
        'reportingPeriodRow', 'primaryDataCollectionStartDateRow', 'primaryDataSubmissionDeadlineRow',
        'departmentTransferToGsuDeadlineRow', 'transferToBelstatGsuDeadlineRow', 'transferTimeToBelstatRow',
        'correctedDataToLongtermDbDeadlineRow', 'belstatWorkDeadlineRow', 'gsuWorkDeadlineRow',
        'belstatDevelopmentBreakdownRow', 'gsuDevelopmentBreakdownRow', 'aggregatedDataRecipientDepartmentRow',
        'belstatWorkResultRow', 'gsuWorkResultRow', 'publicationDeadlineRow', 'statusOfWorkRow', 'workDeadlineRow',
        'executorsRow', 'coexecutorsBelstatRow', 'dataRegistrySourcesRow', 'gsuWorkPeriodicityRow',
        'belstatWorkPeriodicityRow', 'deadlineTransferGsuToBelstatRow', 'deadlineTransferDepartmentsToGsuRow',
        'samplingSourceRow', 'developmentBreakdownIdRow', 'contractConclusionDeadlineRow',
        'industrialOperationStartDeadlineRow', 'contractorOrganizationRow', 'contractorExpectedOrganizationRow',
        'infoSubmissionDeadlineToContractorRow', 'workExecutionDeadlineRow', 'belstatResponsiblePersonsChoiceRow',
        'officialStatInfoNameRow', 'officialStatInfoPeriodicityRow', 'officialStatInfoRecipientOrgRow'
    ];

    columns.forEach((col, index) => {
        if (!visibleCols.includes(index)) return;

        let cellValue = rowData[col] !== null ? rowData[col] : '';
        let $td = $('<td>', { class: 'py-4 px-6 border-b border-gray-200 td-prop' });

        // Decide input type
        if (col.toLowerCase().includes('date') || col.toLowerCase().includes('deadline')) {
            let $input = $('<input>', {
                type: 'text',
                class: 'datefield input-field',
                value: cellValue,
                disabled: true
            });
            $td.append($input);
        } else if (col.toLowerCase().includes('select') || col.toLowerCase().includes('choice') || col.toLowerCase().includes('result')) {
            let $select = $('<select>', {
                class: 'input-field dict-field',
                disabled: true
            }).append($('<option>', { value: '', text: cellValue || 'Выберите из справочника' }));
            $td.append($select);
        } else {
            let $span = $('<span>', {
                class: 'input-field text-field',
                role: 'textbox',
                contenteditable: false,
                text: cellValue
            });
            $td.append($span);
        }

        $tr.append($td);
    });

    // Actions column
    let $actionsTd = $(`
        <td class="py-4 px-6 border-b border-gray-200 text-center">
            <div class="flex justify-center space-x-3">
                <button id="edit-row" class="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                    <span class="material-symbols-outlined text-sm">edit</span>
                </button>
                <button id="delete-row" class="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
                <div class="py-2 px-4 bg-red-500 text-white rounded-lg shadow-sm font-medium transition-all hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center gap-2">
                    <input type="checkbox" class="row-approved-checkbox">
                    <label>Подтверждён</label>
                </div>
            </div>
        </td>
    `);

    $tr.append($actionsTd);
    $('#Prod-plan-table tbody').append($tr);

    $tr.find('.datefield').datepicker();
}

// Fetch all rows
function fetchPlanRows(planId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/planRows/byPlan/${planId}`,
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
$(document).on('click', '#delete-row', function() {
    let $row = $(this).closest('tr');
    let rowId = $row.data('rowId');

    if (!rowId) {
        console.error('Row ID not found!');
        return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту строку?')) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/planRows/${rowId}`,
        type: 'DELETE',
        success: function() {
            $row.remove();
            console.log(`Row ${rowId} deleted successfully`);
        },
        error: function(err) {
            console.error('Error deleting row:', err);
            alert('Не удалось удалить строку.');
        }
    });
});

// Add new row
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
            url: `http://localhost:8080/api/v1/planRows`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newRowBody),
            success: function(createdRow) {
                renderRow(createdRow);
            },
            error: function(xhr, status, error) {
                console.error('Ошибка при добавлении строки:', error);
            }
        });
    });
});
