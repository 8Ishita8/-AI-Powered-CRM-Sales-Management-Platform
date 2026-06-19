import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the server/.env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { connectDatabase, disconnectDatabase } from '../config/db';
import { Lead } from '../models/lead.model';
import { Activity } from '../models/activity.model';
import { FollowUp } from '../models/followup.model';
import { buildLeadContext } from '../modules/ai/context-builder';
import { AIService } from '../modules/ai/ai.service';

async function runVerification() {
  console.log('====================================================');
  console.log('       CRM AI ENGINE VERIFICATION SCRIPT            ');
  console.log('====================================================');

  // 1. Database Connection
  await connectDatabase();

  try {
    // 2. Clear previous verification data
    console.log('\n[Verify] Cleaning up previous verification test data...');
    await Lead.deleteMany({ email: /@verification-test\.com/ });
    
    // 3. Seed Mock Lead
    console.log('[Verify] Seeding mock Lead...');
    const mockLead = await Lead.create({
      name: 'Jane Doe',
      email: 'jane.doe@verification-test.com',
      phone: '123-456-7890',
      source: 'pricing_page',
      stage: 'new_lead',
    });
    console.log(`[Verify] Seeding successful. Lead ID: ${mockLead.id}`);

    // 4. Seed Mock Activities (4 activities)
    console.log('[Verify] Seeding 4 mock Activities for Lead...');
    const activitiesData = [
      { leadId: mockLead._id, type: 'Email Sent', notes: 'Initial outreach introducing CRM features.' },
      { leadId: mockLead._id, type: 'Phone Call', notes: 'Had a quick chat. Lead interested in product demo.' },
      { leadId: mockLead._id, type: 'Meeting Scheduled', notes: 'Scheduled demo call for next Tuesday.' },
      { leadId: mockLead._id, type: 'Demo Completed', notes: 'Presented product architecture and dashboard.' },
    ];
    await Activity.insertMany(activitiesData);

    // 5. Seed Mock Follow-ups (3 followups)
    console.log('[Verify] Seeding 3 mock FollowUps for Lead...');
    const followupsData = [
      { lead_id: mockLead._id, date: new Date(Date.now() + 24 * 60 * 60 * 1000), status: 'PENDING' },
      { lead_id: mockLead._id, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'PENDING' },
      { lead_id: mockLead._id, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'COMPLETED' },
    ];
    await FollowUp.insertMany(followupsData);

    // 6. Build Context
    console.log('\n[Verify] Building Lead Context...');
    const context = await buildLeadContext(mockLead.id);
    console.log(`- Lead Name: ${context.lead.name}`);
    console.log(`- Activities Loaded (expected <= 5): ${context.activities.length}`);
    console.log(`- FollowUps Loaded (expected <= 5): ${context.followups.length}`);

    if (context.activities.length !== 4 || context.followups.length !== 3) {
      throw new Error('Verification Error: Context Builder did not retrieve correct record count.');
    }
    console.log('[Verify] Context Builder test passed.');

    // 7. Run AI Lead Scoring Service
    const aiService = new AIService();
    
    console.log('\n[Verify] Running Lead Analysis service...');
    const analysisResult = await aiService.analyzeLead(context);
    console.log('Result Output:');
    console.log(JSON.stringify(analysisResult, null, 2));

    // Assert fallback logic is triggered or Gemini ran successfully
    if (analysisResult.conversion_score === undefined || !analysisResult.probability_class) {
      throw new Error('Verification Error: Lead analysis did not produce valid scoring outputs.');
    }
    console.log('[Verify] Lead Scoring service test passed.');

    // 8. Run AI Email Generation Service
    console.log('\n[Verify] Running Follow-Up Email Generation service...');
    const emailResult = await aiService.generateEmail({
      leadName: mockLead.name,
      company: 'Verification Corp',
      purpose: 'Schedule a pricing discussion after a successful demo call',
    });
    console.log('Result Output:');
    console.log(JSON.stringify(emailResult, null, 2));

    if (!emailResult.subject || !emailResult.body_html) {
      throw new Error('Verification Error: Email generation did not return subject or HTML body.');
    }
    console.log('[Verify] Email Generation service test passed.');

    console.log('\n====================================================');
    console.log('    SUCCESS: ALL CORE WORKFLOWS VERIFIED LOCALLY    ');
    console.log('====================================================');

  } catch (error) {
    console.error('\n[Verify] VERIFICATION TEST FAILED:', error);
  } finally {
    await disconnectDatabase();
  }
}

// Execute verification
runVerification();
