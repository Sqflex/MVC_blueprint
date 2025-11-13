jQuery(document).ready(function($){
    let activeField = null;
    let fieldParent = null;

    $(document).on("input", ".input-dict-field", function() {
        activeField = $(this);
        fieldParent = $(this).parent();

        const items = JSON.parse(activeField.attr("data-items"));
        const value = activeField.text().trim().toLowerCase();

        const matches = items.filter(item => item.toLowerCase().includes(value));

    if (!value || matches.length === 0) {
        $("#suggestions").hide();
        return;
    }

    $("#suggestions")
        .html(matches.map(item => `<div>${item}</div>`).join(""))
        .show()
        .css({
            top: fieldParent.offset().top + fieldParent.outerHeight(),
            left: fieldParent.offset().left,
            innerWidth: fieldParent.width()
        });
    });

    $("#suggestions").on("click", "div", function() {
        activeField.text($(this).text());
        $("#suggestions").hide();
    });

    $(document).on("click", function(e) {
        if (!$(e.target).closest(".input-dict-field, #suggestions").length) {
        $("#suggestions").hide();
        }
    });
});