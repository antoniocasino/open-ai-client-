import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {

  return (
    <div>
      <Head>
        <title>OpenAI Generation</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>OpenAI Examples</h3>
        <ol>
          <li>
            <h4><a href="/images">Image generation</a></h4>
          </li>
          <li>
            <h4><a href="/sentiment">Sentiment classification</a></h4>    
          </li>
          <li>
            <h4><a href="/conversation">Conversation</a></h4>    
          </li>
          <li>
            <h4><a href="/comments">Code comments generation</a></h4>    
          </li>
        </ol>        
      </main>
    </div>
  );
}
