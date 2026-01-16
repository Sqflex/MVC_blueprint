function toBackendDateFormat(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return null;
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
}

function toFrontendDateFormat(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function initDatepickers(context) {
    $(context).find(".datefield").each(function () {
        if (!$(this).hasClass("hasDatepicker")) {
            $(this).datepicker({
                dateFormat: "dd.mm.yy",
                changeMonth: true,
                changeYear: true
            });
        }
    });
}

function loadPlanRows() {
    $.ajax({
        url: `${baseURL}/api/v1/lockedOnPlan/byPlan/${currentPlanId}`,
        method: "GET",
        success: function (response) {
            // Convert API response to array for table rendering
            currentPlanRows = response.map(row => ({
                lockedId: row.lockedId,
                appointUser: row.appointUser,
                assignedUser: row.assignedUser,
                deadlineDate: row.deadlineDate
            }));
            renderApprovedTable();
        },
        error: function (xhr, status, error) {
            console.error("Error loading plan rows:", error);
            alert("Не удалось загрузить данные плана!");
        }
    });
}

function renderApprovedTable() {
    const $tbody = $("#approve-table tbody");
    $tbody.empty();

    currentPlanRows.forEach((row, index) => {

        const appointUser = row.appointUser ?? "";
        const assignedUser = row.assignedUser ?? "";
        const deadlineDate = toFrontendDateFormat(row.deadlineDate) ?? "01.01." + new Date().getFullYear();

        const tr = `
        <tr class="hover:bg-gray-50 transition-colors t-row" data-locked-id="${row.lockedId}">
            <td class="py-4 px-6 border-b border-gray-200 text-sm">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <span class="input-field text-field" role="textbox" contenteditable="false">${appointUser}</span>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200 td-prop">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <input type="text" class="datefield input-field" value="${deadlineDate}" disabled>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <span class="input-field text-field" role="textbox" contenteditable="false">${assignedUser}</span>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200 text-center">
                <div class="flex justify-center space-x-3">
                    <button class="edit-approved-row p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                        <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button class="delete-approved-row p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
        $tbody.append(tr);
    });
}

$("#add-approved-row").on("click", function () {
    if (!currentPlanId) {
        alert("Выберите план!");
        return;
    }

    $.ajax({
        url: `${baseURL}/api/v1/lockedOnPlan`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            planId: parseInt(currentPlanId)
        }),
        success: function () {
            // 🔁 reload table from backend
            loadPlanRows();
        },
        error: function () {
            alert("Не удалось добавить строку!");
        }
    });
});

jQuery(document).ready(function($){

    // Кнопка "Удалить строку"
    $(document).on("click", ".delete-approved-row", function () {
        const $row = $(this).closest("tr");
        const lockedId = $row.data("locked-id");
    
        if (!lockedId) {
            $row.remove();
            return;
        }
    
        if (!confirm("Удалить строку?")) return;
    
        $.ajax({
            url: `${baseURL}/api/v1/lockedOnPlan/${lockedId}`,
            method: "DELETE",
            success: function () {
                $row.remove();
            },
            error: function () {
                alert("Не удалось удалить строку");
            }
        });
    });
    
    // Кнопка редактировать
    $(document).on("click", ".edit-approved-row", function () {
        const $currentBtn = $(this);
        const $row = $currentBtn.closest("tr");

        $currentBtn.removeClass('bg-yellow-100');
        $currentBtn.removeClass('text-yellow-600');
        $currentBtn.removeClass('hover:bg-yellow-200');
        $currentBtn.removeClass('focus:ring-yellow-500');

        $currentBtn.addClass('bg-green-100');
        $currentBtn.addClass('text-green-600');
        $currentBtn.addClass('hover:bg-green-200');
        $currentBtn.addClass('focus:ring-green-500');

        $currentBtn.children().html('Done');
        $currentBtn.removeAttr('id');
        $currentBtn.attr('id', 'done-approved-row');
    
        $row.find(".text-field").attr("contenteditable", true);
        $row.find(".datefield").prop("disabled", false);

        initDatepickers($row);
    
        $currentBtn
            .removeClass("edit-approved-row bg-yellow-100")
            .addClass("done-approved-row bg-green-100")
            .children().html('Done');

        let inputWrappers = $currentBtn.parent().parent().parent().children().children('.input-wrapper');
        let inputs = $currentBtn.parent().parent().parent().children().children('.input-wrapper').children('.input-field');
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

    // Кнопка "редактировать"
    $(document).on('click', '#edit-approved-row', function() {
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
        currentBtn.attr('id', 'done-approved-row');

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

            inputWrapper.classList.add('in-edit-approved-mode');
            $(input).css('cursor', 'pointer');
        }

    });

    $(document).on("click", ".done-approved-row", function () {
        const $btn = $(this);
        const $row = $btn.closest("tr");
    
        const lockedId = $row.data("locked-id");
    
        const appointUser = $row.find("td:eq(0) .text-field").text().trim() || null;
        const assignedUser = $row.find("td:eq(2) .text-field").text().trim() || null;
    
        const frontendDate = $row.find("td:eq(1) .datefield").val() || null;
    
        const backendDate = toBackendDateFormat(frontendDate);
    
        const payload = {
            lockedId,
            appointUser,
            assignedUser,
            deadlineDate: backendDate
        };
    
        $.ajax({
            url: `${baseURL}/api/v1/lockedOnPlan`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function () {
                // Lock UI
                $row.find(".text-field").attr("contenteditable", false);
    

                $row.find(".datefield")
                    .val(frontendDate)
                    .attr("value", frontendDate)
                    .prop("disabled", true);
    
                // Update button
                $btn
                    .removeClass("done-approved-row bg-green-100")
                    .addClass("edit-approved-row bg-yellow-100")
                    .children().html("edit");
    
                console.log("Row updated successfully:", payload);
            },
            error: function (xhr) {
                console.error("Error updating row:", xhr.responseText);
                alert("Не удалось сохранить изменения");
            }
        });
    });    
    
    
    // Стили после нажатия
    $(document).on('click', '#done-approved-row', function() {
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
        currBtn.attr('id', 'edit-approved-row');

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
    });
}); 



