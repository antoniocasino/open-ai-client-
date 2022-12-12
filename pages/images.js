import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Images() {
  const [textInput, setTextInput] = useState("");
  const [previous, setPreviuos] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if(!textInput) return;
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text2img: textInput }),
    });
    const data = await response.json();
    setResult(data.result);
    setPreviuos(textInput);
    setTextInput("");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Image Generation</title>
        <link rel="icon" href="/dog.png" />
        <link rel="stylesheet" href="conversation.css"/>
      </Head>

      <main className={styles.main}>
        <a href="/"><img src="/home.png" style={{color:"white"}} className={styles.icon} /></a>
        <h3 style={{color:"white"}}>Enter a description text for an image. OpenAi will generate the image for you :)</h3>
        <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
        <h3 style={{color:"white"}}>Insersci un testo descrittivo per una immagine. OpenAi creerà l'immagine per te :)</h3>
        <form onSubmit={onSubmit}>
          <textarea type="text center" rows="3" cols="40" name="text2img"
            placeholder="Enter a description text for an image"         
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value); 
              if(e.nativeEvent.inputType === "insertLineBreak") { onSubmit(e);}
            }}
          />
          <input type="submit" value="Generate images" />
        </form>
        {!!result ? <h3 style={{color:"purple"}}>{previous}</h3> : null }
        <div className={styles.result}><img src={result}/></div>
      </main>
    </div>
  );
}
