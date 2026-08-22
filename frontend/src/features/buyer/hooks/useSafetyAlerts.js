export function getSafetyAlerts(purchases) {
  const sorted = [...purchases].sort((a, b) => new Date(b.date) - new Date(a.date));
  const alerts = [];
  const medicineCounts = {};
  const now = new Date();

  sorted.forEach((purchase) => {
    purchase.items.forEach((item) => {
      if (!medicineCounts[item.medicineID]) {
        medicineCounts[item.medicineID] = { name: item.medicineName, count: 0, dates: [] };
      }
      medicineCounts[item.medicineID].count++;
      medicineCounts[item.medicineID].dates.push(new Date(purchase.date));
    });
  });

  Object.values(medicineCounts).forEach((med) => {
    if (med.count >= 3) {
      const firstDate = Math.min(...med.dates.map((d) => d.getTime()));
      const daysSince = (now - new Date(firstDate)) / (1000 * 60 * 60 * 24);
      if (daysSince >= 30) {
        alerts.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Repeated Medication Usage',
          description: `You have purchased ${med.name} ${med.count} times in the last ${Math.floor(
            daysSince
          )} days. Please consult a healthcare professional for a medication review.`,
        });
      }
    }
  });

  if (Object.keys(medicineCounts).length >= 3 && sorted.length > 0) {
    const recentPurchase = sorted[0];
    if ((now - new Date(recentPurchase.date)) / (1000 * 60 * 60 * 24) < 7) {
      alerts.push({
        type: 'info',
        icon: 'ℹ️',
        title: 'Multiple Medications Detected',
        description: `You are currently on ${Object.keys(medicineCounts).length} different medications. Consider consulting your doctor for a comprehensive medication review.`,
      });
    }
  }

  return alerts;
}
