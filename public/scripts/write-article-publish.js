const publishButton = document.getElementById("publish")

function isValid() {

    let valid = true

    if(document.getElementById("title").value.trim() === "") {
        valid = false
    }

    if(document.getElementById("description").value.trim() === "") {
        valid = false
    }

    if(document.getElementById("slug").value.trim() === "") {
        valid = false
    }

    if(document.getElementById("cover").files.lenght === 0) {
        valid = false
    }

    document.querySelectorAll(".editor-input").forEach(async (block, index) => {
        switch (block.type) {
            case "textarea":
            case "text":
                if(block.value.trim() === ""){
                    valid = false
                }
                break;
            case "file":
                if(block.files.lenght === 0){
                    valid = false
                }
                break;
            default:
                valid = false
                break;
        }
    })

    return valid
}

publishButton.addEventListener("click", async () => {
    
    if(!isValid()) {
        alert("Please enter valid information please")
        return
    }

    let formData = new FormData()

    const metaData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        slug: document.getElementById("slug").value
    };
    
    formData.append("metadata", JSON.stringify(metaData))

    formData.append("cover", document.getElementById("cover").files[0])

    let order = 0

    document.querySelectorAll(".editor-input").forEach(async (block, index) => {
        
        switch (block.type) {
            case "textarea":
                formData.append(`contentBlocks[${index}][type]`, "paragraph")
                formData.append(`contentBlocks[${index}][content]`, block.value)
                break;
            case "text":
                formData.append(`contentBlocks[${index}][type]`, "header")
                formData.append(`contentBlocks[${index}][content]`, block.value)
                break;
            case "file":
                formData.append(`contentBlocks[${index}][type]`, "image")
                formData.append(`contentBlocks[${index}][image]`, block.files[0])
                break;
            default:
                console.log("Invalid block type")
                break;
        }

    })
    
    $.ajax({
        url: '/admin/upload',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: function(response) {
            
            if(response.success) {
                window.location.href = "/admin/dashboard"
            } else {
                document.getElementById("response-box").classList.add("active")
                document.getElementById("message").textContent = response.message
            }

            console.log(response);
        },
        error: function(xhr, status, error) {

            let resMessage =  typeof xhr.responseText === "undefined" ? "Error uploading file" : JSON.parse(xhr.responseText).message

            document.getElementById("response-box").classList.add("active")
            document.getElementById("message").textContent = typeof resMessage === "undefined" ? "Error uplaoding file" : resMessage 
            console.error('Error:', error);
        }
    });
    

})