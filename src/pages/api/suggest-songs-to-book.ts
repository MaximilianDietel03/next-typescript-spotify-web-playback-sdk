import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const prompt = (title: string | undefined, description: string | undefined, genre: string) =>
`
Title: ${title || 'No title'}

Description: ${description || 'No description'}

Take the title and description of the book above and suggest 10 songs that fit the vibe and mood of the book and are good to listen to while reading the book.
The songs should be in the following genre: ${genre}
Make sure to return the suggested songs as a JSON stringified array without a line break.

JSON Stringified Array:
`;
const generateAction = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, description, genre } = req.body;
  try {
    const openAIRes = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt(title, description, genre),
      temperature: 0.7,
      max_tokens: 500,
    })
    const promptOutput = openAIRes.data.choices.pop();
    if (!promptOutput?.text) throw new Error('No prompt output');

    const suggestedSongs = JSON.parse(promptOutput.text);
    res.status(200).json({ output: suggestedSongs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
    return;
  }
};

export default generateAction;
