jQuery(document).ready(function($){
    let dataItems = ["Тест", "выбора", "из", "справочника", "наименований", "Некто В.В."];

    // Populate each dropdown with the same data
    $('.dict-field-chosen').each(function() {
        const $dropdown = $(this);
        $dropdown.empty().append('<option value="">Выберите из справочника</option>');
        dataItems.forEach(item => {
            $dropdown.append(`<option value="${item}">${item}</option>`);
        });
    });

    // Handle selection per row
    $('.dict-field-chosen').on('change', function() {
        const $dropdown = $(this);
        const selectedValue = $dropdown.val();
        if (!selectedValue) return;

        const $row = $dropdown.closest('tr');
        const $chosenContainer = $row.find('.chosen-container');

        // Create chosen item div
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

        // Remove option from dropdown
        $dropdown.find(`option[value="${selectedValue}"]`).remove();

        // Reset dropdown
        $dropdown.val('');
    });

    // Handle deletion per row
    $('.chosen-container').on('click', '.delete-btn', function() {
        const $itemDiv = $(this).closest('.chosen-item');
        const value = $itemDiv.data('value');

        const $row = $(this).closest('tr');
        const $dropdown = $row.find('.dict-field-chosen');

        // Remove from chosen container
        $itemDiv.remove();

        // Add back to dropdown
        $dropdown.append(`<option value="${value}">${value}</option>`);

        // Optional: sort dropdown alphabetically
        const options = $dropdown.find('option').not(':first').sort(function(a, b) {
            return $(a).text().localeCompare($(b).text());
        });
        $dropdown.append(options);
    });
});