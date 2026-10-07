// In-memory store for reports
const reports = [];

// Set to track idempotency keys
//   i know need to apply TTL but it is mock backend :)
const processedKeys = new Set();


export const createReport = async (req, res) => {
  const idempotencyKey = req.headers["x-idempotency-key"];
  const reportData = req.body;

  // Validate idempotency key
  if (!idempotencyKey) {
    return res.status(400).json({ error: "Missing X-Idempotency-Key header" });
  }

  // If this key was already processed, return success (idempotent)
  if (processedKeys.has(idempotencyKey)) {
    const existingReport = reports.find(
      (r) => r.idempotencyKey === idempotencyKey
    );
    return res.status(200).json({
      message: "Report already submitted",
      report: existingReport,
    });
  }

  // Random delay between 0–3 seconds
  const delay = Math.random() * 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Decide failure mode (~30% total failure rate)
  const roll = Math.random();

  if (roll < 0.15) {
    // ~15%: Fail BEFORE saving — nothing is persisted
    return res.status(500).json({ error: "Server error: failed to save report" });
  }

  // Save the report
  const report = {
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    idempotencyKey,
    ...reportData,
    savedAt: new Date().toISOString(),
  };

  reports.push(report);
  processedKeys.add(idempotencyKey);

  if (roll < 0.3) {
    // ~15%: Fail AFTER saving 
    // This simulates a network timeout after the server already saved
    return res.status(500).json({ error: "Server error: response failed" });
  }

  // ~70%: Success
  return res.status(201).json({
    message: "Report saved successfully",
    report,
  });
};


export const getReports = (req, res) => {
  return res.status(200).json({
    count: reports.length,
    reports,
  });
};
