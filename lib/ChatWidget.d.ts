export interface historyItem {
    content: string;
    role: 'user' | 'system' | 'assistant' | string;
}
export interface MessageType {
    message: string;
    answerEl: HTMLElement;
    history: Array<historyItem>;
    setLoading: (isLoading: boolean) => void;
}
export type ChatWidgetOptions = {
    answer: (message: MessageType) => Promise<string | null>;
    validate: (message: string) => Array<string>;
    onInput: (message: string) => Array<string>;
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
    };
};
/**
 * No Brainer Chat Widget
 * A simple chat widget that works out of the box
 */
export default class ChatWidget {
    private submitButton;
    private messageTemplate;
    private messageHistory;
    private history;
    private textArea;
    private chatOpener;
    private chatContainer;
    private chatClose;
    private outerContainer;
    private loader;
    private options;
    private chatAgentNameEl;
    private feedbackEl;
    private chatScrollEl;
    constructor(options?: ChatWidgetOptions | {});
    static create(options?: ChatWidgetOptions | {}): ChatWidget;
    destroy(): void;
    /**
     * Used to send a message to the user.
     * you can use this or the answer function is fired when the user submits a message
     */
    sendToUser(message: string): ChatWidget;
    show(): ChatWidget;
    hide(): ChatWidget;
    setLoading(isLoading: boolean): void;
    send(event: Event): void;
    private createChatWidget;
    private collectElements;
    private bindEvents;
    private addMessage;
    private isChatOpen;
    private setProperties;
    /**
     * Returns a message element
     * if user is 'user' then the message will be on the right side
     */
    getNextMessageElement(user: 'user' | 'agent' | string): HTMLElement;
    scroll(): void;
}
//# sourceMappingURL=ChatWidget.d.ts.map