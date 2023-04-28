
$(document).ready(function () {
    $("#myPost").validate({
        rules: {
            title: {
                required: true,
                maxlength: 30
            },
            description: {
                required: true,
                maxlength: 300
            },
            image: {
                required: true,
                extension: "jpeg|png|gif"
            }
        },
        messages: {
            title: {
                required: "please enter title",
                maxlength: "please enter characters less than 30"
            },
            description: {
                required: "please enter description",
                maxlength: "please add description within 300 characters"
            },
            image: {
                required: "please choose image",extension: "require this format"
            }
        },
        submitHandler: function () {
            let title = $("#title").val();
            let description = $("#desc").val();
            let image = $("#image")[0].files[0];
            let formData = new FormData();

            formData.append('title', title);
            formData.append('description', description);
            formData.append('post-img', image);

            $.ajax({
                type: "POST",
                url: "/post",
                async: false,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response);
                    window.location.href = "/post"
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    })
})
