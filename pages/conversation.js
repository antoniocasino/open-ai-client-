import Head from "next/head";
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
          body: JSON.stringify({ text: myInput }),
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
          </Head>
    
          <main className={styles.main}>
            <a href="/"><img src="/home.png" className={styles.icon} /></a>
            <h3>Start a conversation with OpenAI</h3>
            <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
            <h3>Inizia una conversazione con OpenAI</h3>
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
      let tableBody = aiResponse.map((res,index)=> (<tr><td><textarea rows="3" readonly="readonly" cols="40" style={{border:"solid 2px purple"}} value={myQuestions[index]}></textarea></td><td><textarea rows="3" cols="40" readonly="readonly" value={res} style={{border:"solid 2px grey"}}></textarea></td></tr>));
      return (<div id="myDiv" style={{"maxHeight":"27rem", "overflow-y":"scroll", "marginTop":"1rem"}}><table><tr><th>Myself</th><th>OpenAI</th></tr>{tableBody}</table></div>);
    }

}