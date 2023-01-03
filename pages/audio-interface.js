import React, { useRef, useState } from 'react';
import Head from "next/head";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import styles from "./index.module.css";

export default function AudioInterface() {
   
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const microphoneRefIta = useRef(null);
  const microphoneRefEng = useRef(null);
  const [aiResponse, setAiResponse] = useState("");
  const [myQuestions, setMyQuestions] = useState([]); 

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const handleListing = (lang,ref) => {
    handleReset();
    setIsListening(true);
    ref.current.classList.add("listening");
    SpeechRecognition.startListening({
      language: lang,
      continuous: true,
    });
  };
  const stopHandle = (ref) => {
    setIsListening(false);
    ref.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    resetTranscript();
  };

  const toggleClick = (lang,ref)=>{
    if(isListening){
      stopHandle(ref);
    }else{
      handleListing(lang,ref);
    }
  }
  
  return (
    <div>
      <Head>
        <title>OpenAI comment generation</title>
        <link rel="icon" href="/dog.png" /> 
        <link rel="stylesheet" href="/conversation.css"/>          
        <link rel="stylesheet" href="/mic.css"/>
      </Head>
    
      <main className={styles.main}>  
        <a href="/"><img src="/home.png" style={{color:"white" , background:"white"}} className={styles.icon} /></a>
        <h3 style={{color:"white"}}>Audio Interface</h3>
       
        <div className="microphone-wrapper">
          <div className="mircophone-container">
            <div
              className="microphone-icon-container mic-ita"
              ref={microphoneRefIta}
              onClick={()=>toggleClick('it-IT',microphoneRefIta)}
            >
              <img src="/mic-ita.png" className="microphone-icon" />
            </div>
            <div
              className="microphone-icon-container mic-eng"
              ref={microphoneRefEng}
              onClick={()=>toggleClick('en-GB',microphoneRefEng)}
            >
              <img src="/mic-eng.png" className="microphone-icon" />
            </div>
          </div>
        </div>

        <div className="microphone-result-container">
          <div className="microphone-result-text">{transcript}</div>
        </div>
        <div className="microphone-wrapper">
          <div className="mircophone-container">
            <div className="microphone-icon-container generate-image">
              <img src="/image.jpg" className="microphone-icon" title="generate an image" onClick={generateImage}/> 
            </div>
            <div className="microphone-icon-container generate-conversation">
              <img src="/conversation.jpg" className="microphone-icon" title="start a conversation" onClick={generateConversation}/> 
            </div>
          </div>
        </div>
        {!!aiResponse ? display(aiResponse,myQuestions) : null}
      </main>
    </div>
  );
 
  async function generateConversation(){
    let data = await generate("/api/conversation"); 
    setIsImage(false);
    setAiResponse([parseChoise(data),...aiResponse]);        
    setMyQuestions([transcript,...myQuestions]);
    resetTranscript();
  }

  async function generateImage(){
    let data = await generate("/api/generate");
    setIsImage(true);
    setAiResponse([data.result,...aiResponse]);        
    setMyQuestions([transcript,...myQuestions]);
    resetTranscript();
  }

  function parseChoise(response){
    if(!!response && !!response.result.choices.length){
        return response.result.choices[0].text           
    }
    return null;
  }

  function display(aiResponse,myQuestions){              
    let tableBody = aiResponse.map((res,index)=>(<><li className="message left"><p>{myQuestions[index]}</p></li><li class="message right">{ isImage ? (<img src={res}/>) : (<p>{res}</p>) }</li>)</>));
    return (<div className="chat-container"><ul className="chat">{tableBody}</ul></div>);
  }
  
  async function generate(url){
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: transcript }),
    });
    return response.json();
  }

  
}

