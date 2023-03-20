export type ChatWidgetOptions = {
    answer: (message: string) => Promise<string>;
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
    send(event: Event): void;
    private createChatWidget;
    private collectElements;
    private bindEvents;
    private addMessage;
    private isChatOpen;
    private setProperties;
}
//# sourceMappingURL=ChatWidget.d.ts.map