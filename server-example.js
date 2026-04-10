#!/usr/bin/env node
/**
 * Adversarial Peer Reviewer Backend
 * 
 * This is an example Node.js/Express server that integrates with Claude AI
 * to generate adversarial peer reviews.
 * 
 * Setup:
 * 1. npm install express cors dotenv @anthropic-ai/sdk
 * 2. Create .env file with: ANTHROPIC_API_KEY=your_key_here
 * 3. node server.js
 * 4. Update frontend app.js to use http://localhost:3000/api/review
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Optional: Anthropic SDK for Claude API
let Anthropic;
try {
    Anthropic = require('@anthropic-ai/sdk');
} catch (e) {
    console.log('Note: @anthropic-ai/sdk not installed. Install with: npm install @anthropic-ai/sdk');
}

const PORT = process.env.PORT || 3000;

// Main review endpoint
app.post('/api/review', async (req, res) => {
    try {
        const { title, abstract, field, rigor } = req.body;

        if (!title || !abstract || !field) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rigor level
        if (!['strict', 'moderate', 'constructive'].includes(rigor)) {
            return res.status(400).json({ error: 'Invalid rigor level' });
        }

        // Generate review using Claude
        const review = await generateAdversarialReview(title, abstract, field, rigor);
        
        res.json(review);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate review',
            message: error.message 
        });
    }
});

/**
 * Generate adversarial peer review using Claude AI
 */
async function generateAdversarialReview(title, abstract, field, rigor) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not set in environment variables');
    }

    const client = new Anthropic();

    const rigorInstructions = {
        'strict': 'Provide a highly critical review, identifying significant weaknesses and fundamental flaws. Be rigorous and demanding.',
        'moderate': 'Provide a balanced review that identifies real weaknesses while also acknowledging strengths. Be fair but thorough.',
        'constructive': 'Provide a constructive review focused on helping the authors improve their work. Be supportive while still identifying areas for enhancement.'
    };

    const systemPrompt = `You are an expert academic peer reviewer with deep knowledge in ${field}. 
Your task is to conduct a rigorous adversarial review of research abstracts.

${rigorInstructions[rigor]}

Provide your review in the following JSON format:
{
  "weaknesses": [
    {"title": "string", "description": "string", "impact": "string"},
    ...
  ],
  "improvements": ["string", ...],
  "summary": "string",
  "scores": {
    "novelty": number (0-100),
    "methodology": number (0-100),
    "clarity": number (0-100),
    "significance": number (0-100)
  },
  "overall": number (0-100)
}

Requirements:
- Identify at least 3 major weaknesses
- At least 4 concrete improvement suggestions
- Be specific and actionable in your feedback
- Scores should reflect the rigor level and actual content quality
- Overall score should be the average of the 4 component scores`;

    const userPrompt = `Please review this research abstract from the ${field} field:

Title: ${title}

Abstract:
${abstract}

Provide a rigorous adversarial review in JSON format.`;

    const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
            {
                role: 'user',
                content: userPrompt
            }
        ]
    });

    // Extract JSON from response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
        throw new Error('Failed to parse review response');
    }

    const review = JSON.parse(jsonMatch[0]);

    return {
        title,
        field,
        rigor,
        timestamp: new Date().toISOString(),
        ...review
    };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Adversarial Peer Reviewer API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎓 Adversarial Peer Reviewer Backend`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📝 API endpoint: POST http://localhost:${PORT}/api/review`);
    console.log(`💡 Health check: GET http://localhost:${PORT}/api/health\n`);
    
    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  Warning: ANTHROPIC_API_KEY not set!');
        console.warn('    Create .env file with your API key to enable Claude integration.\n');
    }
});

module.exports = app;
