$("#userSearch-btn").on("click", function (e) {
    e.preventDefault();
    console.log("userSearch");
    let url = new URL("http://localhost:7000/users");
    url.searchParams.set('searchUser', $("#userSearch").val());
    history.pushState({}, "", url);
    location.reload();
})

$("#userSort").on("click",function (e) {
    e.preventDefault();
    console.log("userSort");
    let url = new URL("http://localhost:7000/users");
    url.searchParams.set('sortBy', $(this).attr('name'));
    url.searchParams.set('sortOrder',-1);
    history.pushState({}, "", url);
    location.reload();


})