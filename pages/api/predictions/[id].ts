import type { NextApiRequest, NextApiResponse } from 'next'

// This function takes the id of a prediction and checks/returns the resulting generated image
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await fetch(
      "https://api.replicate.com/v1/predictions/" + req.query.id,
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
  
    const prediction = await response.json();
    res.end(JSON.stringify(prediction));
  }