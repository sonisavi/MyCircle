$(document).ready(function () {
    $(".save-post").on('click', function (e) {
        console.log("clicked-save btn");
        const post = $(this).data('id');
        const saved= $(this).data('saved');

        console.log("fgnbgvcxnbvcvv" , typeof saved);
        $.ajax({
            url: "/post/save",
            type: "POST",
            data: {
                post: post,
                saved: Boolean(saved)

            },
            success: function (response) {
                console.log(response);
                // location.reload(); 

                

            },
            error: function (err) {
                console.log(err);
            }
        })

        
       


    })
})