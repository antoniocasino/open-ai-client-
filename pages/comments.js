import Head from "next/head";
import React from 'react';
import { useState } from "react";
import styles from "./index.module.css";

export default function Comments() {
    const [textInput, setTextInput] = useState("");    
    const [result, setResult] = useState("");
    
    async function onSubmit(event) {
        event.preventDefault();
        if(!textInput) return;
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload: textInput + "\n /* Here's what the above class is doing:" }),
        });
        const data = await response.json();
        setResult(data.result);         
    }

    return (
        <div>
          <Head>
            <title>OpenAI comment generation</title>
            <link rel="icon" href="/dog.png" /> 
            <link rel="stylesheet" href="conversation.css"/>          
          </Head>
    
          <main className={styles.main}>
            <a href="/"><img src="/home.png" style={{color:"white", background:"white"}} className={styles.icon} /></a>
            <h3 style={{color:"white"}}>Enter the code you want to be commented by</h3>
            <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
            <h3 style={{color:"white"}}>Insersci un codice per cui generare il commento</h3>
            <form onSubmit={onSubmit}>
              <textarea type="text center" rows="15" cols="40" name="text2img"
                placeholder="Enter the code you want to be commented by"         
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value); 
                  if(e.nativeEvent.inputType === "insertLineBreak") { onSubmit(e);}
                }}
              />
              <input type="submit" value="Generate comments human readable" />
            </form>             
            {display(result)}
          </main>
        </div>
    );
   
    function display(result){
        if(!!result && !!result.choices){
           return result.choices.map((el,index) => <h4 key={index}><i>{el.text}</i></h4>);           
        }
        return null;
    }
}