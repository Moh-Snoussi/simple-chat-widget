import chatTemplate from 'text!./chat-widget.html';
export default class ChatWidget {
    constructor() {
        this.history = [];
        document.body.appendChild(this.createChatWidget());
        this.textArea = document.getElementById('chat-widget-text-area');
        this.submitButton = document.getElementById('chat-widget-submit');
        this.messageTemplate = document.getElementById('chat-widget-message-template');
        this.messageContainer = document.getElementById('chat-widget-message-container');
        this.textArea.addEventListener('keydown', this.send.bind(this));
        console.log(this.submitButton);
    }
    send(event) {
        event.preventDefault();
        console.log(event);
        // check if enter and shift key is pressed
        if (event.type === 'keydown' && event.key !== 'Enter' && !event.shiftKey) {
            return "";
        }
        const message = this.textArea.value;
        console.log(message);
        return "";
        const errors = this.validate(message);
        if (errors.length > 0) {
            return errors.join('<br>');
        }
        this.history.push({
            body: message,
            timestamp: new Date(),
            author: 'user'
        });
    }
    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = chatTemplate;
        return chatWidget;
    }
    validate(message) {
        const errors = [];
        if (message.length < 3) {
            errors.push('Message must be at least 3 characters long');
        }
        if (message.length > 1000) {
            errors.push('Message must be at most 1000 characters long');
        }
        return errors;
    }
}
//# sourceMappingURL=ChatWidget.js.map