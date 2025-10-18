import { Request, Response } from 'express';
import { friendsService } from '../services/friends.service';

export const friendsController = {
  async searchUsers(req: Request, res: Response) {
    const { q } = req.query;
    const userId = req.user!.userId;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query parameter required' });
    }

    const users = await friendsService.searchUsers(q, userId);
    res.json(users);
  },

  async getFriends(req: Request, res: Response) {
    const userId = req.user!.userId;
    const friends = await friendsService.getFriends(userId);
    res.json(friends);
  },

  async getPendingRequests(req: Request, res: Response) {
    const userId = req.user!.userId;
    const requests = await friendsService.getPendingRequests(userId);
    res.json(requests);
  },

  async getSentRequests(req: Request, res: Response) {
    const userId = req.user!.userId;
    const requests = await friendsService.getSentRequests(userId);
    res.json(requests);
  },

  async sendRequest(req: Request, res: Response) {
    const requesterId = req.user!.userId;
    const { addresseeId } = req.body;

    const friendship = await friendsService.sendRequest(requesterId, addresseeId);
    res.status(201).json(friendship);
  },

  async acceptRequest(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;

    const friendship = await friendsService.acceptRequest(id, userId);
    res.json(friendship);
  },

  async declineRequest(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await friendsService.declineRequest(id, userId);
    res.json(result);
  },

  async removeFriend(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await friendsService.removeFriend(id, userId);
    res.json(result);
  },
};
