$('#Prod-plan-table th.sortable').on('click', function () {

    const table = $(this).closest('table');
    const tbody = table.find('tbody');
    const colIndex = $(this).index();
    const asc = !$(this).hasClass('asc'); // переключение направления

    // Удаляем классы со всех заголовков
    table.find('th.sortable').removeClass('asc desc');

    // Добавляем классы текущему заголовку
    $(this).addClass(asc ? 'asc' : 'desc');

    const rows = tbody.find('tr').toArray();

    rows.sort(function (rowA, rowB) {

        let A = $(rowA).children('td').eq(colIndex).text().trim();
        let B = $(rowB).children('td').eq(colIndex).text().trim();

        // ---- СОРТИРОВКА ДАТ dd.mm.yyyy ----
        const dateReg = /^\d{2}\.\d{2}\.\d{4}$/;

        if (dateReg.test(A) && dateReg.test(B)) {
            const dA = A.split('.').reverse().join('');
            const dB = B.split('.').reverse().join('');
            return asc ? dA.localeCompare(dB) : dB.localeCompare(dA);
        }

        // ---- СОРТИРОВКА ЧИСЕЛ ----
        const numA = parseFloat(A.replace(',', '.'));
        const numB = parseFloat(B.replace(',', '.'));

        if (!isNaN(numA) && !isNaN(numB)) {
            return asc ? numA - numB : numB - numA;
        }

        // ---- СОРТИРОВКА ТЕКСТА ----
        return asc
            ? A.localeCompare(B, 'ru')
            : B.localeCompare(A, 'ru');
    });

    $.each(rows, (i, row) => tbody.append(row));
});

/* ---- row-aprroved need to be fixed ---- */
