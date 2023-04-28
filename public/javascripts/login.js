$(document).ready(function () {
    $("#login-form").validate({
        highlight: function(element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form)
              .addClass(errorClass);
          },
          unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form)
              .removeClass(errorClass);
          },
        rules: {
           
            email: {
                required: true,
              
         

            },
            password: {
                required: true

            }
        },
        messages: {
          

            email: {
                required: "please enter valid address",
   
            },
            password: "please enter password",
         
        },
        submitHandler:
            function (form) {
             console.log(form);
                form.submit();
            }
    });
   



})