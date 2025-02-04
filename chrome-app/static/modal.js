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
                color: #333 !important;
                margin-top: 10px;
            }
            #modal-analysis h1 {
                font-size: 24px;
                color: #444 !important;
                margin-bottom: 10px;
            }
            #modal-analysis h2 {
                font-size: 20px;
                color: #444 !important;
                margin-bottom: 8px;
            }
            #modal-analysis h3 {
                font-size: 18px;
                color: #444 !important;
                margin-bottom: 6px;
            }
            #modal-analysis p {
                margin-bottom: 10px;
                color: #333 !important;
            }
            #modal-analysis ul {
                list-style-type: none;
                margin-left: 20px;
                color: #333 !important;
            }
            #modal-analysis ol {
                list-style-type: none;
                margin-left: 20px;
                color: #333 !important;
            }
            #modal-analysis blockquote {
                color: #333 !important;
                margin: 10px 0;
                padding: 10px;
                background-color: #f1f1f1;
                border-left: 4px solid #ccc;
            }
            #modal-analysis .score strong {
                font-size: 18px;
                color: #007bff;
            }
            #modal-analysis .section {
                margin-top: 20px;
            }
            #modal-analysis .section ul {
                padding-left: 20px;
                list-style-type: none;
            }
            #modal-analysis .section ul li {
                margin-bottom: 5px;
            }
            #modal-analysis .disclaimer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
            #modal-analysis .container {
                background-color: transparent !important;
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