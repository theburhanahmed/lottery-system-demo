// UI Interaction Module
const ui = {
    // Show loading spinner
    showSpinner(element) {
        if (element) {
            element.innerHTML = '<div class="spinner"></div>';
        }
    },

    // Show message
    showMessage(element, message, type = 'info') {
        if (element) {
            element.innerHTML = `<div class="alert alert--${type}">${message}</div>`;
        }
    },

    // Show error
    showError(element, error) {
        this.showMessage(element, error, 'danger');
    },

    // Show success
    showSuccess(element, message) {
        this.showMessage(element, message, 'success');
    },

    // Clear element
    clear(element) {
        if (element) {
            element.innerHTML = '';
        }
    },

    // Show modal with content
    showModal(title, content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        if (modal && modalBody) {
            modalBody.innerHTML = `<h2>${title}</h2>${content}`;
            modal.style.display = 'flex';
        }
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Disable button
    disableButton(button) {
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.6';
        }
    },

    // Enable button
    enableButton(button) {
        if (button) {
            button.disabled = false;
            button.style.opacity = '1';
        }
    },

    // Update button text
    updateButtonText(button, text) {
        if (button) {
            button.textContent = text;
        }
    },
};
