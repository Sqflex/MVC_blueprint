$(document).ready(function() {
    // Toggle dropdown on button click
    $('.drop-hid-col-btn').on('click', function() {
      $('.dropdown-content-hidden-col').toggleClass('show');
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.dropdown-hid-col').length) {
        $('.dropdown-content').removeClass('show');
      }
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
  });