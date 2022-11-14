import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {   
    console.log("req.body.filePath",req.body.filePath);
    console.log("req.body.text",req.body.text);
    const response = await openai.createImageEdit(
        fs.createReadStream(`${req.body.filePath}`),
        fs.createReadStream(`${req.body.filePath}`),
        "genera fumetto",
        1,
        "512x512"    );
    res.status(200).json({ result: response.data.data[0].url});
}
  