$(document).ready(function () {

    // Привязка окон к кнопкам
    $('.logs-btn').attr('data-target', '#logs-window');
    $('.roles-btn').attr('data-target', '#roles-window');
    $('.reschedule-calendar-btn').attr('data-target', '#calendar-reschedule-window');

    function showWindow(windowId, btn) {
        // скрываем все окна
        $('#logs-window, #roles-window, #calendar-reschedule-window').hide();

        // показываем нужное
        $(windowId).show();

        // сбрасываем активную кнопку
        $('.admin-btn').removeClass('active');

        // делаем активной текущую
        $(btn).addClass('active');
    }

    // клик по кнопке
    $('.admin-btn').on('click', function () {
        const target = $(this).data('target');
        showWindow(target, this);
    });

    // стартовая вкладка (логи)
    showWindow('#logs-window', $('.logs-btn'));
});
