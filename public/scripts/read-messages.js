document.querySelectorAll(".special-link").forEach((link) => {

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const newParamKey = "page";
    const newParamValue = link.dataset.redirect;

    params.set(newParamKey, newParamValue);

    const newUrl = url.origin + url.pathname + "?" + params.toString();

    link.href = newUrl
})

function Delete(id) {
    
    let userConfirmed = window.confirm("Are you sure you want to proceed?");
    
    if (userConfirmed) {
        $.ajax({
            url: '/admin/delete-msg',
            type: 'DELETE',
            data: {
                id: id
            },
            success: function(response) {
                location.reload()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error deleting post")
                console.error('Error:', textStatus, errorThrown);
            }
        });
    }

}

let  button = document.getElementById("delete")

button.addEventListener("click", () => {
    Delete(button.parentElement.dataset.id)
})