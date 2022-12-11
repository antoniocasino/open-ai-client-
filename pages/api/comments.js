import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  const response = await openai.createCompletion({
    model: "code-davinci-003",
    prompt: req.body.text,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\"\"\""],      
  }); 
  //console.log(response);
  res.status(200).json({result: response.data});
}
