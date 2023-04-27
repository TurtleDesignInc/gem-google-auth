// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const {email, password} = req.body;
    const response = await fetch('https://e9d4-24-86-223-157.ngrok-free.app/user/activate', { 
      method: 'POST',
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
        email: email,
        password: password,
    }),
  })
    console.log(response)
    const resJson = await response.json();
    console.log(resJson)
    return res.status(200).end();
  } catch(err){
    console.log(err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
  

}
