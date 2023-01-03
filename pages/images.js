import Head from "next/head";
import React, { useRef, useState } from 'react';
import styles from "./index.module.css";

export default function Images() {
  const [myInput, setMyInput] = useState("");    
  const [aiResponse, setAiResponse] = useState("");
  const [myQuestions, setMyQuestions] = useState([]);    

  async function onSubmit(event) {
    event.preventDefault();
    if(!myInput) return;
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: myInput }),
    });
    const data = await response.json();
    setAiResponse([data.result,...aiResponse]);        
    setMyQuestions([myInput,...myQuestions]);
    setMyInput("");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Image Generation</title>
        <link rel="icon" href="/dog.png" />
        <link rel="stylesheet" href="conversation.css"/>
      </Head>

      <main className={styles.main}>
        <a href="/"><img src="/home.png" style={{color:"white", background:"white"}} className={styles.icon} /></a>
        <h3 style={{color:"white"}}>Enter a description text for an image. OpenAi will generate the image for you :)</h3>
        <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
        <h3 style={{color:"white"}}>Insersci un testo descrittivo per una immagine. OpenAi creerà l'immagine per te :)</h3>
        <form onSubmit={onSubmit}>
          <textarea type="text center" rows="3" cols="40" name="text2img"
            placeholder="Enter a description text for an image"         
            value={myInput}
            onChange={(e) => {
              setMyInput(e.target.value); 
              if(e.nativeEvent.inputType === "insertLineBreak") { onSubmit(e);}
            }}
          />
          <input type="submit" value="Generate images" />
        </form>
        {!!aiResponse ? display(aiResponse,myQuestions) : null}
      </main>
    </div>
  );

  function display(aiResponse,myQuestions){              
    let tableBody = aiResponse.map((res,index)=>(<><li className="message left"><p>{myQuestions[index]}</p></li><li class="message right"><img src={res}/></li></>));
    return (<div className="chat-container"><ul className="chat">{tableBody}</ul></div>);
  }
}
