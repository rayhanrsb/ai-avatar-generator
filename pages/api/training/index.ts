import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // The API expects four inputs from the front-end
    // The intance prompt - what specific subject we are training the model on - e.g. "a photo of a Rayhan person"
    // The class prompt - how would we classify the subject, - e.g. "a photo of a person"
    // The instance data - a zip file of photos of the subject to be used to train the model
    // The model name - a name to give the newly created model
    const {instancePrompt, classPrompt, instanceData, modelName} = req.body
    // The class prompt - how would we classify the subject, - e.g. "a photo of a person"
  const response = await fetch(
    "https://dreambooth-api-experimental.replicate.com/v1/trainings",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pinned to a specific version of Stable Diffusion
        // See https://replicate.com/stability-ai/stable-diffussion/versions
        version:
          "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",

        // This is the text prompt that will be submitted by a form on the frontend
        input: {
          instance_prompt: instancePrompt,
          class_prompt: classPrompt,
          instance_data: instanceData,
          max_train_steps: 2000, // Fewer steps reduces quality, more steps increases quality
        },
        model: 'rayhanrsb' + modelName,
        trainer_version: "cd3f925f7ab21afaef7d45224790eedbb837eeac40d22e8fefe015489ab644aa", // This is the id of Stable Diffusion 1.5, which has been observed to work better with DreamBooth. If you want to use the more powerful stable diffusion 2.1, replace with: d5e058608f43886b9620a8fbb1501853b8cbae4f45c857a014011c86ee614ffb
        // Future implementation - this API also accepts a webhook_completed: "https://example.com/dreambooth-webhook" field where I can specify a webhook to call on completion. That way we are not shooting in the dark by waiting a certain amount of time then trying again.
      }),
    }
  );

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const jsonResponse = await response.json();
  res.statusCode = 201;
  // Send back the ID of the response which can be used on the front-end to check the status of the training
  res.end(JSON.stringify({id: jsonResponse.id}));
}
