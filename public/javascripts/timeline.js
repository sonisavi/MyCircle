$(document).ready(function () {
    $(".edit-post").on('click', function (e) {
        console.log("clicked");
        const postId = $(this).data('id');
        $.ajax({
            url: "/post/" + postId,
            type: "GET",
            success: function (response) {
                console.log(response);
                $("#old-title").val(response.title);
                $("#old-desc").val(response.description);
                // $("#old-image").val(response.image);
                // alert("sss")
                $("#editPostModal").modal("show");

            },
            error: function (err) {
                console.log(err);
            }
        })
    })
    $("#editMyPost").validate({
        rules: {
            title: {
                maxlength: 30
            },
            description: {
                maxlength: 300
            }
        },
        messages: {
            title: {
                maxlength: "please enter characters less than 30"
            },
            description: {
                maxlength: "please add description within 300 characters"
            }
        },
        submitHandler: function (form) {
            console.log(form);
            let title = $("#old-title").val();
            let description = $("#old-desc").val();
            let image = $("#old-image")[0].files[0];
            let formData = new FormData();

            formData.append('old-title', title);
            formData.append('description', description);
            formData.append('edit-post-img', image);


            // $("#edit-btn").on('click', function (e) {
            // const postId = $(this).data("id");
            // console.log(postId);
            // let oldTitle = $("#old-title").val();
            console.log("++++++++++++++++++++++++++++++++++++");
            // console.log(oldTitle);
            // let old = $("#old-desc").val();
            // console.log(old);
            // let editImage = $("#edit-image")[0].files[0];
            // let formData = new FormData();

            // formData.append('old-title', oldTitle);
            // formData.append('editDescription', editDescription);
            // formData.append('edit-post-img', editImage);

            $.ajax({
                url: "/post/" + postId,
                type: "PUT",
                async: false,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response);
                    $("#old-title").text(response.title)
                    window.location.href = "/post"
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    });

    $(document).on("click", ".archive-post", function () {
        const postId = $(this).data('id');
        const isArchived = $(this).data('archived');
        console.log('asraef', isArchived)
        console.log(postId);
        console.log("archive");
        $.ajax({
            type: "PUT",
            url: `/post/archive/${postId}`,
            data: {
                isArchived: !isArchived
            },
            success: function (response) {
                
                
                location.reload(); 

            },
            error: function (err) {
                console.log("error", err.message);
            }
        })
    })
    $("#search-btn").on("click",function (e) {
        e.preventDefault();
        console.log("search");
        console.log( $("#search").val());
        let url = new URL(location.href);
        url.searchParams.set('searchVal', $("#search").val());
        history.pushState({}, "", url);
        location.reload();
       

    })

    $(".sortBy").on("click",function(e){
        e.preventDefault();
        let url = new URL(location.href);

        url.searchParams.set('sortBy', $(this).attr('name'));
        url.searchParams.set('sortOrder',1);

        history.pushState({}, "", url);
        location.reload();
        
    })
})