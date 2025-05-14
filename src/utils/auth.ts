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
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  });

export type SignupData = z.infer<typeof signupSchema>;
