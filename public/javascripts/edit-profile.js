$(document).ready(function(){

  function readURL(input) {
    console.log($(this));
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#profile-pic').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#profile-pic").change(function(){
        readURL(this);
    });

})
