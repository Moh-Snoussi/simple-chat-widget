# Simplest Chat Widget

[![npm version](https://badge.fury.io/js/simplest-chat-widget.svg)](https://badge.fury.io/js/simplest-chat-widget)

Simplest Chat Widget is a lightweight and customizable chat widget library that allows you to easily add a chat feature to your web
application. It's designed to be simple and easy to use, with minimal setup required.

## Demo

[Demo](https://moh-snoussi.github.io/simple-chat-widget/)

## Installation

### CDN

```html

<script type="module">
	import ChatWidget from "https://unpkg.com/simplest-chat-widget";

	ChatWidget.create();
</script>
```

### NPM

```bash
npm install simplest-chat-widget
```

```javascript
import ChatWidget from "simplest-chat-widget";

ChatWidget.create();
```

## Methods

| Method     | Description                                                |
|------------|------------------------------------------------------------|
| create     | Creates the chat widget, that will be appended to the body |
| destroy    | Removes the chat widget from the DOM                       |
| show       | Shows the chat widget                                      |
| hide       | Hides the chat widget                                      |
| sendToUser | Sends a message to the user                                |

## Types

```typescript
export interface MessageType {
    // The message sent by the user
    message: string;
    // the Element that will contain the response
    answerEl: HTMLElement;
    // the history of the chat in a format that is suported by chatgpt-3.5-turbo messages
    history: Array<historyItem>;
    // Sets the loading state of the chat
    setLoading: ( isLoading: boolean ) => void
}

export interface historyItem {
    content: string;
    role: string;
}

```


## Options

| Option         | default                                               | Type                                          | Description                                                                                                                                              |
|----------------|-------------------------------------------------------|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| answer         |                                                       | ( message: MessageType ) => Promise\<string\> | This function is called when the user submits a message, it should return a promise that resolves with the answer                                        | 
| validate       | 3 < message < 512                                     | (message) => Array\<string>                   | This function is called when the user submits a message, if it returns an array of errors, the errors will be displayed to the user,                     |
| onInput        | sqlInjection dummy                                    | (message) => Array\<string>                   | This function is called when the user presses a key in the textarea field if it returns an array of warnings, the warnings will be displayed to the user |
| agentName      | assistant                                             | string                                        | This will be displayed on the chat header                                                                                                                |
| agentAvatarUrl | https://code-for-me.com/build/images/logo-code-md.svg | string                                        | This will be displayed as the avatar of the agent on the chat header                                                                                     |
| styles         |                                                       | ChatWidgetOptions                             | The styles of the chat widget. all other styles can be changed by redefining the css classes                                                             |

## Styling

| option                     | default                                      | Description                              |
|----------------------------|----------------------------------------------|------------------------------------------|
| styles.openerBgColor       | #202123                                      | The background color of the chat opener  |
| styles.openerFillColor     | #413e50                                      | The fill color of the chat opener        |
| styles.chatBgColor         | #343541                                      | The background color of the chat         |
| styles.chatTextColor       | #fff                                         | The text color of the chat               |
| styles.chatTextareaBgColor | #514f60                                      | The background color of the textarea     |
| styles.chatHeaderBgColor   | #202123                                      | The background color of the chat header  |
| styles.chatButtonsBgColor  | #473f56                                      | The background color of the chat buttons |
| styles.chatTextareaColor   | #fff                                         | The text color of the textarea           |
| styles.loaderColor         | #9880ff                                      | The color of the loader                  |
| styles.fontFamily          | system-ui, -apple-system, BlinkMacSystemFont | The font family of the chat              |
