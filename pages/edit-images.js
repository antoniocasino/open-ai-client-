import Head from "next/head";
import React, { useRef, useState } from 'react';
import styles from "./index.module.css";
import path from "path";

export default function EditImages() {
  const [textInput, setTextInput] = useState("");
  const [previous, setPreviuos] = useState("");
  const [result, setResult] = useState();
  const [filePath, setFilePath] = useState("");  

  async function onSubmit(event) {      
    console.log("filePath",filePath);
    event.preventDefault();
    if(!textInput) return;
    const response = await fetch(`/api/edit-images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },      
      body: JSON.stringify({ text: textInput,filePath:filePath }),
    });
    const data = await response.json();
    setResult(data.result);
    setPreviuos(textInput);
    setTextInput("");
  }  

  function readFileURL(event) {
    let input = event.target.files[0];      
    console.log(input);
    let response = fetch(`/api/upload-images?name=${input.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },      
      body: input,
    });
    var base = path.resolve('.');
    let newpath = base+"/temp/" + input.name;  
    console.log(newpath);
    setFilePath(newpath);      
  }

  
  return (
    <div>
      <Head>
        <title>OpenAI Image Generation</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <a href="/"><img src="/home.png"  style={{color:"white", background:"white"}} className={styles.icon} /></a>
        <h3>Enter a description text for an image. OpenAi will generate the image for you :)</h3>
        <a href="/"><img src="/ita.jpg" className={styles.icon} /></a>
        <h3>Insersci un testo descrittivo per una immagine. OpenAi creerà l'immagine per te :)</h3>
        <form onSubmit={onSubmit}>
          Upload the starting file: <input type="file" onChange={readFileURL}></input>
          <textarea type="text center" rows="3" cols="40" name="text2img"
            placeholder="Enter a description text"         
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
