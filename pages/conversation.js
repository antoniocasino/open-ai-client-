import Head from "next/head";
import React from 'react';
import { useState } from "react";
import styles from "./index.module.css";

export default function Conversation() {
    const [myInput, setMyInput] = useState("");    
    const [aiResponse, setAiResponse] = useState("");
    const [myQuestions, setMyQuestions] = useState([]);    
    
    async function onSubmit(event) {
        event.preventDefault();
        if(!myInput) return;
        const response = await fetch("/api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload: myInput }),
        });
        const data = await response.json();
        setAiResponse([parseChoise(data),...aiResponse]);        
        setMyQuestions([myInput,...myQuestions]);
        setMyInput("");
    }

    return (
        <div>
          <Head>
            <title>OpenAI Conversation</title>
            <link rel="icon" href="/dog.png" />
            <link rel="stylesheet" href="conversation.css"/>
          </Head>
    
          <main className={styles.main}>
            <a href="/" style={{color:"white"}}><img src="/home.png" style={{color:"white", background:"white"}} className={styles.icon} /></a>
            <h3 style={{color:"white"}}>Start a conversation with OpenAI Chat GPT</h3>
            <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
            <h3 style={{color:"white"}}>Inizia una conversazione con OpenAI Chat GPT</h3>
            <form onSubmit={onSubmit}>
              <textarea type="text center" rows="3" cols="40" name="text2img"
                placeholder="Start a conversation with OpenAI"         
                value={myInput}
                onChange={(e) => {
                  setMyInput(e.target.value); 
                  if(e.nativeEvent.inputType === "insertLineBreak") { onSubmit(e);}
                }}
              />
              <input type="submit" value="conversa" />
            </form> 
            {!!aiResponse ? display(aiResponse,myQuestions) : null}                
          </main>
        </div>
    );
   
    function parseChoise(response){
        if(!!response && !!response.result.choices.length){
            return response.result.choices[0].text           
        }
        return null;
    }
    
    function display(aiResponse,myQuestions){              
      let tableBody = aiResponse.map((res,index)=>(<><li className="message left"><p>{myQuestions[index]}</p></li><li class="message right"><p>{res}</p></li>)</>));
      return (<div className="chat-container"><ul className="chat">{tableBody}</ul></div>);
    }

}