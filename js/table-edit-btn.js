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

    // Expecting dateStr like '2025-12-31'
    const parts = dateStr.split('-'); // ['2025', '12', '31']
    if (parts.length !== 3) return dateStr; // fallback

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
    
        let $td = $('<td>', {
            class: 'py-4 px-6 border-b border-gray-200 td-prop',
            'data-field': col
        });
    
        let $div = $('<div>', {
            class: 'input-wrapper w-full p-2 border-gray-300 rounded-md'
        });
    
        $td.append($div);
    
        if (col === 'rowsId') {
            let $span = $('<span>', {
                class: 'input-field text-field font-semibold',
                text: universalId
            });
    
            $div.append($span);
            $tr.append($td);
            return;
        }
    
        let cellValue = rowData[col] !== null ? rowData[col] : '';
    
        if (col.toLowerCase().includes('date') || col.toLowerCase().includes('deadline')) {
            let formattedValue = formatDateToDDMMYYYY(cellValue);
        
            let $input = $('<input>', {
                type: 'text',
                class: 'datefield input-field',
                value: formattedValue,
                disabled: true
            });
            $div.append($input);
        } else if (
            col.toLowerCase().includes('choice') ||
            col.toLowerCase().includes('result') ||
            col.toLowerCase().includes('periodicity')
        ) {
            let $select = $('<select>', {
                class: 'input-field dict-field',
                disabled: true
            }).append(
                $('<option>', {
                    value: '',
                    text: cellValue || 'Выберите из справочника'
                })
            );
            $div.append($select);
    
        } else {
            let $span = $('<span>', {
                class: 'input-field text-field',
                contenteditable: false,
                text: cellValue
            });
            $div.append($span);
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
    universalId = 0;

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
$(document).on('click', '#delete-row', function () {
    const $row = $(this).closest('tr');
    const rowId = Number($row.data('rowId'));

    if (!rowId) {
        console.error('Row ID not found!');
        return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту строку?')) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/planRows/${rowId}`,
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
            success: function () {
                fetchPlanRows(currentPlanId);
            },
            error: function(xhr, status, error) {
                console.error('Ошибка при добавлении строки:', error);
            }
        });
    });

    $(document).on('click', '#edit-row', function() {
    let currentBtn = $(this);

    currentBtn.removeClass('bg-yellow-100');
    currentBtn.removeClass('text-yellow-600');
    currentBtn.removeClass('hover:bg-yellow-200');
    currentBtn.removeClass('focus:ring-yellow-500');

    currentBtn.addClass('bg-green-100');
    currentBtn.addClass('text-green-600');
    currentBtn.addClass('hover:bg-green-200');
    currentBtn.addClass('focus:ring-green-500');

    currentBtn.children().html('Done');
    currentBtn.removeAttr('id');
    currentBtn.attr('id', 'done-row');

    let inputWrappers = currentBtn.parent().parent().parent().children().children('.input-wrapper');
    let inputs = currentBtn.parent().parent().parent().children().children('.input-wrapper').children('.input-field');
    let chosenButtons = inputWrappers.children('.chosen-container').children('.chosen-item').children('#delete-chosen');

    for(let i = 0; i < inputs.length; i++) {
        let input = inputs.get(i);
        let inputWrapper = inputWrappers.get(i);
        let chosenButton = chosenButtons.get(i);
        input.removeAttribute('disabled');
        input.setAttribute('contenteditable', 'true');

        if (typeof(chosenButton) !== 'undefined') {
            chosenButton.removeAttribute('disabled');
        }

        inputWrapper.classList.add('in-edit-mode');
        $(input).css('cursor', 'pointer');
    }

});

// Кнопка "сохранить"
$(document).on('click', '#done-row', function() {
    let currBtn = $(this);

    currBtn.removeClass('bg-green-100');
    currBtn.removeClass('text-green-600');
    currBtn.removeClass('hover:bg-green-200');
    currBtn.removeClass('focus:ring-green-500');

    currBtn.addClass('bg-yellow-100');
    currBtn.addClass('text-yellow-600');
    currBtn.addClass('hover:bg-yellow-200');
    currBtn.addClass('focus:ring-yellow-500');

    currBtn.children().html('edit');
    currBtn.removeAttr('id');
    currBtn.attr('id', 'edit-row');

    let inputWrappers = currBtn.parent().parent().parent().children().children('.input-wrapper');

    for (let i = 0; i < inputWrappers.length; i++) {
        let inputDictField = inputWrappers.children('.input-dict-field').get(i);
        let dictField = inputWrappers.children('.dict-field').get(i);
        let chosenButton = inputWrappers.children('.chosen-container').children('.chosen-item').children('#delete-chosen').get(i);
        let inputText = inputWrappers.children('.text-field').get(i);
        let inputDate = inputWrappers.children('.datefield').get(i);
        let inputWrapper = inputWrappers.get(i);

        if (typeof(inputText) !== 'undefined') {
            inputText.setAttribute('contenteditable', 'false'); 
            inputText.setAttribute('value', inputText.innerText);
            $(inputText).css('cursor', 'default');
        }

        if (typeof(inputDate) !== 'undefined') {
            inputDate.setAttribute('disabled', 'false');
            inputDate.setAttribute('contenteditable', 'false');
            inputDate.setAttribute('value', inputDate.value);
            $(inputDate).css('cursor', 'default');
        }

        if (typeof(inputDictField) !== 'undefined') {
            inputDictField.setAttribute('contenteditable', 'false');
            inputDictField.setAttribute('value', inputDictField.value);
            $(inputDictField).css('cursor', 'default');
        }

        if (typeof(dictField) !== 'undefined') {
            dictField.setAttribute('disabled', 'false');
            dictField.setAttribute('value', dictField.value);
            $(dictField).css('cursor', 'default');
        }

        if (typeof(chosenButton) !== 'undefined') {
            chosenButton.setAttribute('disabled', 'false');
        }
        inputWrapper.classList.remove('in-edit-mode');
    }

    const $row = $(this).closest('tr');
    const rowId = $row.data('rowId');


    if (!rowId) {
        alert('Row ID not found');
        return;
    }

    let body = {
        rowsId: rowId,
        planId: currentPlanId
    };

    // Collect data from visible + hidden columns in DOM order
    $row.find('td.td-prop').each(function () {
        const fieldName = $(this).data('field');
        if (!fieldName || fieldName === 'rowsId') return;

        body[fieldName] = getCellValue($(this));
    });


    $.ajax({
        url: 'http://localhost:8080/api/v1/planRows',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function () {
            // lock row back
            $row.find('input, select').prop('disabled', true);
            $row.find('[contenteditable]').attr('contenteditable', false);

            console.log(`Row ${rowId} updated`);
        },
        error: function (err) {
            console.error('PUT failed:', err);
            alert('Не удалось сохранить изменения');
        }
    });
    
    });
});