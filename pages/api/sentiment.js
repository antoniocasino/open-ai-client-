import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  const response = await openai.createModeration({
    input:req.body.payload    
  });  
  res.status(200).json({result: response.data});
}
