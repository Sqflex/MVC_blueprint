$(document).ready(function() {

  // Toggle dropdown on button click
  $('.drop-hid-col-btn').on('click', function() {
      $('.dropdown-content-hidden-col').toggleClass('show');
  });

  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
      if (!$(e.target).closest('.dropdown-hid-col').length) {
          $('.dropdown-content-hidden-col').removeClass('show');
      }
  });

  // Hide columns for unchecked checkboxes on initial load
  $('.col-toggle').each(function() {
      const colIndex = $(this).data('col');
      const isChecked = $(this).prop('checked');
      toggleColumn(colIndex, isChecked);
  });

  // Handle checkbox changes
  $('.col-toggle').on('change', function() {
      const colIndex = $(this).data('col');
      const isChecked = $(this).prop('checked');
      toggleColumn(colIndex, isChecked);
  });

  // Toggle visibility of the column
  function toggleColumn(colIndex, show) {
      $('#Prod-plan-table tr').each(function() {
          const cell = $(this).find('th, td').eq(colIndex);
          if (cell.length) {
              cell.css('display', show ? '' : 'none');
          }
      });
  }

  // Search through checkbox labels
  $('#col-search').on('keyup', function () {
    let search = $(this).val().toLowerCase().trim();

    $('.checkbox-grid label').each(function () {
        let text = $(this).text().toLowerCase();

        // Show if matches search
        $(this).toggle(text.includes(search));
    });
  });
});
