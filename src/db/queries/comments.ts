import { Comment } from "@prisma/client";
import { db } from "@/db";
import { cache } from "react";

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

// export async function fetchCommentByPostId(
//   postId: string
// ): Promise<CommentWithAuthor[]> {
//   console.log("Making a query");
//   return db.comment.findMany({
//     where: { postId },
//     include: {
//       user: {
//         select: {
//           name: true,
//           image: true,
//         },
//       },
//     },
//   });
// }

// cache version fetching comment by post id
export const fetchCommentByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    console.log("Making a query");
    return db.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);
