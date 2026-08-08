// In-memory cooldown tracker: Map<uid, timestamp>
const scanCache = new Map();

function checkCooldown(uid, cooldownSeconds = 30) {
  const normalizedUid = uid.trim().toUpperCase();
  const lastScan = scanCache.get(normalizedUid);
  const now = Date.now();

  if (lastScan && now - lastScan < cooldownSeconds * 1000) {
    const remainingSeconds = Math.ceil((cooldownSeconds * 1000 - (now - lastScan)) / 1000);
    return {
      isAllowed: false,
      remainingSeconds
    };
  }

  // Record this scan
  scanCache.set(normalizedUid, now);

  // Clean old entries periodically (every 5 minutes)
  if (scanCache.size > 1000) {
    for (const [key, time] of scanCache.entries()) {
      if (now - time > cooldownSeconds * 1000 * 5) {
        scanCache.delete(key);
      }
    }
  }

  return {
    isAllowed: true,
    remainingSeconds: 0
  };
}

module.exports = {
  checkCooldown,
  scanCache
};
