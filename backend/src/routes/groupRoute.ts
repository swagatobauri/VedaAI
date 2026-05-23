import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const groupRouter = express.Router();

// Get all groups
groupRouter.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.json([]);
      return;
    }
    const groups = await prisma.group.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(groups);
  } catch (error) {
    console.error('Fetch Groups Error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create a new group
groupRouter.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.status(403).json({ error: 'Guests cannot create groups' });
      return;
    }

    const { name, emails } = req.body;
    if (!name || !Array.isArray(emails)) {
      res.status(400).json({ error: 'Name and a valid emails array are required' });
      return;
    }

    const group = await prisma.group.create({
      data: {
        name,
        emails: JSON.stringify(emails),
        userId: req.user!.userId
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Create Group Error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Delete a group
groupRouter.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.status(403).json({ error: 'Guests cannot delete groups' });
      return;
    }

    const groupId = req.params.id as string;
    const group = await prisma.group.findUnique({ where: { id: groupId } });

    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    if (group.userId !== req.user!.userId) {
      res.status(403).json({ error: 'Unauthorized to delete this group' });
      return;
    }

    await prisma.group.delete({ where: { id: groupId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Group Error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});
