import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Comments() {
    const [textInput, setTextInput] = useState("");    
    const [result, setResult] = useState("");
    const [previous, setPreviuos] = useState("");
    
    async function onSubmit(event) {
        event.preventDefault();
        if(!textInput) return;
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textInput + "\n /* Here's what the above class is doing:" }),
        });
        const data = await response.json();
        setResult(data.result);
        console.log(data);      
    }

    return (
        <div>
          <Head>
            <title>OpenAI comment generation</title>
            <link rel="icon" href="/dog.png" />
          </Head>
    
          <main className={styles.main}>
            <a href="/"><img src="/dog.png" className={styles.icon} /></a>
            <h3>Enter the code you want to be commented by</h3>
            <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
            <h3>Insersci un codice per cui generare il commento</h3>
            <form onSubmit={onSubmit}>
              <textarea type="text center" rows="15" cols="40" name="text2img"
                placeholder="Enter the code you want to be commented by"         
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <input type="submit" value="Generate comments human readable" />
            </form>             
            {display(result)}
          </main>
        </div>
    );
   
    function display(result){
        if(!!result && !!result.choices){
           let list = result.choices.map((el,index) => <li key={index}>{el.text}</li>);
           console.log("list",list);
           return <ol>{list}</ol>;
        }
        return null;
    }
}