$(document).ready(function () {
    $('form').submit(function (event) {
        let form = $(this);

        if (form.attr('id') == 'cartForm' || form.attr('id') == 'signin') {
            form.submit();
        } else {
            var formData = {
                'bookQuantity': form.find('#bookQuantity').val()
            };

            $.ajax({
                type: 'GET',
                url: form.attr('action'),
                data: formData
            }).done(function (data) {
                $('#cartSize').text(data.cartSize);
            });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        }
    });
}); 