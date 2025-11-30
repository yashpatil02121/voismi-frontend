1.
Clone repository
https://github.com/yashpatil02121/voismi-frontend.git


2.
Create files in root directory

.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000


.env.production
NEXT_PUBLIC_API_URL=https://your-live-domain.com


next-env.d.ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.


3.
type in terminal
pnpm install


4.
type in terminal
pnpm dev