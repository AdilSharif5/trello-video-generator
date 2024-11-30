export type Post = {
  id: string;
  title: string;
  content?: string;
  featuredImage?: string;
  description?: string;
  claps?: number;
  clappers?: { [userId: string]: number };
  createdAt?: number;
  userId: string;
  tags?: string[];
  comments?: Comment[];
};
