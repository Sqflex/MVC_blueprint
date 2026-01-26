jQuery(document).ready(function($){
    let dataItems = ["Тест", "выбора", "из", "справочника", "наименований", "Некто В.В."];

    $(document).on('focus', '.dict-field', function() {
        const $sel = $(this);
        if ($sel.find('option').length <= 1) {
        $sel.empty();
        dataItems.forEach(item => {
            $sel.append($('<option>').val(item).text(item));
        });
        }
    });

  $(document).on('change', '.dict-field', function() {
    const selectedValue = $(this).val();
  });

});