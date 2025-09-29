 $(document).on('focus', '#job-span', function() {
        let currEl = $(this);
        console.log(currEl.parent().children());
    });