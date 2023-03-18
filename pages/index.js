import React, { useRef, useState } from 'react';
import Head from "next/head";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import styles from "./index.module.css";
import Loading from './Loading';

export default function AudioInterface() {
   
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const microphoneRefIta = useRef(null);
  const microphoneRefEng = useRef(null);
  const [aiResponse, setAiResponse] = useState([]);
  const [text, setText] = useState("");
  const [myQuestions, setMyQuestions] = useState([]); 

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser does not Support Speech Recognition.
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
    setText(transcript);
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
        <link rel="stylesheet" href="/conversation.css"/>          
        <link rel="stylesheet" href="/mic.css"/>
      </Head>     
      <div>                  
        <div className="microphone-wrapper">    
          <div>
            <h2 className='title'>
              Start a conversation with Chat GPT 3.5
            </h2>
          </div>      
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
          <div className="microphone-result-text row">
            <textarea style={{ width:"18rem", height:"3rem" , overflow:"auto"}} cols="35" rows="5" onChange={handleChange} value={text}></textarea>
          </div>
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
        {!!showLoader ? <Loading></Loading>:null}
        {!!aiResponse.length ? display(aiResponse,myQuestions) : null}
      </div>
    </div>
  );

  function handleChange(event) {
    setText(event.target.value);
  }
 
  async function generateConversation(){
    let data = await generate("/api/chat");     
    setAiResponse([parseChoise(data),...aiResponse]);        
    setMyQuestions([text,...myQuestions]);
    resetTranscript();
  }

  async function generateImage(){
    let data = await generate("/api/generate");    
    setAiResponse([{ body:data.result, isImage:true },...aiResponse]);        
    setMyQuestions([text,...myQuestions]);
    resetTranscript();
  }

  function parseChoise(response){
    if(!!response && !!response.result.choices.length){
        return { text:response.result.choices[0].message.content, isImage:false}
    }
    return null;
  }

  function display(aiResponse,myQuestions){              
    let tableBody = aiResponse.map((res,index)=>
    (<div key={index} style={{display: "grid"}} className="row"><li className="message left"><p>{myQuestions[index]}</p></li><li className="message right">{ res.isImage ? (<img src={res.body}/>) : (<p>{res.text}</p>) }</li>)</div>));
    return (<div className="chat-container"><ul className="chat">{tableBody}</ul></div>);
  }
  
  async function generate(url){
    setShowLoader(true);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: text }),
    });
    setShowLoader(false);
    return response.json();
  }

  
}

