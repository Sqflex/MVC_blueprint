function loadPlanRows(planId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/lockedOnPlan/byPlan/${planId}`,
        method: "GET",
        success: function (response) {
            // Convert API response to array for table rendering
            currentPlanRows = response.map(row => ({
                lockedId: row.lockedId,
                appointUser: row.appointUser,
                assignedUser: row.assignedUser,
                deadlineDate: row.deadlineDate
            }));
            renderTable();
        },
        error: function (xhr, status, error) {
            console.error("Error loading plan rows:", error);
            alert("Не удалось загрузить данные плана!");
        }
    });
}

function renderTable() {
    const $tbody = $("#approve-table tbody");
    $tbody.empty();

    currentPlanRows.forEach((row, index) => {
        const tr = `
        <tr class="hover:bg-gray-50 transition-colors t-row" data-index="${index}">
            <td class="py-4 px-6 border-b border-gray-200 text-sm">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <span class="input-field text-field" role="textbox" contenteditable="false">${row.appointUser}</span>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200 td-prop">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <input type="text" class="datefield input-field" value="${row.deadlineDate}" disabled>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200">
                <div class="input-wrapper w-full p-2 border-gray-300 rounded-md">
                    <span class="input-field text-field" role="textbox" contenteditable="false">${row.assignedUser}</span>
                </div>
            </td>
            <td class="py-4 px-6 border-b border-gray-200 text-center">
                <div class="flex justify-center space-x-3">
                    <button class="edit-row p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                        <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button class="delete-row p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
        $tbody.append(tr);
    });
}

$("#approved-add").on("click", function () {
    const planId = $("#prodPlanDropdown").val();
    if (!planId) {
        alert("Выберите план!");
        return;
    }

    // Grab values from the "new row input fields" (last row or separate fields)
    const $newRow = $("#new-row"); // We can have a separate row for inputs, see below
    const appointUser = $newRow.find(".appointUser").val();
    const assignedUser = $newRow.find(".assignedUser").val();
    const deadlineDate = $newRow.find(".deadlineDate").val();

    if (!appointUser || !assignedUser || !deadlineDate) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    const newRowData = {
        planId: parseInt(planId),
        appointUser: appointUser,
        assignedUser: assignedUser,
        deadlineDate: deadlineDate
    };

    // Send POST request
    $.ajax({
        url: "http://localhost:8080/api/v1/lockedOnPlan",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newRowData),
        success: function (response) {
            // Add to local array and re-render table
            currentPlanRows.push({
                lockedId: response.lockedId,
                appointUser: response.appointUser,
                assignedUser: response.assignedUser,
                deadlineDate: response.deadlineDate
            });
            renderTable();

            // Clear input fields after add
            $newRow.find(".appointUser, .assignedUser, .deadlineDate").val("");
        },
        error: function () {
            alert("Не удалось добавить строку!");
        }
    });
});
