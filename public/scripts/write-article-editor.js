function addInputSectionHeader() {
    // Create the input section container
    const inputSection = document.createElement('div');
    inputSection.classList.add('input-section');

    // Create the input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.classList.add('editor-input-header');
    inputElement.classList.add('editor-input');

    // Create the button element
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '-';
    deleteButton.onclick = function() {
        deleteBlock(this);
    };

    // Append input and button to the container
    inputSection.appendChild(inputElement);
    inputSection.appendChild(deleteButton);

    // Append the input section to the div with id 'editor'
    const editorDiv = document.getElementById('editor');
    editorDiv.appendChild(inputSection);
}

function addInputSectionParagraph() {
    // Create the input section container
    const inputSection = document.createElement('div');
    inputSection.classList.add('input-section');

    // Create the textarea element
    const textareaElement = document.createElement('textarea');
    textareaElement.classList.add('editor-input-paragraph');
    textareaElement.classList.add('editor-input');

    // Create the button element
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '-';
    deleteButton.onclick = function() {
        deleteBlock(this);
    };

    // Append textarea and button to the container
    inputSection.appendChild(textareaElement);
    inputSection.appendChild(deleteButton);

    // Append the input section to the div with id 'editor'
    const editorDiv = document.getElementById('editor');
    editorDiv.appendChild(inputSection);
}

function addInputSectionImage() {
    // Create the input section container
    const inputSection = document.createElement('div');
    inputSection.classList.add('input-section');

    // Create the file input element
    const fileInputElement = document.createElement('input');
    fileInputElement.type = 'file';
    fileInputElement.accept = "image/*"
    fileInputElement.classList.add('editor-image-input');
    fileInputElement.classList.add('editor-input');

    // Create the delete button element
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '-';
    deleteButton.onclick = function() {
        deleteBlock(this);
    };

    // Append file input and button to the container
    inputSection.appendChild(fileInputElement);
    inputSection.appendChild(deleteButton);

    // Append the input section to the div with id 'editor'
    const editorDiv = document.getElementById('editor');
    editorDiv.appendChild(inputSection);
}

function deleteBlock(element) {
    element.closest('.input-section').remove()
}

function addInputSection() {
    switch (document.getElementById("select-opts").value) {
        case "0":
            addInputSectionParagraph()
            break;
        case "1":
            addInputSectionHeader()
            break;
        case "2":
            addInputSectionImage()
            break;
        default:
            alert("No valid block type selected")
            break;
    }
}