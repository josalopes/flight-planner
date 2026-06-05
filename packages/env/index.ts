import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
    server: {
        PORT: z.coerce.number().default(3333),
        DATABASE_URL: z.url(),
        JWT_SECRET: z.string(),
        
    },
    client: {},
    shared: {
        NEXT_PUBLIC_API_URL: z.url(),
        NEXT_PUBLIC_URL: z.url(),
        AISWEB_CHARTS_URL: z.url(),
        AISWEB_API_URL: z.url(),
        AISWEB_API_KEY: z.string(),
        AISWEB_API_PASSWORD: z.string(),
    },
    runtimeEnv: {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        AISWEB_CHARTS_URL: process.env.AISWEB_CHARTS_URL,
        AISWEB_API_URL: process.env.AISWEB_API_URL,
        AISWEB_API_KEY: process.env.AISWEB_API_KEY,
        AISWEB_API_PASSWORD: process.env.AISWEB_API_PASSSWORD,
    },
    emptyStringAsUndefined: true,
})