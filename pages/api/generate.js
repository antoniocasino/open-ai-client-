import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  const response = await openai.createImage({
    prompt: req.body.payload,
    n: 1,
    size: "256x256",
  });
  res.status(200).json({ result: response.data.data[0].url});
}
