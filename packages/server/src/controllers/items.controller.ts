import { Request, Response } from 'express';
import { itemsService } from '../services/items.service';
import type { CreateItemDto, UpdateItemDto } from '@friend-gifting/shared';

export const itemsController = {
  async getFeed(req: Request, res: Response) {
    const userId = req.user!.id;
    const items = await itemsService.getFeed(userId);
    res.json(items);
  },

  async getMyItems(req: Request, res: Response) {
    const userId = req.user!.id;
    const items = await itemsService.getMyItems(userId);
    res.json(items);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const item = await itemsService.getById(id, userId);
    res.json(item);
  },

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const data: CreateItemDto = req.body;
    const item = await itemsService.create(userId, data);
    res.status(201).json(item);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const data: UpdateItemDto = req.body;
    const item = await itemsService.update(id, userId, data);
    res.json(item);
  },

  async markAsGifted(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const item = await itemsService.markAsGifted(id, userId);
    res.json(item);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const result = await itemsService.delete(id, userId);
    res.json(result);
  },
};
