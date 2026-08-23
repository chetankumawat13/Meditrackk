import cron from 'node-cron';
import { runMedicationCheckJob } from './medication_monitoring_service.js';

/**
 * Schedule the medication usage check job
 * Runs daily at 2 AM (adjust timing as needed)
 */
export const initializeMedicationScheduler = () => {
    try {
        // Schedule at 2:00 AM daily
        cron.schedule('0 2 * * *', async () => {
            console.log('🔔 Scheduled medication check starting...');
            try {
                await runMedicationCheckJob();
            } catch (error) {
                console.error('❌ Scheduled medication check failed:', error.message);
                // Optionally send error notification to admin
            }
        });

        console.log('✅ Medication scheduler initialized - Runs daily at 2:00 AM');

    } catch (error) {
        console.error('Failed to initialize medication scheduler:', error.message);
    }
};

/**
 * Alternative: Run medication check weekly (e.g., Sunday at 3 AM)
 */
export const initializeWeeklyScheduler = () => {
    try {
        cron.schedule('0 3 * * 0', async () => {
            console.log('🔔 Weekly medication check starting...');
            try {
                await runMedicationCheckJob();
            } catch (error) {
                console.error('❌ Weekly medication check failed:', error.message);
            }
        });

        console.log('✅ Weekly medication scheduler initialized - Runs Sundays at 3:00 AM');

    } catch (error) {
        console.error('Failed to initialize weekly scheduler:', error.message);
    }
};

/**
 * Run immediate check (for testing or manual trigger)
 */
export const runImmediateMedicationCheck = async () => {
    console.log('🚀 Running immediate medication check...');
    try {
        const result = await runMedicationCheckJob();
        return result;
    } catch (error) {
        console.error('❌ Immediate check failed:', error.message);
        throw error;
    }
};

export default {
    initializeMedicationScheduler,
    initializeWeeklyScheduler,
    runImmediateMedicationCheck
};
