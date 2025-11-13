import { useEffect } from 'react';

const ChatbaseWidget = ({ chatbotId }) => {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Set config
      window.embeddedChatbotConfig = {
        chatbotId: chatbotId || process.env.REACT_APP_CHATBASE_ID,
        domain: "www.chatbase.co"
      };

      // Load script
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.setAttribute('chatbotId', chatbotId || process.env.REACT_APP_CHATBASE_ID);
      script.setAttribute('domain', 'www.chatbase.co');
      script.defer = true;
      
      document.body.appendChild(script);

      console.log('✅ Chatbase widget loaded');

      // Cleanup
      return () => {
        document.body.removeChild(script);
        delete window.embeddedChatbotConfig;
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [chatbotId]);

  return null; // This component doesn't render anything
};

export default ChatbaseWidget;