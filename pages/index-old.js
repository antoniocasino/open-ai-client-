import Head from "next/head";
import styles from "./index.module.css";
import React, { useRef, useState } from 'react';

export default function Home() {

  return (
    <div>
      <Head>
        <title>OpenAI Generation</title>
        <link rel="icon" href="/dog.png" />
        <link rel="stylesheet" href="conversation.css"/>
      </Head>

      <main className={styles.main}>
        <h3>OpenAI Examples <img src="/home.png" style={{color:"white", background:"white"}} className={styles.icon} /></h3>
        <ul>          
          <li>
            <h4><a href="/voice-interface">Voice Interface</a></h4>
          </li>
        </ul>        
      </main>
    </div>
  );
}
