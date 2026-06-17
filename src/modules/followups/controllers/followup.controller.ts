import { Request, Response, NextFunction } from "express";
import { FollowupService } from "../services/followup.service";

export class FollowupController {
  private followupService: FollowupService;

  constructor() {
    this.followupService = new FollowupService();
  }

  public createFollowup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const followup = await this.followupService.createFollowup(req.body, user);
      res.status(201).json({
        success: true,
        data: followup
      });
    } catch (error) {
      next(error);
    }
  };

  public getFollowups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const filters: any = {};
      if (req.query.start) filters.start = req.query.start as string;
      if (req.query.end) filters.end = req.query.end as string;
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.lead_id) filters.lead_id = req.query.lead_id as string;

      const followups = await this.followupService.getFollowups(filters, user);
      res.status(200).json({
        success: true,
        data: followups
      });
    } catch (error) {
      next(error);
    }
  };

  public updateFollowupStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { status } = req.body;
      const followup = await this.followupService.updateFollowupStatus(id, status, user);
      res.status(200).json({
        success: true,
        data: followup
      });
    } catch (error) {
      next(error);
    }
  };
}
