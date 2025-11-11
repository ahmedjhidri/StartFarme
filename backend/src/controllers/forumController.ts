import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

// Get forum posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort = 'recent' } = req.query;

    const where: any = {};
    if (category) where.category = category as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort === 'recent') orderBy.createdAt = 'desc';
    if (sort === 'popular') orderBy.upvotes = 'desc';

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          take: 5,
        },
      },
      orderBy,
      take: 50,
    });

    res.json(posts);
  } catch (error: any) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { upvotes: 'desc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error: any) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Create post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { category, title, content, images, tags } = req.body;

    if (!category || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await prisma.forumPost.create({
      data: {
        authorId: req.user.userId,
        category,
        title,
        content,
        images: images || [],
        tags: tags || [],
        upvotes: 0,
        expertVerified: false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Upvote post
export const upvotePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const post = await prisma.forumPost.update({
      where: { id },
      data: {
        upvotes: { increment: 1 },
      },
    });

    res.json(post);
  } catch (error: any) {
    console.error('Upvote post error:', error);
    res.status(500).json({ error: 'Failed to upvote post' });
  }
};

// Create reply
export const createReply = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = await prisma.reply.create({
      data: {
        postId: id,
        authorId: req.user.userId,
        content,
        upvotes: 0,
        isAcceptedAnswer: false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json(reply);
  } catch (error: any) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
};

// Upvote reply
export const upvoteReply = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id, replyId } = req.params;

    const reply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    res.json(reply);
  } catch (error: any) {
    console.error('Upvote reply error:', error);
    res.status(500).json({ error: 'Failed to upvote reply' });
  }
};

