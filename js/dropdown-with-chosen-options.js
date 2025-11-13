jQuery(document).ready(function($) {
    let dataItems = ["Тест", "выбора", "из", "справочника", "наименований", "Некто В.В."];

    // Function to populate a dropdown with available options
    function populateDropdown($dropdown, usedItems = []) {
        $dropdown.empty().append('<option value="">Выберите из справочника</option>');
        dataItems.forEach(item => {
            if (!usedItems.includes(item)) {
                $dropdown.append(`<option value="${item}">${item}</option>`);
            }
        });
    }

    // Initial population for existing dropdowns
    $('.dict-field-chosen').each(function() {
        populateDropdown($(this));
    });

    // 🔹 Delegated handler for dropdown selection (works for dynamically added rows too)
    $(document).on('change', '.dict-field-chosen', function() {
        const $dropdown = $(this);
        const selectedValue = $dropdown.val();
        if (!selectedValue) return;

        const $row = $dropdown.closest('tr');
        const $chosenContainer = $row.find('.chosen-container');

        // Create chosen item block
        const $item = $(`
            <div class="chosen-item" data-value="${selectedValue}">
                <span>${selectedValue}</span>
                <button id="delete-chosen" class="delete-btn p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        `);

        $chosenContainer.append($item);

        // Remove the chosen option from dropdown
        $dropdown.find(`option[value="${selectedValue}"]`).remove();

        // Reset dropdown
        $dropdown.val('');
    });

    // 🔹 Delegated handler for delete button (also works dynamically)
    $(document).on('click', '.delete-btn', function() {
        const $itemDiv = $(this).closest('.chosen-item');
        const value = $itemDiv.data('value');
        const $row = $(this).closest('tr');
        const $dropdown = $row.find('.dict-field-chosen');

        // Remove from chosen container
        $itemDiv.remove();

        // Add back to dropdown
        $dropdown.append(`<option value="${value}">${value}</option>`);

        // Sort dropdown alphabetically (optional)
        const options = $dropdown.find('option').not(':first').sort(function(a, b) {
            return $(a).text().localeCompare($(b).text());
        });
        $dropdown.append(options);
    });

    // 🔹 Example: dynamically adding a new table row
    $('#add-row-btn').on('click', function() {
        const $newRow = $(`
            <tr>
                <td>
                    <select class="dict-field-chosen form-select"></select>
                </td>
                <td class="chosen-container"></td>
            </tr>
        `);
        $('#my-table tbody').append($newRow);

        // Populate dropdown in the new row
        populateDropdown($newRow.find('.dict-field-chosen'));
    });
});
