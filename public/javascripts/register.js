$(document).ready(function () {
    $("#registerForm").validate({
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
            firstname: "required",
            lastname: "required",
            email: {
                required: true,
                email: true,
                remote: 'validate-email'

            },
            password: {
                required: true

            },
            confirmPassword: {
                required: true,
                equalTo: "#pwd"
            },
            gender:{
                required:true
            }
        },
        messages: {
            firstname: "please enter your firstname",
            lastname: "please enter your lastname",

            email: {
                required: "please enter email address",
                email:"please provide valid email address",
                remote: "email already exists"
            },
            password: "please enter password",
            confirmPassword: {
                required:"please enter password",
                equalTo: "please enter same password"
            },
            gender:{
                required:"please select gender"
            }
        },
        submitHandler:
            function (form) {
                form.submit(); 
            }
    });
    $.validator.addMethod("password",
        function (value, element) {
            return /^[A-Za-z0-9\d=!\-@._*]+$/.test(value);
        });



})