import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Sentiment() {
    const [textInput, setTextInput] = useState("");    
    const [result, setResult] = useState("");
    const [previous, setPreviuos] = useState("");
    
    async function onSubmit(event) {
        event.preventDefault();
        if(!textInput) return;
        const response = await fetch("/api/sentiment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aggressiveText: textInput }),
        });
        const data = await response.json();
        setResult(data.result);        
        setPreviuos(textInput);
        setTextInput("");
    }

    return (
        <div>
          <Head>
            <title>OpenAI Sentiment Check</title>
            <link rel="icon" href="/dog.png" />
          </Head>
    
          <main className={styles.main}>
            <a href="/"><img src="/home.png" className={styles.icon} /></a>
            <h3>Enter a text. OpenAi will evaluate how aggressive the text is</h3>
            <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
            <h3>Insersci un testo. OpenAi valuterà quanto il testo è aggressivo</h3>
            <form onSubmit={onSubmit}>
              <textarea type="text" rows="3" cols="40" name="text2img"
                placeholder="Enter a text. OpenAi will evaluate how aggressive the text is"         
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value); 
                  if(e.nativeEvent.inputType === "insertLineBreak") { onSubmit(e);}
                }}
              />
              <input type="submit" value="Analyze sentiment in the sentence" />
            </form> 
            {!!result ? <h3 style={{color:"purple"}}>{previous}</h3> : null }           
            {display(result)}
          </main>
        </div>
    );
   
    function display(result){
        if(!!result && !!result.results){
            let aggressive = result.results.flatMap(category=>Object.entries(category.category_scores)
                .filter((key,value)=>{console.log(key); return key[1]>0.0005;}));
            if(!!aggressive.length){
                return <h3> {aggressive.map(entry=> <div><i><span style={{"color":"red"}}>{entry[0]}</span>: {entry[1]/0.0005}</i></div>)}</h3>
            }
        }
        return null;
    }
}