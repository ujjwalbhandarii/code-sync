import express from "express";
import passport from "passport";

const router = express.Router();

router.post("/login", () => {});
router.post("/signup", () => {});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (_, res) => {
    res.redirect("/profile");
  }
);

export default router;
