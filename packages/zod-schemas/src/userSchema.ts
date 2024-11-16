import { z } from "zod";

// Example Zod schema
export const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
});
