import { faker } from '@faker-js/faker';
import { Post, PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import * as dotenv from 'dotenv';
import urlSlug from 'url-slug';
import { getRandomNumber } from '../src/utils/rundom-number';

dotenv.config();
const prisma = new PrismaClient();

const createPosts = async (quantity: number) => {
  const posts: Post[] = [];

  for (let i = 0; i < quantity; i++) {
    const postTitle = faker.string.alpha(15);
    const postSlug = urlSlug(postTitle);
    const postDescription = faker.string.alpha(50);
    const postContent = faker.string.alpha(150);
    const categoryName = faker.commerce.department();
    const categorySlug = urlSlug(categoryName);
    const userName = faker.internet.userName();
    const userEmail = faker.internet.email();
    const userPassword = await hash(faker.internet.password());
    const userPhone = faker.phone.number();

    const post = await prisma.post.create({
      data: {
        title: postTitle,
        slug: postSlug,
        description: postDescription,
        content: postContent,
        user: {
          create: {
            email: userEmail,
            name: userName,
            password: userPassword,
            phone: userPhone,
            avatarPath: faker.image.avatar(),
          },
        },
        category: {
          create: {
            name: categoryName,
            slug: categorySlug,
          },
        },
        images: Array.from({
          length: getRandomNumber(2, 6),
        }).map(() => faker.image.url()),
        reviews: {
          create: [
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: { id: 1 },
              },
            },
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: { id: 1 },
              },
            },
          ],
        },
      },
    });
    posts.push(post);
  }

  console.log(`Created ${posts.length} posts`);
};

async function main() {
  console.log('Start seedeng...');
  await createPosts(10);
}

main()
  .catch((er) => console.error(er))
  .finally(async () => {
    await prisma.$disconnect();
  });
