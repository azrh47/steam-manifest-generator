// Vercel Serverless Function - API endpoint
// This handles web requests, not Discord bot functionality

module.exports = async (req, res) => {
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Nerai Templates API - Discord bot runs on Render'
    });
  }
};

function handleGet(req, res) {
  res.status(200).json({
    name: 'Nerai Templates API',
    description: 'Steam manifest generator Discord bot',
    bot_status: 'Running on Render',
    message: 'This is the API endpoint. The Discord bot runs on Render platform.',
    endpoints: {
      health: 'GET /api - Health check',
      info: 'GET /api - Bot information'
    }
  });
}

function handlePost(req, res) {
  res.status(200).json({
    message: 'POST endpoint working',
    note: 'Discord bot functionality is handled on Render, not here'
  });
}
