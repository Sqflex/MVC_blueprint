jQuery(document).ready(function($){
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

        for(let i = 0; i < inputs.length; i++) {
            let input = inputs.get(i);
            let inputWrapper = inputWrappers.get(i);
            input.setAttribute('contenteditable', 'true');
            input.removeAttribute('disabled');
            inputWrapper.classList.add('in-edit-mode');
        }

    });

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
        let inputs = currBtn.parent().parent().parent().children().children('.input-wrapper').children('.input-field');

        for (let i = 0; i < inputWrappers.length; i++) {
            let input = inputs.get(i);
            let inputWrapper = inputWrappers.get(i);
            input.removeAttribute('contenteditable', 'false');
            inputWrapper.classList.remove('in-edit-mode');
        }

    });
}); 