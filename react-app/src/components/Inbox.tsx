// import React, { useState } from 'react';

// // Добавляем стили в компонент
// const styles = {
//   messageList: {
//     padding: '10px',
//   },
//   message: {
//     padding: '10px',
//     margin: '5px 0',
//     borderRadius: '5px',
//   },
//   outgoingMessage: {
//     backgroundColor: 'lightblue',
//   },
//   incomingMessage: {
//     backgroundColor: 'lightgrey',
//   },
//   messageInput: {
//     marginTop: '20px',
//   },
// };

// interface Message {
//   id: number;
//   senderId: number;
//   senderName: string; // Имя отправителя
//   content: string;
//   timestamp: string; // Дата и время отправки
// }

// // Предполагаем, что ID текущего пользователя — 1
// const userId = 1;

// // Начальный массив сообщений
// const initialMessages: Message[] = [
//   { id: 1, senderId: 2, senderName: "Алиса", content: 'Как дела?', timestamp: new Date().toLocaleString() },
//   { id: 2, senderId: 1, senderName: "Боб", content: 'Всё отлично, спасибо!', timestamp: new Date().toLocaleString() },
// ];

// function Inbox() {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [newMessage, setNewMessage] = useState('');

//   const handleSendMessage = () => {
//     const nextMessageId = messages.length + 1;
//     const messageToAdd: Message = {
//       id: nextMessageId,
//       senderId: userId,
//       senderName: "Вы", // Предполагаем, что для текущего пользователя мы используем "Вы"
//       content: newMessage,
//       timestamp: new Date().toLocaleString(), // Записываем текущие дату и время отправки
//     };
//     setMessages([...messages, messageToAdd]);
//     setNewMessage('');
//   };

//   return (
//     <div>
//       <div style={styles.messageList}>
//         {messages.map((message) => (
//           <div 
//             key={message.id} 
//             style={{
//               ...styles.message,
//               ...(message.senderId === userId ? styles.outgoingMessage : styles.incomingMessage),
//             }}
//           >
//             <strong>{message.senderName}</strong> ({message.timestamp}): {message.content}
//           </div>
//         ))}
//       </div>
//       <div style={styles.messageInput}>
//         <textarea
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Напишите сообщение..."
//         />
//         <button onClick={handleSendMessage}>Отправить</button>
//       </div>
//     </div>
//   );
// }

// export default Inbox;


import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { FaCheck } from 'react-icons/fa';

import { getMessages } from "../fetchScripts/getUserDataForDashboard";
import { saveMessage } from "../fetchScripts/getUserDataForDashboard";



// Добавляем стили в компонент
const styles: { [key: string]: CSSProperties } = {
  messagesContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: '5px',
  },
  messageList: {
    padding: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 0',
  },
  messageHeader: {
    color: 'grey',
    fontSize: '0.8rem',
  },
  messageBody: {
    padding: '10px',
    borderRadius: '5px',
    marginTop: '8px',
    backgroundColor: 'lightgrey',
    overflowWrap: 'break-word', // Reposition words so that text does not extend beyond the element
    wordWrap: 'break-word', // To support older browsers
    width: '100%', // Make sure the width does not exceed the parent container
  },
  outgoingMessageBody: {
    backgroundColor: 'lightblue',
  },
  incomingMessageBody: {
    backgroundColor: 'lightgrey',
  },
  newMessageMarker: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '14px',
    marginLeft: '14px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  divider: {
    border: 'none',
    borderBottom: '1px solid grey',
    marginTop: '20px',
  },
  messageInput: {
    width: '100%', // Set the width to 100% of the parent element
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column', // The elements inside will follow each other vertically
  },
  messageInputContainer: {
    position: 'relative',
    marginTop: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    paddingBottom: '80px', // Set the indentation at the bottom so that the text does not overlap the button
    fontSize: '1rem',
    borderRadius: '5px',
    resize: 'none',
  },
  sendButton: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    padding: '10px 20px',
    marginBottom: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  markAsReadLink: {
    cursor: 'pointer',
    marginTop: '8px',
    fontSize: '15px',
  },
};

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  order_id: number;
  text: string;
  timestamp: string;
  is_read: number;
};


function Inbox(props: { senderId: any; userRole: any; receiverId: any; orderId: any; messages: any }) {

  const userId = props.senderId;

  const [messages, setMessages] = useState<Message[]>(props.messages);
  console.log(messages)

  const [newMessage, setNewMessage] = useState('');
  const socket = useRef<Socket>();

  if (!socket.current) {
    // socket.current = socketIOClient('https://sassagreement.com.ghanastudyfair.com/');
    socket.current = socketIOClient('http://localhost:3001');

  }

  const requestData = async () => {
    try {
      const serverAnswer = await getMessages(props.orderId);
      console.log('serverAnswer!!')
      console.log(serverAnswer.messages)

      setMessages(serverAnswer.messages);
    } catch (error) {
      console.error("An error occurred: ", error);
    }
  };

  useEffect(() => {
    requestData();

    socket.current!.emit('registerClient', props.senderId, props.userRole);

    // socket.current!.on('newMessage', (message: Message) => {
    //   setMessages(prevMessages => [...prevMessages, message]);
    // });

    return () => {
      socket.current!.off('newMessage');
    };
  }, []);

  const handleSendMessage = () => {
    // const messageToAdd: Message = {
    //   id: parseInt(`0${Date.now()}`, 10),
    //   sender_id: parseInt(props.senderId),
    //   receiver_id: parseInt(props.receiverId),
    //   order_id: props.orderId,
    //   text: newMessage,
    //   timestamp: new Date().toString(),
    // };

    // setMessages(prevMessages => [messageToAdd, ...prevMessages]);

    socket.current!.emit('sendMessage', { senderId: props.senderId, message: newMessage, receiverId: props.receiverId, orderId: props.orderId });
    setNewMessage('');
    requestData();

    // Resetting the height of the text field
    const textArea = document.querySelector('textarea');
    if (textArea) {
      textArea.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;  // Set the height based on the content
  };


  function markAsRead(messageId: number) {
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        return { ...message, is_read: 1 };
      }
      return message;
    });
    setMessages(updatedMessages);

    saveMessage(messageId);
  }
  return (
    <div style={styles.messagesContainer}>
      <div style={styles.messageInputContainer}>
        <textarea
          style={styles.textarea}
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Write your message..."
        />
        <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
      </div>
      <div style={styles.messageList}>
        <div style={styles.messageList}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id !== 0 ? message.id : `${message.id}-${Date.now()}`}>
              {index > 0 && <hr style={styles.divider} />}
              <div style={styles.message}>
                <div style={styles.messageHeader}>
                  <strong>{message.sender_id == props.senderId ? 'You' : 'Opponent'}</strong>
                  <span> ({new Date(message.timestamp).toLocaleString()})</span>
                  {!message.is_read && message.sender_id != props.senderId && (
                    <div style={styles.newMessageMarker}>New</div>
                  )}
                </div>
                <div
                  style={{
                    ...styles.messageBody,
                    ...(message.sender_id == props.senderId ? styles.outgoingMessageBody : styles.incomingMessageBody),
                  }}
                >
                  {message.text}
                </div>
              </div>
              <div>
              {!message.is_read && message.sender_id != props.senderId && (
                <span style={styles.markAsReadLink} onClick={() => markAsRead(message.id)}>
                  <FaCheck style={styles.checkboxIcon} />
                  Mark as read
                </span>
              )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

}

export default Inbox;
