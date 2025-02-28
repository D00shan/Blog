function Delete(slugIndex, button) {
    
    let userConfirmed = window.confirm("Are you sure you want to proceed?");
    
    if (userConfirmed) {
        $.ajax({
            url: '/admin/delete',
            type: 'DELETE',
            data: {
                slug: document.getElementById(`slug${slugIndex}`).textContent.split("/")[1]
            },
            success: function(response) {
                button.parentElement.remove()
                console.log('Success:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error deleting post")
                console.error('Error:', textStatus, errorThrown);
            }
        });
    }

}

document.querySelectorAll(".delete-button").forEach((button, index) => {
    button.addEventListener("click", () => {
        Delete(index, button)
    })
})

document.querySelectorAll(".special-link").forEach((link) => {

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const newParamKey = "page";
    const newParamValue = link.dataset.redirect;

    params.set(newParamKey, newParamValue);

    const newUrl = url.origin + url.pathname + "?" + params.toString();

    link.href = newUrl
})