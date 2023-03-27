import chatTemplate from './chat-template.html';

export interface historyItem {
    content: string;
    role: 'user' | 'system' | 'assistant' | string;
}

export interface MessageType {
    message: string;
    answerEl: HTMLElement;
    history: Array<historyItem>;
    setLoading: (isLoading: boolean) => void
}

export type ChatWidgetOptions = {
    answer: ( message: MessageType ) => Promise<string | null>;
    validate: ( message: string ) => Array<string>;
    onInput: ( message: string ) => Array<string>;
    agentName: string;

    agentAvatarUrl: string;

    styles: {
        openerBgColor: string;
        openerFillColor: string;
        chatBgColor: string;
        chatTextColor: string;
        chatTextareaBgColor: string;
        chatHeaderBgColor: string;
        chatButtonsBgColor: string;
        chatTextareaColor: string;
        fontFamily: string;
        loaderColor: string;
    }
}

const defaultOptions: ChatWidgetOptions = {

    /**
     * This function is called when the user submits a message,
     * it should return a promise that resolves with the answer
     */
    answer: ( message: MessageType ) => new Promise( ( resolve ) =>
        setTimeout( () => resolve( 'God does not play dice with the universe.' ), 3000 ) ),

    /**
     * This function is called when the user submits a message,
     * if it returns an array of errors, the errors will be displayed to the user,
     */
    validate: ( message: string ) => {
        const errors = [];
        if ( message.length < 3 ) {
            errors.push( 'Message must be at least 3 characters long' );
        }

        if ( message.length > 512 ) {
            errors.push( 'Message must be at most 1000 characters long' );
        }

        return errors;
    },

    /**
     * This function is called when the user presses a key in the textarea field
     * if it returns an array of warnings, the warnings will be displayed to the user
     * @param message
     */
    onInput: ( message: string ) => {
        // check if message includes select, insert, update, delete, drop, truncate, alter, create, or grant
        const sqlInjectionRegex = /select|insert|update|delete|drop|truncate|alter|create|grant/i;
        const warnings = [];
        if ( sqlInjectionRegex.test( message ) ) {
            warnings.push( 'SQL Injection detected' );
        }
        return warnings;
    },

    /**
     * This will be displayed on the chat header
     */
    agentName: 'assistant',

    /**
     * This will be displayed as the avatar of the agent on the chat header
     */
    agentAvatarUrl: 'https://code-for-me.com/build/images/logo-code-md.svg',

    /**
     * The styles of the chat widget
     * all other styles can be changed by redefining the css classes
     */
    styles: {
        openerBgColor: '#202123',
        openerFillColor: '#413e50',
        chatBgColor: '#343541',
        chatTextColor: '#fff',
        chatTextareaBgColor: '#514f60',
        chatHeaderBgColor: '#202123',
        chatButtonsBgColor: '#473f56',
        chatTextareaColor: '#fff',
        loaderColor: '#9880ff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    }
};

/**
 * No Brainer Chat Widget
 * A simple chat widget that works out of the box
 */
export default class ChatWidget {
    private submitButton!: HTMLElement;
    private messageTemplate!: HTMLElement;
    private messageHistory!: HTMLElement;
    private history: Array<historyItem> = [];
    private textArea!: HTMLTextAreaElement;
    private chatOpener!: HTMLElement;
    private chatContainer!: HTMLElement;
    private chatClose!: HTMLElement;
    private outerContainer!: HTMLElement;
    private loader!: HTMLElement;

    private options: ChatWidgetOptions;
    private chatAgentNameEl!: HTMLElement;
    private feedbackEl!: HTMLElement;
    private chatScrollEl!: HTMLElement;

    constructor( options: ChatWidgetOptions | {} = defaultOptions ) {
        this.options = { ...defaultOptions, ...options };
        if ( 'styles' in options ) {
            this.options.styles = { ...defaultOptions.styles, ...options.styles };
        }

        document.body.appendChild( this.createChatWidget() );
        this.collectElements();
        this.setProperties();
        this.bindEvents();
    }

    static create( options: ChatWidgetOptions | {} = defaultOptions ): ChatWidget {
        return new ChatWidget( options );
    }

    destroy(): void {
        this.outerContainer.remove();
    }

    /**
     * Used to send a message to the user.
     * you can use this or the answer function is fired when the user submits a message
     */
    sendToUser( message: string ): ChatWidget {
        this.loader.classList.remove( 'show' );
        if ( !this.isChatOpen() ) {
            this.chatOpener.classList.add( 'has-new-message' );
        }
        this.addMessage( message, this.options.agentName );
        return this;
    }

    show(): ChatWidget {
        this.chatOpener.classList.remove( 'show' );
        this.chatContainer.classList.add( 'show' );
        this.chatOpener.classList.remove( 'has-new-message' );
        this.textArea.focus();
        return this;
    }

    hide(): ChatWidget {
        this.chatOpener.classList.add( 'show' );
        this.chatContainer.classList.remove( 'show' );
        return this;
    }

    setLoading(isLoading: boolean) {
        this.loader.classList[ ( isLoading ? 'add' : 'remove' ) ]( 'show' );
    }

    send( event: Event ): void {

        const warnings = this.options.onInput( this.textArea.value );
        if ( warnings.length > 0 ) {
            this.feedbackEl.innerHTML = warnings.join( '<br>' );
            this.feedbackEl.classList.add( 'warning' );
            this.feedbackEl.classList.remove( 'error' );
            this.chatScrollEl.scrollTop = this.chatScrollEl.scrollHeight;
            return;
        }

        if ( event.type === 'keydown' && ( event as KeyboardEvent ).key !== 'Enter' ) {
            return;
        }

        if ( event.type === 'keydown' && ( event as KeyboardEvent ).shiftKey ) {
            return;
        }

        this.loader.classList.add( 'show' );

        event.preventDefault();

        const message = this.textArea.value;
        this.textArea.value = '';

        const errors = this.options.validate( message );
        if ( errors.length > 0 ) {
            this.loader.classList.remove( 'show' );
            this.feedbackEl.classList.remove( 'warning' );
            this.feedbackEl.innerHTML = errors.join( '<br>' );
            this.feedbackEl.classList.add( 'error' );
            this.textArea.value = message;
            this.chatScrollEl.scrollTop = this.chatScrollEl.scrollHeight;
            return;
        }

        this.feedbackEl.innerHTML = '';
        this.feedbackEl.classList.remove( 'error' );
        this.feedbackEl.classList.remove( 'warning' );

        this.addMessage( message, 'user' );

        const answerEl = this.getNextMessageElement( this.options.agentName );
        answerEl.style.backgroundColor = 'unset';

        this.options.answer( {
            message,
            answerEl,
            history: this.history,
            setLoading: this.setLoading.bind( this )
        } ).then( ( answer: string | null ) => {
            answerEl.style.removeProperty( 'background-color' );
            if ( answer !== undefined && answer !== null ) {
                this.addMessage( answer, this.options.agentName, answerEl );
            }
            this.loader.classList.remove( 'show' );
            if ( !this.isChatOpen() ) {
                this.chatOpener.classList.add( 'has-new-message' );
            }
        } );
    }

    private createChatWidget() {
        const chatWidget = document.createElement( 'div' );
        chatWidget.innerHTML = chatTemplate;
        return chatWidget;
    }

    private collectElements() {
        const container = this.outerContainer = document.getElementById( 'no-brainer-chat' ) as HTMLElement;
        this.chatOpener = container.querySelector( '#no-brainer-chat-opener' ) as HTMLElement;
        this.chatAgentNameEl = container.querySelector( '#no-brainer-chat-agent-name' ) as HTMLElement;
        this.chatClose = container.querySelector( '#no-brainer-chat-closer' ) as HTMLElement;
        this.chatContainer = container.querySelector( '#no-brainer-chat-container' ) as HTMLElement;
        this.textArea = container.querySelector( '#chat-widget-text-area' ) as HTMLTextAreaElement;
        this.submitButton = container.querySelector( '#chat-widget-submit' ) as HTMLElement;
        this.messageTemplate = container.querySelector( '#chat-widget-message-template' ) as HTMLElement;
        this.messageHistory = container.querySelector( '#chat-widget-message-history' ) as HTMLElement;
        this.loader = container.querySelector( '#no-brainer-chat-loader' ) as HTMLElement;
        this.feedbackEl = container.querySelector( '#no-brainer-feedback' ) as HTMLElement;
        this.chatScrollEl = container.querySelector( '#no-brainer-chat-scroll' ) as HTMLElement;
    }

    private bindEvents() {
        this.submitButton.addEventListener( 'click', this.send.bind( this ) );
        this.textArea.addEventListener( 'keydown', this.send.bind( this ) );
        this.chatOpener.addEventListener( 'click', ( event ) => {
            this.chatOpener.classList.remove( 'has-new-message' );
            this.chatOpener.classList.remove( 'show' );
            this.chatContainer.classList.add( 'show' );
            this.textArea.focus();
        } );
        this.chatClose.addEventListener( 'click', ( event ) => {
            this.chatOpener.classList.add( 'show' );
            this.chatContainer.classList.remove( 'show' );
        } );
    }

    private addMessage( message: string, user: string, messageEl: HTMLElement | null = null ): void {
        if ( message.trim().length === 0 && ( messageEl && messageEl.innerHTML.trim().length === 0 ) ) {
            throw new Error( 'Message cannot be empty' );
        }

        if ( messageEl && 'innerHTML' in messageEl ) {
            if ( message.trim().length > 0 ) {
                messageEl.innerHTML = message;
            } else {
                const message = messageEl.innerHTML;
            }
            const user = messageEl.classList.contains( 'message-out' ) ? 'user' : this.options.agentName;
        } else {
            const messageEl = this.getNextMessageElement( user );
            messageEl.innerHTML = message;
        }
        this.history.push( {
            content: message,
            role: user
        } );

        this.scroll();
    }

    private isChatOpen(): boolean {
        return this.chatContainer.classList.contains( 'show' );
    }

    private setProperties() {
        const styles = this.options.styles;
        this.outerContainer.style.setProperty( '--no-brainer-chat-opener-bg-color', styles.openerBgColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-opener-fill-color', styles.openerFillColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-bg-color', styles.chatBgColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-text-color', styles.chatTextColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-textarea-bg-color', styles.chatTextareaBgColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-header-bg-color', styles.chatHeaderBgColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-buttons-bg-color', styles.chatButtonsBgColor );
        this.outerContainer.style.setProperty( '--no-brainer-chat-textarea-color', styles.chatTextareaColor );
        this.outerContainer.style.setProperty( '--no-brainer-font', styles.fontFamily );
        this.outerContainer.querySelector( 'img' )?.setAttribute( 'src', this.options.agentAvatarUrl );
        // uppercase first letter
        this.options.agentName = this.options.agentName.charAt( 0 ).toUpperCase() + this.options.agentName.slice( 1 );
    }

    /**
     * Returns a message element
     * if user is 'user' then the message will be on the right side
     */
    getNextMessageElement( user: 'user' | 'agent' | string ): HTMLElement {
        const messageTemplate = this.messageTemplate.cloneNode( true ) as HTMLTemplateElement;
        const messageBody = messageTemplate.content.querySelector( 'p' ) as HTMLElement;
        if ( user === 'user' ) {
            messageBody.classList.add( 'message-out' );
            messageBody.classList.remove( 'message-in' );
        } else {
            messageBody.classList.add( 'message-in' );
            messageBody.classList.remove( 'message-out' );
        }

        return this.messageHistory.appendChild( messageBody );
    }

    scroll() {
        this.chatScrollEl.scrollTop = this.chatScrollEl.scrollHeight;
    }
}
