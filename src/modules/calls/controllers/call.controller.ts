import { Request, Response, NextFunction } from "express";
import { CallService } from "../services/call.service";

export class CallController {
  private callService: CallService;

  constructor() {
    this.callService = new CallService();
  }

  public logCall = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params; // lead_id
      const user = req.user!;
      const callRecord = await this.callService.logCall(id, req.body, user);
      res.status(201).json({
        success: true,
        data: callRecord
      });
    } catch (error) {
      next(error);
    }
  };
}
