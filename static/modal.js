function createModalHTML() {
    const modalHTML = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                position: relative;
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 80vw;
                max-height: 80vh;
                overflow-y: auto;
            }
            #modal-analysis {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin-top: 10px;
            }
            #modal-analysis h1, #modal-analysis h2, #modal-analysis h3 {
                color: #444;
            }
            #modal-analysis p {
                margin-bottom: 10px;
            }
            #modal-analysis ul {
                list-style-type: disc;
                margin-left: 20px;
            }
            #modal-analysis ol {
                list-style-type: decimal;
                margin-left: 20px;
            }
            #closeModalButton {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #f44336;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 4px;
            }
        </style>
        <div class="modal-overlay">
            <div class="modal-content">
                <div id="modal-analysis" >...</div>
                <button id="closeModalButton">&times;</button>
            </div>
        </div>
    `;
    return modalHTML
}

function displayModal() {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = createModalHTML();
    document.body.appendChild(modalContainer);

    document.getElementById('closeModalButton').addEventListener('click', function() {
        removeModal(modalContainer);
    });

    document.querySelector('.modal-overlay').addEventListener('click', function(event) {
        if (event.target === this) {
            removeModal(modalContainer);
        }
    });
}

function removeModal(modalContainer) {
    modalContainer.remove();
}