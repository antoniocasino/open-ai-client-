import React, { useRef, useState } from 'react';
import Head from "next/head";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Loading from './Loading';
import TextReader, {useTextReader} from "react-text2speech";

export default function AudioInterface() {
   
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const microphoneRefIta = useRef(null);
  const [aiResponse, setAiResponse] = useState([]);
  const [text, setText] = useState("");
  const [myQuestions, setMyQuestions] = useState([]); 
  const { bindReader, handlers, state } = useTextReader();
  const { play, pause, showReader } = handlers;
	const { isReading, isLoading, isVisible } = state;
  const [node, setNode] = useState(null);


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
      <meta author="Antonio Casino"></meta>
      <meta description="BOT basato su OPEN AI"></meta>
      <Head>
        <title>BOT basato su OPEN AI</title>       
        <link rel="stylesheet" href="/conversation.css"/>                  
      </Head>     
                      
      <div className="chat-app-container" style={{textAlign:"center"}}>          
          <h2 className='title'>
            BOT basato su OPEN AI
          </h2>          
      
        <div className="microphone-result-text">       
            <textarea style={{ width:"80%", height:"3rem" , overflow:"auto"}} cols="40" rows="5" onChange={handleChange} value={text}></textarea>            
            <span className="microphone-icon-container mic-ita" ref={microphoneRefIta} onClick={()=>toggleClick('it-IT',microphoneRefIta)}><img src="/mic2.png" style={{height:"3rem"}}  /></span>
        </div>             
      
        <div className="microphone-wrapper">
          <div>
            <div className="generate-image">
              <img src="/image.jpg"  className="microphone-icon" title="crea una immagine" onClick={generateImage}/> 
              <img src="/conversation.jpg" className="microphone-icon" title="chatta" onClick={generateConversation}/> 
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
    (<div key={index} style={{display: "grid"}} className="row">
      <li className="message left"><p>{myQuestions[index]}</p></li>
      <li className="message right">{ res.isImage ? (<img src={res.body}/>) : 
      (<><p ref={setNode} onClick={()=>play()}>{res.text}</p>
        {node && index==aiResponse.length-1 && <TextReader textContainer={node} bindReader={bindReader} options={{ language: 'it' }} />}</>) }</li>)</div>));
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

