import z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Please provide your name"),
    email: z.string().email("Please provide your email"),
    password: z.string().min(8, "Password must be 8 characters or more"),
    confirmPassword: z.string().min(8, "Password must be 8 characters or more"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.string().email("Please provide your email"),
  password: z.string().min(8, "Password must be 8 characters or more"),
});
