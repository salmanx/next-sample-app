"use server";

import { paths } from "@/app/paths";
import { auth } from "@/auth";
import { db } from "@/db";
import { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(3).max(250),
  content: z.string().min(10),
});

interface CreateFormState {
  errors: {
    title?: string[];
    content?: string[];
    _error?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreateFormState,
  formData: FormData
): Promise<CreateFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _error: ["You must signin to create a post"],
      },
    };
  }

  const title = formData.get("title");
  const content = formData.get("content");
  const result = createPostSchema.safeParse({ title, content });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const topic = await db.topic.findFirst({ where: { slug } });
  if (!topic) {
    return {
      errors: {
        _error: ["Couldn't find the topic"],
      },
    };
  }

  let post: Post;

  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _error: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _error: ["Couldn't save post, something went wrong"],
        },
      };
    }
  }

  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));
}
