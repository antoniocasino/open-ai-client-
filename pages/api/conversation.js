import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.payload,
    max_tokens: 2000,
    temperature: 0
  });  
  res.status(200).json({result: response.data});
}
