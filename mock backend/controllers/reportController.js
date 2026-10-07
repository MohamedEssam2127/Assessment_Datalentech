// In-memory store for reports
const reports = [];

// Set to track idempotency keys
//   i know need to apply TTL but it is mock backend :)
const processedKeys = new Set();

// Map to track in-flight requests (concurrency lock for identical keys)
const inFlightRequests = new Map();


export const createReport = async (req, res) => {
  const idempotencyKey = req.headers["x-idempotency-key"];
  const reportData = req.body;

  console.log("idempotencyKey", idempotencyKey);
  // Validate idempotency key
  if (!idempotencyKey) {
    return res.status(400).json({ error: "Missing X-Idempotency-Key header" });
  }

  // 1. If this key was already processed, return existing report
  if (processedKeys.has(idempotencyKey)) {
    const existingReport = reports.find(
      (r) => r.idempotencyKey === idempotencyKey
    );
    return res.status(200).json({
      message: "Report already submitted",
      report: existingReport,
    });
  }

  // 2. If a request with this key is ALREADY in-flight, await the same operation
  if (inFlightRequests.has(idempotencyKey)) {
    try {
      const { report } = await inFlightRequests.get(idempotencyKey);
      return res.status(200).json({
        message: "Report already submitted",
        report,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Server error: failed to save report" });
    }
  }

  // 3. First request: register operation in-flight
  const saveOperation = (async () => {
    // Random delay between 0–3 seconds
    const delay = Math.random() * 3000+1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Decide failure mode (~30% total failure rate)
    const roll = Math.random();

    if (roll < 0.15) {
      // ~15%: Fail BEFORE saving — nothing is persisted
      throw new Error("Server error: failed to save report");
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

    return { report, roll };
  })();

  inFlightRequests.set(idempotencyKey, saveOperation);

  try {
    const { report, roll } = await saveOperation;

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
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error: failed to save report" });
  } finally {
    inFlightRequests.delete(idempotencyKey);
  }
};


export const getReports = (req, res) => {
  return res.status(200).json({
    count: reports.length,
    reports,
  });
};
