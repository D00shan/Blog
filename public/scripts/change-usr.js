let form = document.getElementById("form")

form.addEventListener("submit", async () => {

    event.preventDefault()

    const formData = new FormData(form);

    $.ajax({
        url: '/admin/change-usr-data',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
          console.log('Success:', response)

          if(response.success) {
            window.location.href = "/admin/dashboard"
          } else {
            document.getElementById("response").classList.add("active")
            document.getElementById("message").textContent = response.message
          }

        },
        error: function(xhr, textStatus, errorThrown) {

          let resMessage =  typeof xhr.responseText === "undefined" ? "Error while changing username" : JSON.parse(xhr.responseText).message

          console.error('Error:', textStatus, errorThrown);
          document.getElementById("response").classList.add("active")
          document.getElementById("message").textContent = resMessage
        }
      });

})