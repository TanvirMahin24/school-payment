const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "API key is required. Please provide it in the 'x-api-key' header or 'Authorization' header as 'Bearer <key>'",
    });
  }

  const validApiKey = process.env.EXTERNAL_API_KEY;

  if (!validApiKey) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error: API key not configured",
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};

module.exports = apiKeyAuth;

