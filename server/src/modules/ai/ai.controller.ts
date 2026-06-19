import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { queueLeadAnalysis } from '../../queues/scoring.queue';
import { Lead } from '../../models/lead.model';
import { Types } from 'mongoose';

const aiService = new AIService();

export class AIController {
  /**
   * Endpoint: POST /api/v1/ai/leads/:id/analyze
   * Enqueues a background job for scoring and analyzing a lead.
   */
  public async analyzeLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Validate ObjectId format
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          error: `Invalid Lead ID format: ${id}`,
        });
        return;
      }

      // Check if Lead exists in MongoDB
      const leadExists = await Lead.exists({ _id: new Types.ObjectId(id) });
      if (!leadExists) {
        res.status(404).json({
          success: false,
          error: `Lead with ID ${id} not found.`,
        });
        return;
      }

      // Queue the analysis job
      await queueLeadAnalysis(id);

      res.status(202).json({
        success: true,
        message: 'Analysis queued',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint: POST /api/v1/ai/generate-email
   * Generates a personalized email template using Gemini (with fallback).
   */
  public async generateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { leadName, company, purpose } = req.body;

      // Input validation
      if (!leadName || !company || !purpose) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: leadName, company, and purpose are all required.',
        });
        return;
      }

      // Generate email draft
      const emailDraft = await aiService.generateEmail({
        leadName,
        company,
        purpose,
      });

      res.status(200).json(emailDraft);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint: POST /api/v1/ai/seed-test-data
   * Seeds the database with high, medium, and low mock data for fallback rule testing.
   */
  public async seedTestData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Dynamic imports to prevent circular dependencies
      const { Activity } = require('../../models/activity.model');
      const { FollowUp } = require('../../models/followup.model');

      // Clear existing seed leads
      await Lead.deleteMany({ email: /@postman-test\.com/ });

      // 1. Seed High Lead
      const highLead = await Lead.create({
        name: 'High Probability Lead',
        email: 'high.lead@postman-test.com',
        stage: 'proposal',
        phone: '123-456-7890',
        source: 'pricing_page',
      });
      await Activity.insertMany([
        { leadId: highLead._id, type: 'Email Open', notes: 'Lead opened pricing proposal.' },
        { leadId: highLead._id, type: 'Phone Call', notes: 'Discussed terms. Highly interested.' },
        { leadId: highLead._id, type: 'Product Demo', notes: 'Completed full walkthrough.' },
        { leadId: highLead._id, type: 'Website Visit', notes: 'Spent 20 minutes on features.' },
      ]);
      await FollowUp.insertMany([
        { lead_id: highLead._id, date: new Date(Date.now() + 100000), status: 'PENDING' },
        { lead_id: highLead._id, date: new Date(Date.now() + 200000), status: 'PENDING' },
        { lead_id: highLead._id, date: new Date(Date.now() - 100000), status: 'COMPLETED' },
      ]);

      // 2. Seed Medium Lead
      const mediumLead = await Lead.create({
        name: 'Medium Probability Lead',
        email: 'medium.lead@postman-test.com',
        stage: 'qualified',
        phone: '234-567-8901',
        source: 'demo_request',
      });
      await Activity.insertMany([
        { leadId: mediumLead._id, type: 'Email Click', notes: 'Clicked link.' },
        { leadId: mediumLead._id, type: 'Initial Call', notes: 'Lead requested demo.' },
        { leadId: mediumLead._id, type: 'Meeting Scheduled', notes: 'Set demo date.' },
        { leadId: mediumLead._id, type: 'Website Visit', notes: 'Features page.' },
      ]);
      await FollowUp.insertMany([
        { lead_id: mediumLead._id, date: new Date(Date.now() + 500000), status: 'PENDING' },
      ]);

      // 3. Seed Low Lead
      const lowLead = await Lead.create({
        name: 'Low Probability Lead',
        email: 'low.lead@postman-test.com',
        stage: 'new_lead',
        phone: '345-678-9012',
        source: 'cold_outreach',
      });
      await Activity.insertMany([
        { leadId: lowLead._id, type: 'System Import', notes: 'Lead imported from list.' },
      ]);
      await FollowUp.insertMany([
        { lead_id: lowLead._id, date: new Date(Date.now() + 1000000), status: 'PENDING' },
      ]);

      res.status(201).json({
        success: true,
        message: 'Postman test cases seeded successfully.',
        data: {
          highProbabilityLead: {
            id: highLead._id,
            name: highLead.name,
            expectedScore: 80,
            expectedClass: 'High',
            urlToAnalyze: `http://localhost:5000/api/v1/ai/leads/${highLead._id}/analyze`
          },
          mediumProbabilityLead: {
            id: mediumLead._id,
            name: mediumLead.name,
            expectedScore: 70,
            expectedClass: 'Medium',
            urlToAnalyze: `http://localhost:5000/api/v1/ai/leads/${mediumLead._id}/analyze`
          },
          lowProbabilityLead: {
            id: lowLead._id,
            name: lowLead.name,
            expectedScore: 50,
            expectedClass: 'Low',
            urlToAnalyze: `http://localhost:5000/api/v1/ai/leads/${lowLead._id}/analyze`
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
