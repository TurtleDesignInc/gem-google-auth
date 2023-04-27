// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {email, password} = req.body;
  const response = await fetch('https://e9d4-24-86-223-157.ngrok-free.app/user/deactivate', { method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
})
const resJson = await response.json();
console.log(resJson)  
}
