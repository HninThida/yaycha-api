const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { UserSeeder } = require("./UserSeeder");
const { CommentSeeder } = require("./CommentSeeder");
const { PostSeeder } = require("./PostSeeder");
const { LikeSeeder } = require("./LikeSeeder");
async function main() {
  try {
    console.log("hello running main");
    // await LikeSeeder();
    await UserSeeder();
    await PostSeeder();
    await CommentSeeder();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
