import type { NextApiRequest, NextApiResponse } from "next";

// This function will check the status of the training, and if it is completed it will
// return the version which can be used to call the trained model
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    "https://dreambooth-api-experimental.replicate.com/v1/trainings/" +
      req.query.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }
  res.statusCode = 200;
  const jsonResponse = await response.json();
  // If the training is complete, it will send back the status and the version to the front end
  if (jsonResponse.status === 'succeeded' && jsonResponse.version) {
    res.end(JSON.stringify({
        status: jsonResponse.status,
        version: jsonResponse.version
    }));
  }
  else {
    // If the training is incomplete, it will send back only the status
    res.end(JSON.stringify({status: jsonResponse.status}));
  }
}
