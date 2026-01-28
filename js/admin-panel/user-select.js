$('.user-item').on('click', function () {
    const userId = $(this).data('user-id');

    // визуально выделяем выбранного
    $('.user-item').removeClass('bg-gray-100 font-semibold');
    $(this).addClass('bg-gray-100 font-semibold');

    // показываем панель
    $('#no-user-selected').hide();
    $('#permissions-content').show();

    // очищаем старые данные
    $('#plans-permissions-body').empty();
    $('.role-checkbox').prop('checked', false);

    // ---- ЗАГЛУШКА ДАННЫХ (потом заменишь на AJAX) ----
    const plans = [
        { id: 1, name: 'План 2026 – Промышленность' },
        { id: 2, name: 'План 2026 – Строительство' }
    ];

    plans.forEach(plan => {
        $('#plans-permissions-body').append(`
            <tr class="border-t">
                <td class="p-3">${plan.name}</td>
                <td class="text-center">
                    <input type="checkbox" data-plan-id="${plan.id}" data-type="edit">
                </td>
                <td class="text-center">
                    <input type="checkbox" data-plan-id="${plan.id}" data-type="approve">
                </td>
            </tr>
        `);
    });
});