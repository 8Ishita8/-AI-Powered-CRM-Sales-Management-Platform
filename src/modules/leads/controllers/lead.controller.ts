import { Request, Response, NextFunction } from "express";
import { LeadService } from "../services/lead.service";

export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  public createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const lead = await this.leadService.createLead(req.body, user);
      res.status(201).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  };

  public getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters: any = {};
      if (req.query.stage) filters.stage = req.query.stage;
      if (req.query.source) filters.source = req.query.source;
      if (req.query.assigned_to) filters.assigned_to = req.query.assigned_to;

      const result = await this.leadService.getLeads(filters, { page, limit }, user);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const details = await this.leadService.getLeadDetails(id, user);
      res.status(200).json({
        success: true,
        data: details
      });
    } catch (error) {
      next(error);
    }
  };

  public updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const lead = await this.leadService.updateLead(id, req.body, user);
      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  };

  public assignLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { assigned_to } = req.body;
      const lead = await this.leadService.assignLead(id, assigned_to, user);
      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  };
}
