import type { NextApiRequest, NextApiResponse } from 'next'

// This function takes a given custom model version and submits a prompt to generate
// a custom image of the subject on which the model is trained
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // The API expects two inputs from the front-end
    // The prompt - what the model will generate an image of
    // The version - the version number of the custom model so we know what to call
    const {prompt, version} = req.body
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version: version,

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: prompt },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}