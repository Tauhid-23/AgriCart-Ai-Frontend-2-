# Chatbase AI Chatbot Integration

This directory contains the Chatbase AI chatbot integration for AgriCart AI.

## Files

- `ChatbaseWidget.jsx`: React component for Chatbase integration
- `chatbase-custom.css`: Custom styling for the chatbot widget

## Setup Instructions

1. Get your Chatbase ID:
   - Log into Chatbase
   - Go to your chatbot
   - Click "Deploy" or "Settings"
   - Copy the Chatbot ID (looks like: `abc123xyz`)

2. Configure the chatbot ID:
   - Option 1 (Recommended): Add to `.env.production`:
     ```
     REACT_APP_CHATBASE_ID=your_chatbot_id_here
     ```
   - Option 2: Pass as a prop to the ChatbaseWidget component:
     ```jsx
     <ChatbaseWidget chatbotId="your_chatbot_id_here" />
     ```

3. The chatbot will appear in the bottom-right corner of the screen and works on both mobile and desktop.

## Customization

The chatbase-custom.css file contains custom styling to position the chatbot widget appropriately and ensure it works well with the AgriCart AI theme.