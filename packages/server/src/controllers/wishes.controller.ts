import { Request, Response } from 'express';
import { wishesService } from '../services/wishes.service';
import type { CreateWishDto, UpdateWishDto } from '@friend-gifting/shared';

export const wishesController = {
  async getFeed(req: Request, res: Response) {
    const userId = req.user!.userId;
    const wishes = await wishesService.getFeed(userId);
    res.json(wishes);
  },

  async getMyWishes(req: Request, res: Response) {
    const userId = req.user!.userId;
    const wishes = await wishesService.getMyWishes(userId);
    res.json(wishes);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const wish = await wishesService.getById(id, userId);
    res.json(wish);
  },

  async create(req: Request, res: Response) {
    const userId = req.user!.userId;
    const data: CreateWishDto = req.body;
    const wish = await wishesService.create(userId, data);
    res.status(201).json(wish);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const data: UpdateWishDto = req.body;
    const wish = await wishesService.update(id, userId, data);
    res.json(wish);
  },

  async markAsFulfilled(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const wish = await wishesService.markAsFulfilled(id, userId);
    res.json(wish);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;
    const result = await wishesService.delete(id, userId);
    res.json(result);
  },
};
