import { Request, Response, NextFunction } from 'express';
import { getMockLeads, findLeadById } from '../models/lead.model';
import { checkResourceAccess } from '../middlewares/auth.middleware';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';
import logger from '../utils/logger';

/**
 * Controller to fetch scoped leads list
 */
export const getLeadsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError('Authentication context missing.', 401, 'UNAUTHORIZED');
    }

    logger.info(`Fetch leads requested by ${user.email} (Role: [${user.role}])`);

    const allLeads = getMockLeads();
    let scopedLeads = allLeads;

    // Apply scoping query rules
    if (user.role === 'manager') {
      scopedLeads = allLeads.filter((lead) => lead.teamId === user.teamId);
      logger.info(`Manager scoping applied: Filtered team [${user.teamId}]. Total: ${scopedLeads.length} leads.`);
    } else if (user.role === 'executive') {
      scopedLeads = allLeads.filter((lead) => lead.assignedTo === user.userId);
      logger.info(`Executive scoping applied: Filtered owner ID [${user.userId}]. Total: ${scopedLeads.length} leads.`);
    } else {
      logger.info(`Admin access. Fetching all global leads. Total: ${allLeads.length} leads.`);
    }

    sendSuccess(res, scopedLeads);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single lead with scope permission checks
 */
export const getLeadByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      throw new AppError('Authentication context missing.', 401, 'UNAUTHORIZED');
    }

    logger.info(`Query lead details: ${id} requested by ${user.email}`);

    const lead = await findLeadById(id);
    if (!lead) {
      logger.warn(`Lead lookup failed: ID ${id} not found.`);
      throw new AppError(`Lead with ID ${id} not found.`, 404, 'LEAD_NOT_FOUND');
    }

    // Run team-scoping access checker
    checkResourceAccess(req, lead.assignedTo, lead.teamId);

    logger.info(`Access granted: Lead ${id} details returned to ${user.email}`);

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};
