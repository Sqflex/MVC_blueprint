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
            input.removeAttribute('disabled');
            input.setAttribute('contenteditable', 'true');
            inputWrapper.classList.add('in-edit-mode');
            $(input).css('cursor', 'pointer');
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
        let inputTexts = currBtn.parent().parent().parent().children().children('.input-wrapper').children('.text-field');
        console.log(inputTexts);
        let inputDates = currBtn.parent().parent().parent().children().children('.input-wrapper').children('.datefield');
        console.log(inputDates);

        for (let i = 0; i < inputTexts.length; i++) {
            let inputText = inputTexts.get(i);
            let inputWrapper = inputWrappers.get(i);

            inputText.setAttribute('contenteditable', 'false');
            inputText.setAttribute('value', inputText.innerText);

            inputWrapper.classList.remove('in-edit-mode');
        }

        for (let i = 0; i < inputDates.length; i++) {
            let inputWrapper = inputWrappers.get(i);
            let inputDate = inputDates.get(i);
        
            inputDate.setAttribute('disabled', 'false');
            inputDate.setAttribute('contenteditable', 'false');
            inputDate.setAttribute('value', inputDate.value);

            inputWrapper.classList.remove('in-edit-mode');
        }

    });
}); 