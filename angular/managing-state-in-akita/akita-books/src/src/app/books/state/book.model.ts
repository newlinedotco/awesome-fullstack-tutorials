import { ID } from '@datorama/akita';

export type Book = {
  id: ID;
  name: string;
  author: string;
  genres: string[];
  description: string;
  price: number;
};
