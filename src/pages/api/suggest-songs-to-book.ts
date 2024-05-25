import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI();

const JSON_SCHEMA = {
  song_suggestions: "array of strings (10 strings for 10 songs)"
}

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

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `You are given an optional book title, book description and music genre. Suggest 10 songs that fit the vibe and mood of the book and are fitting well to listen to while reading it. 

Please respond with your book suggestions directly in JSON format without using Markdown code blocks or any other formatting. The JSON Schema should look like this: 

{
  "song_suggestions": ["song1", "song2", "song3", "song4", "song5", "song6", "song7", "song8", "song9", "song10"]
}
` },
{
  role: "user",
  content: `Book Title: ${title || 'No title provided'}
  
Book Description: ${description || 'No description provided'}

Music Genre: ${genre || 'No music genre provided'}`
}
      ],
      model: "gpt-4o",
      response_format: {
        type: "json_object",
      }
    });

    const promptOutput = completion.choices[0].message.content
    if (!promptOutput) throw new Error('No prompt output');

    res.status(200).json(JSON.parse(promptOutput));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
    return;
  }
};

export default generateAction;
