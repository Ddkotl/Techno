import { Prisma } from '@prisma/client';
import { returnCategoryObject } from 'src/category/return-category.object';
import { returnReviewObject } from 'src/review/return-review.object';
import { returnUserObject } from 'src/user/return-user.object';

export const returnPostObject: Prisma.PostSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  images: true,
};

export const returnPostObjectFullest: Prisma.PostSelect = {
  ...returnPostObject,
  category: { select: returnCategoryObject },
  user: { select: returnUserObject },
  reviews: { select: returnReviewObject },
};
