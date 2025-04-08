import { z } from "zod";
import { ROLE } from "@prisma/client";

const ROLES = Object.values(ROLE) as [string, ...string[]];

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
  role: z.enum(ROLES),
});

const signupSchema = z.object({
  role: z.enum(ROLES),
  email: z.string().email(),
  city: z.string().optional(),
  name: z.string().optional(),
  country: z.string().optional(),
  zip_code: z.number().optional(),
  province: z.string().optional(),
  address_two: z.string().optional(),
  address_one: z.string().optional(),
  image: z.string().url().optional(),
  mobile_number: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginBody = z.infer<typeof loginSchema>;
type SignupBody = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema, LoginBody, SignupBody };
