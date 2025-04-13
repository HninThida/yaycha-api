const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { auth } = require("../middlewares/auth");
const { skip } = require("@prisma/client/runtime/library");

router.get("/users/:skip/:take", async (req, res) => {
  const { skip, take } = req.params;
  const data = await prisma.user.findMany({
    include: { posts: true, comments: true, followers: true, following: true },
    orderBy: { id: "desc" },
    take: Number(take),
    skip: Number(skip),
  });
  const count = await prisma.user.count();
  res.json({ data, count: count });
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const data = await prisma.user.findFirst({
    where: { id: Number(id) },
    include: {
      posts: {
        include: {
          user: true,
          comments: true,
          postLike: true,
        },
      },
      comments: true,
      followers: true,
      following: true,
    },
  });
  const userWithTotalPost = {
    ...data,
    totalPosts: data.posts.length,
    totalComments: data.comments.length,
  };
  res.json(userWithTotalPost);
});

router.post("/users", async (req, res) => {
  const { name, username, bio, password } = req.body;
  if (!name || !username || !password) {
    return res
      .status(400)
      .json({ msg: "name ,username and password required" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      bio,
      password: hash,
      username,
    },
  });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "username and password required" });
  }
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (user) {
    if (bcrypt.compare(password, user.password)) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ token, user });
    }
  }
  res.status(401).json({ msg: "incorrect username or password" });
});

router.get("/verify", auth, async (req, res) => {
  const user = res.locals.user;
  res.json(user);
});

router.get("/search/:skip/:take", async (req, res) => {
  const { q } = req.query;
  const { skip, take } = req.params;

  try {
    const data = await prisma.user.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      include: {
        followers: true,
        following: true,
      },
      take: Number(take),
      skip: Number(skip),
    });
    const count = await prisma.user.count({
      where: {
        name: {
          contains: q,
        },
      },
    });
    res.json({ data, count: count });
  } catch (error) {
    res.status(500).json({ error: e });
  }
});

module.exports = { userRouter: router };
