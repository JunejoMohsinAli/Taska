import { z } from "zod";

// Login‑in
export const loginSchema = z.object({
  email:    z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginData = z.infer<typeof loginSchema>;

// Sign‑up
export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    role:     z.enum(["web", "ios", "android", "SQA"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    email:    z.string().trim().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })

export type SignupData = z.infer<typeof signupSchema>;
