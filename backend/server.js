import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import { initializeMedicationScheduler } from "./src/services/medication_scheduler.js";

const PORT = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    initializeMedicationScheduler();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exitCode = 1;
  });