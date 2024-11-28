import React, { useState } from 'react'
import "./App.css"
import { IoCodeSlash, IoSend } from 'react-icons/io5'
import { BiPlanet } from 'react-icons/bi'
import { FaPython } from 'react-icons/fa'
import { TbMessageChatbot } from 'react-icons/tb'
import { GoogleGenerativeAI } from "@google/generative-ai";
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponseScreen, setisResponseScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  let allMessages = [];

  const hitRequest = () => {
    if (message) {
      generateResponse(message);
    }
    else {
      alert("You must write something... !")
    }
  };

  const generateResponse = async (msg) => {
    if (!msg) return;

    const genAI = new GoogleGenerativeAI("AIzaSyCXRMSW6GvdPvJGmH3NFrX0BKAB3PKlpi8");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(msg);

    const newMessages = [
      ...messages,
      { type: "userMsg", text: msg },
      { type: "responseMsg", text: result.response.text() },
    ];

    setMessages(newMessages); // Append new messages to the existing ones
    setisResponseScreen(true);
    setMessage(""); // Clear the input field after sending the message
    console.log(result.response.text());
  };

  const newChat = () => {
    setisResponseScreen(false);
    setMessages([]); // Clear the messages array
  };

  const checkEnterPress = (e) => {
    if (e.key === "Enter") {
      hitRequest()
    };
  };

  const formatText = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const badgeRegex = /`([^`]*)`/g;
    const lineBreakRegex = /\n/g;

    const codeBlocks = [];
    let formattedText = text.replace(codeBlockRegex, (match, lang, code) => {
      codeBlocks.push({ lang, code });
      return `[code block ${codeBlocks.length - 1}]`;
    });

    formattedText = formattedText
      .replace(badgeRegex, '<span class="badge">`$1`</span>')
      .replace(boldTextRegex, '<strong>$1</strong>')
      .replace(lineBreakRegex, '<br />');

    return { formattedText, codeBlocks };
  };

  return (
    <>
      <div className="container w-screen min-h-screen overflow-x-hidden bg-[#121212] text-white">
        {
          isResponseScreen ?
            <div className='h-[80vh] pb-4 overflow-y-auto'>
              <div className="header pt-[25px] flex items-center justify-between w-full px-8">
                <h2 className='text-2xl'>InfiniChat</h2>
                <button className='bg-[#333] p-2 rounded-[30px] text-[14px]' onClick={newChat}>New Chat</button>
              </div>
              <div className="messages">
                {messages?.map((msg, index) => {
                  const { formattedText, codeBlocks } = formatText(msg.text);
                  const textParts = formattedText.split(/\[code block \d+\]/g);

                  return (
                    <div key={index} className={msg.type}>
                      {textParts.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          <div dangerouslySetInnerHTML={{ __html: part }} />
                          {codeBlocks[partIndex] && (
                            <SyntaxHighlighter language={codeBlocks[partIndex].lang || 'plaintext'} style={vs2015}>
                              {codeBlocks[partIndex].code}
                            </SyntaxHighlighter>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div> :
            <div className="middle h-[80vh] flex items-center flex-col justify-center">
              <h1 className='text-4xl'>InfiniChat</h1>
              <div className="boxes mt-8 flex flex-wrap gap-4 justify-center">
                <div className="card rounded-lg bg-[#181818] p-6 min-w-[200px] max-w-[250px] hover:bg-[#333] cursor-pointer transition-all">
                  <p className='text-[18px]'>What is coding? How can we learn it?</p>
                  <IoCodeSlash className='absolute right-3 bottom-3 text-[18px]' />
                </div>
                <div className="card rounded-lg bg-[#181818] p-6 min-w-[200px] max-w-[250px] hover:bg-[#333] cursor-pointer transition-all">
                  <p className='text-[18px]'>Which is the red planet of the solar system?</p>
                  <BiPlanet className='absolute right-3 bottom-3 text-[18px]' />
                </div>
                <div className="card rounded-lg bg-[#181818] p-6 min-w-[200px] max-w-[250px] hover:bg-[#333] cursor-pointer transition-all">
                  <p className='text-[18px]'>In which year was Python invented?</p>
                  <FaPython className='absolute right-3 bottom-3 text-[18px]' />
                </div>
                <div className="card rounded-lg bg-[#181818] p-6 min-w-[200px] max-w-[250px] hover:bg-[#333] cursor-pointer transition-all">
                  <p className='text-[18px]'>How can we use AI for adoption?</p>
                  <TbMessageChatbot className='absolute right-3 bottom-3 text-[18px]' />
                </div>
              </div>
            </div>
        }

        <div className="bottom w-full flex flex-col items-center py-4">
          <div className="inputBox w-[60%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
            <input onKeyUp={checkEnterPress} value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className='p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none' placeholder='Write your message here...' />
            {message && <IoSend className='text-green-500 text-[20px] mr-5 cursor-pointer' onClick={hitRequest} />}
          </div>
          <p className='text-[gray] text-[14px] mt-4'>InfiniChat is developed by Maruf Khan using the Gemini API for AI responses.</p>
        </div>
      </div>
    </>
  )
}

export default App;
