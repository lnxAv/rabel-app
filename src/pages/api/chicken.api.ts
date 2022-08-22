import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    pacow: `
    \n     __//
    \ncf  /.__.\
    \n    \ \/ /
    \n '__/    \
  \-      )
       \_____/
    _____|_|____
         " "     `,
  });
}
