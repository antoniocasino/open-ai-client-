import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text2img: textInput }),
    });
    const data = await response.json();
    setResult(data.result);
    setTextInput("");
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Describe an image</h3>
        <form onSubmit={onSubmit}>
          <textarea type="text" rows="3" cols="40" name="text2img" 
            placeholder="Enter a description for the img"         
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type="submit" value="Generate images" />
        </form>
        <div className={styles.result}><img src={result}/></div>
      </main>
    </div>
  );
}
