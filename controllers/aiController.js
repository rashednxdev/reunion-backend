// POST /api/ai/generate  (proxies to Anthropic, keeps API key server-side)
export const generateAnnouncement = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.startsWith('sk-ant-your')) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Please add your ANTHROPIC_API_KEY to .env' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 350,
        system:
          'You are a warm professional event announcer for a Bangladesh government office reunion. Write concise enthusiastic English announcements under 80 words. No markdown.',
        messages: [
          {
            role: 'user',
            content: `Reunion: CGA Batch 2018, Office of the Controller General of Accounts. Venue: Bangladesh Shilpakala Academy, Segunbagicha, Dhaka. Date: Saturday 11 July 2026, 11 AM–7 PM.\n\nWrite an announcement about: ${prompt}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: data.error?.message || 'AI API error' });
    }

    const text = data.content?.[0]?.text || 'Could not generate. Please try again.';
    res.json({ success: true, text });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
