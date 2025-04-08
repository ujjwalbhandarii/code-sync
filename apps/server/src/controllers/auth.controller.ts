import { ApiError } from "../utils/helpers/api-error.js";
import { authService } from "../services/auth.service.js";
import { tryCatch } from "../middlewares/try-catch.middleware.js";
import { loginSchema, signupSchema } from "../schema/auth.schema.js";

export const userLogin = tryCatch(async (req, res) => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success)
    throw ApiError.BadRequest("Validation failed", parsedBody.error.errors);

  const user = await authService.getUser({
    role: parsedBody.data.role,
    email: parsedBody.data.email,
  });

  if (!user) throw ApiError.NotFound("User not found!");

  const passwordMatch = await authService.passwordMatch({
    loginPassword: user.password,
    userPassword: parsedBody.data.password,
  });

  if (!passwordMatch) throw ApiError.BadRequest("Password didn't match");

  const access_token = await authService.signToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  return res.status(200).send({ access_token });
});

export const userSignup = tryCatch(async (req, res) => {
  const parsedBody = signupSchema.safeParse(req.body);

  if (!parsedBody.success)
    throw ApiError.BadRequest("Validation failed", parsedBody.error.errors);

  const user = await authService.getUser({
    role: parsedBody.data.role,
    email: parsedBody.data.email,
  });

  if (user) throw ApiError.BadRequest("User already exists!");

  const hashPassword = await authService.hashPassword({
    password: parsedBody.data.password,
  });

  const newUser = await authService.createUser({
    ...parsedBody.data,
    role: "USER",
    password: hashPassword,
  });

  return res
    .status(201)
    .json({ message: "User created successfully", email: newUser.email });
});

export const googleLogin = tryCatch(async (req, res) => {
  const { code } = req.query;

  if (!code) throw ApiError.BadRequest("Code not found");
});
