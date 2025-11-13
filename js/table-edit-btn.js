jQuery(document).ready(function($){

    let universalId = 1;
    // Кнопка "Удалить строку"
    $(document).on("click", '#delete-row', function() {
        $(this).closest('tr').remove();
    })

    // Кнопка "редактировать"
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
        let chosenButtons = inputWrappers.children('.chosen-container').children('.chosen-item').children('#delete-chosen');
        console.log(inputs);

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

    // Кнопка "сохранить"
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

    // Чекбокс "Подтвержден"
    $('#row-approved').change(function() {
        let currCheckbox = $(this).parent();
        let currRow = $(this).parent().parent().parent().parent();
        if ($(this).is(':checked')) {
            currCheckbox.removeClass('bg-red-500');
            currCheckbox.addClass('bg-green-600');
            currRow.removeClass('not-approved');
            currRow.addClass('approved');
        } else {
            currCheckbox.removeClass('bg-green-600');
            currCheckbox.addClass('bg-red-500');
            currRow.removeClass('approved');
            currRow.addClass('not-approved');
        }
    });

    // Кнопка "Добавить строку"

    $('#add-row-pp-table').on('click', function() {
        const $newRow = $(`
                                    <tr id="plan_row" class="hover:bg-gray-50 transition-colors t-row not-approved">
                                        <td id="number_row" class="py-4 px-6 border-b border-gray-200 text-sm">
                                            <div id="number_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span
                                                    class="input-field text-field"
                                                    role="textbox"
                                                    contenteditable="false">
                                                    ${universalId}
                                                </span>
                                            </div>
                                        </td>
                                        <td id="main_statistical_source_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="main_statistical_source_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span
                                                    id="main_statistical_source_row_span"
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="additional_statistical_source_row" class="py-4 px-6 border-b border-gray-200">
                                            <div id="additional_statistical_source_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span
                                                    class="input-field input-dict-field"
                                                    role="textbox"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Данные о численности населения, проживающего в зонах радиоактивного загрязнения"]'
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="additional_source_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="additional_source_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="additional_source_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false">
                                            </div>
                                        </td>
                                        <td id="work_name_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="work_name_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Наименование работы"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="work_periodicity_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="work_periodicity_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="industry_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="industry_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="executor_department_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="executor_department_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="executor-department-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select>
                                                <!-- <span 
                                                    class="input-field text-field"
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> Справочник -->
                                            </div>
                                        </td>
                                        <td id="responsible_executor_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="responsible_executor_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field text-field"
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="reporting_period_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="reporting_period_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field text-field"
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="primary_data_collection_start_date_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="primary_data_collection_start_date_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="primary_data_collection_start_date_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="primary_data_submission_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="primary_data_submission_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="primary_data_submission_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="department_transfer_to_gsu_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="department_transfer_to_gsu_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="department_transfer_to_gsu_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="transfer_to_belstat_gsu_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="transfer_to_belstat_gsu_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="transfer_to_belstat_gsu_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="transfer_time_to_belstat_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="transfer_time_to_belstat_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field text-field"
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="corrected_data_to_longterm_db_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="corrected_data_to_longterm_db_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="corrected_data_to_longterm_db_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="belstat_work_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="belstat_work_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="belstat_work_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="gsu_work_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="gsu_work_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="gsu_work_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="belstat_development_breakdown_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="belstat_development_breakdown_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="belstat-development-breakdown-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник -->
                                            </div>
                                        </td>
                                        <td id="gsu_development_breakdown_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="gsu_development_breakdown_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="gsu-development-breakdown-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник -->
                                            </div>
                                        </td>
                                        <td id="aggregated_data_recipient_department_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="aggregated_data_recipient_department_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="aggregated_data_recipient_department_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>                                        
                                        <td id="belstat_work_result_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="belstat_work_result_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="belstat-work-result-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник -->
                                            </div>
                                        </td>
                                        <td id="gsu_work_result_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="gsu_work_result_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="belstat-work-result-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник -->
                                            </div>
                                        </td>
                                        <td id="publication_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="publication_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="publication_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="status_of_work_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="status_of_work_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="status-of-work-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник -->
                                            </div>
                                        </td>
                                        <td id="work_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="work_deadline_row" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="work_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="executors_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="executors_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="coexecutors_belstat_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="coexecutors_belstat_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="data_registry_sources_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="data_registry_sources_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="gsu_work_periodicity_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="gsu_work_periodicity_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="belstat_work_periodicity_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="belstat_work_periodicity_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="deadline_transfer_gsu_to_belstat_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="deadline_transfer_gsu_to_belstat_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="deadline_transfer_gsu_to_belstat_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="deadline_transfer_departments_to_gsu_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="deadline_transfer_departments_to_gsu_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="deadline_transfer_departments_to_gsu_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="sampling_source_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="sampling_source_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="development_breakdown_id_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="development_breakdown_id_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="contract_conclusion_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="contract_conclusion_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="contract_conclusion_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="industrial_operation_start_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="industrial_operation_start_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="industrial_operation_start_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="contractor_organization_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="contractor_organization_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="contractor_expected_organization_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="contractor_expected_organization_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="info_submission_deadline_to_contractor_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="info_submission_deadline_to_contractor_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="info_submission_deadline_to_contractor_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="work_execution_deadline_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="work_execution_deadline_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <input id="work_execution_deadline_row_date_field_${universalId}" type="text" class="datefield input-field" value="01.11.2025" disabled="false"> <!-- Календарь -->
                                            </div>
                                        </td>
                                        <td id="belstat_responsible_persons_choice_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="belstat_responsible_persons_choice_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="belstat-responsible-persons-choice-row-select" class="input-field dict-field dict-field-chosen" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- Справочник/ручной ввод -->
                                                <div class="chosen-container" id="belstat-responsible-persons-choice-row-chosen">

                                                </div>
                                            </div>
                                        </td>
                                        <td id="official_stat_info_name_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="official_stat_info_name_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <select id="official-stat-info-name-row-select" class="input-field dict-field" aria-label="Выберите из справочника" disabled>
                                                    <option value="Выберите из справочника">Выберите из справочника</option>
                                                </select> <!-- справочник -->
                                            </div>
                                        </td>
                                        <td id="official_stat_info_periodicity_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="official_stat_info_periodicity_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td id="official_stat_info_recipient_org_row" class="py-4 px-6 border-b border-gray-200 td-prop">
                                            <div id="official_stat_info_recipient_org_row_div" class="input-wrapper w-full p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                                <span 
                                                    class="input-field input-dict-field"
                                                    data-items='["Тест","Поля","для","ввода","по справочнику", "Основной источник формирования статистической информации (индекс формы, иной источник)"]'
                                                    role="textbox"
                                                    contenteditable="false">
                                                </span> <!-- Справочник/ручной ввод -->
                                            </div>
                                        </td>
                                        <td class="py-4 px-6 border-b border-gray-200 text-center">
                                            <div class="flex justify-center space-x-3">
                                                <button
                                                    id="edit-row" class="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                                >
                                                    <span class="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button
                                                    id="delete-row" class="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                >
                                                    <span class="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                                <div class="py-2 px-4 bg-red-500 text-white rounded-lg shadow-sm font-medium transition-all hover:bg-red-500 focus:outline-none focus:ring-2 
                                                focus:ring-primary-500 focus:ring-opacity-50 flex items-center gap-2">
                                                    <input type="checkbox" id="row-approved">
                                                    <label for="row-approved">Подтверждён</label>
                                                </div>
                                            </div>
                                        </td>
                                        <div id="suggestions" class="suggestions" style="display:none;"></div>  <!-- Справочник/ручной ввод поле-->
                                    </tr>   
        `);
        $('#Prod-plan-table tbody').append($newRow);

        $newRow.find('.datefield').datepicker();
        console.log(universalId);
        universalId+=1;
    });
}); 