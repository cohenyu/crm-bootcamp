const MyChat =  {
    init: () => {
        MyChat.loadScript();
        MyChat.start();
    },
    loadScript: () => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.3/socket.io.js';
        // Append to the `head` element
        document.head.appendChild(script);
        console.log('script loaded')
    },
    start: () => {
        console.log('My Custom Code starts here');
    }
}
MyChat.init()