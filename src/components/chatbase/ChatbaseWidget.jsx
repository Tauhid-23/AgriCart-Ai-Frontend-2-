import { useEffect } from 'react';

const ChatbaseWidget = ({ chatbotId }) => {
  useEffect(() => {
    // Get chatbot ID from props or environment variable
    const resolvedChatbotId = chatbotId || process.env.REACT_APP_CHATBASE_ID;
    
    // Validate chatbot ID
    if (!resolvedChatbotId) {
      console.error('❌ Chatbase widget chatbotId is missing');
      return;
    }
    
    // Check if script already exists to prevent duplicates
    if (document.getElementById('chatbase-script')) {
      console.log('⚠️ Chatbase script already loaded');
      return;
    }
    
    console.log('🔄 Initializing Chatbase widget with ID:', resolvedChatbotId);
    
    // Function to inject Chatbase script using the official method
    const injectChatbaseScript = () => {
      try {
        // Set the configuration
        window.embeddedChatbotConfig = {
          chatbotId: resolvedChatbotId,
          domain: "www.chatbase.co"
        };
        
        // Create and inject the script
        const script = document.createElement('script');
        script.id = 'chatbase-script'; // Add ID to prevent duplicates
        script.src = "https://www.chatbase.co/embed.min.js";
        script.defer = true;
        script.setAttribute('chatbotId', resolvedChatbotId);
        script.setAttribute('domain', 'www.chatbase.co');
        
        script.onload = () => {
          console.log('✅ Chatbase widget loaded successfully');
        };
        
        script.onerror = (error) => {
          console.error('❌ Chatbase widget failed to load:', error);
        };
        
        document.body.appendChild(script);
        console.log('📤 Chatbase script injected');
      } catch (error) {
        console.error('Error injecting Chatbase script:', error);
      }
    };
    
    // Inject the script
    injectChatbaseScript();
    
    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Chatbase widget');
      
      // Remove script
      const script = document.getElementById('chatbase-script');
      if (script) {
        script.remove();
      }
      
      // Clean up config
      if (window.embeddedChatbotConfig) {
        delete window.embeddedChatbotConfig;
      }
      
      console.log('✅ Chatbase widget cleanup completed');
    };
  }, [chatbotId]);

  return null;
};

export default ChatbaseWidget;