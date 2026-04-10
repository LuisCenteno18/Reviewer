# Adversarial Peer Reviewer 🎓

An AI-powered dashboard for conducting rigorous, adversarial peer reviews of academic abstracts. Get detailed feedback identifying weaknesses, suggesting improvements, and producing professional reviewer reports.

## Features

### ✨ Core Capabilities

1. **Submit Research Abstracts**
   - Title and abstract text input
   - Research field selection (Computer Science, ML/AI, Biology, Chemistry, Physics, etc.)
   - Configurable review rigor levels

2. **Adversarial Review Analysis**
   - Identifies **minimum 3 critical weaknesses** with detailed explanations
   - Suggests **4+ concrete improvements** for strengthening research
   - Provides comprehensive evaluation summary
   - Generates actionable feedback

3. **Professional Scoring**
   - Novelty (0-100)
   - Methodology (0-100)
   - Clarity (0-100)
   - Significance (0-100)
   - Overall Score with interpretation

4. **Formatted Output**
   - Executive summary
   - Detailed weakness analysis
   - Ranked improvement suggestions
   - Quantitative evaluation metrics
   - PDF export capability

### 🎯 Review Rigor Levels

- **Strict**: Highly critical evaluation, demands high standards
- **Moderate**: Balanced review identifying real issues fairly
- **Constructive**: Development-focused, supportive improvement guidance

## Project Structure

```
Reviewer/
├── index.html              # Frontend dashboard interface
├── styles.css              # Professional dark-themed styling
├── app.js                  # Frontend logic & demo mode
├── server-example.js       # Backend API server (optional)
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── .github/
│   └── workflows/
│       └── pages.yml       # GitHub Pages deployment
└── README.md               # This file
```

## Quick Start

### Option 1: Frontend Only (Demo Mode)

The system includes a **demo mode** that generates realistic adversarial reviews without a backend:

1. Open `index.html` in your browser
2. Fill in paper title and abstract
3. Select research field and review rigor
4. Click "Generate Adversarial Review"
5. Download review as PDF (optional)

**No API key or backend required!**

### Option 2: With Claude AI Integration (Full-Powered)

For real AI-generated reviews using Claude:

#### Prerequisites
- Node.js 14+
- Anthropic API key (get from https://console.anthropic.com/)

#### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. **Start backend server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

4. **Update frontend configuration:**
   In `app.js`, change:
   ```javascript
   this.useMockMode = false;  // Enable API mode
   this.backendUrl = 'http://localhost:3000/api/review';
   ```

5. **Open `index.html` in browser**
   - Frontend now calls your backend for reviews
   - Generates real Claude-powered adversarial reviews

## Deployment

### GitHub Pages (Frontend Only)

The frontend is already configured for GitHub Pages through `.github/workflows/pages.yml`:

1. Repository must be public
2. Push to `main` branch
3. GitHub Actions automatically builds and deploys
4. Live at: `https://luiscenteno18.github.io/Reviewer`

**Demo mode works without backend!**

### Backend Deployment Options

#### Heroku
```bash
heroku create your-app-name
heroku config:set ANTHROPIC_API_KEY=your-key
git push heroku main
```

#### Railway
1. Connect GitHub repository
2. Set `ANTHROPIC_API_KEY` environment variable
3. Deploy

#### Vercel (Node.js version)
```bash
vercel
```

#### AWS Lambda (with Serverless Framework)
```bash
npm install -g serverless
serverless deploy
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server-example.js"]
```

## API Reference

### POST /api/review

Generate an adversarial peer review.

**Request:**
```json
{
  "title": "Paper Title",
  "abstract": "Full paper abstract...",
  "field": "computer-science",
  "rigor": "strict"
}
```

**Field Options:**
- `computer-science`
- `machine-learning`
- `biology`
- `chemistry`
- `physics`
- `mathematics`
- `medicine`
- `psychology`
- `economics`
- `other`

**Rigor Options:**
- `strict` - Highly critical
- `moderate` - Balanced evaluation
- `constructive` - Improvement-focused

**Response:**
```json
{
  "title": "Paper Title",
  "field": "computer-science",
  "rigor": "strict",
  "timestamp": "2024-04-10T15:30:00Z",
  "weaknesses": [
    {
      "title": "Weakness Title",
      "description": "Detailed explanation",
      "impact": "Critical - Explanation"
    }
  ],
  "improvements": [
    "Concrete improvement suggestion 1",
    "Concrete improvement suggestion 2"
  ],
  "summary": "Executive summary of the review",
  "scores": {
    "novelty": 65,
    "methodology": 72,
    "clarity": 85,
    "significance": 58
  },
  "overall": 70
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Adversarial Peer Reviewer API"
}
```

## Features & Capabilities

### Smart Analysis
- **Contextual Weaknesses**: Identifies field-specific issues
- **Rigor Adaptation**: Review intensity adjusts to selected level
- **Multi-Dimensional Scoring**: Evaluates novelty, methodology, clarity, significance
- **Actionable Feedback**: Each suggestion is concrete and implementable

### User Experience
- Clean, professional interface
- Real-time analysis (demo mode instantaneous)
- PDF export with full formatting
- Responsive design (desktop, tablet, mobile)
- Dark theme optimized for reading

### Technical Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Node.js + Express (optional)
- **AI**: Claude API via Anthropic SDK
- **Deployment**: GitHub Pages + Optional Node Backend
- **PDF Export**: html2pdf.js library

## Configuration

### Environment Variables

Create `.env` file:
```env
# Required for Claude integration
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional
PORT=3000
NODE_ENV=production
```

### Frontend Demo Mode

Toggle in `app.js`:
```javascript
this.useMockMode = true;  // Demo (mock reviews)
this.useMockMode = false; // Production (Claude API)
```

## Usage Examples

### Academic Paper Abstract
```
Title: Deep Neural Networks for Medical Image Segmentation

Abstract: We propose a novel approach combining attention mechanisms 
with transformer architectures for improved medical image segmentation...
```

### Research Manuscript Summary
```
Title: Quantum Computing Applications in Drug Discovery

Abstract: This work explores the application of variational quantum 
algorithms to molecular docking problems...
```

### Project Proposal
```
Title: Sustainable Energy Storage Systems

Abstract: We investigate novel battery chemistries that offer improved...
```

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (responsive)

## Performance

- **Frontend Load Time**: < 2 seconds
- **Demo Review Generation**: 2 seconds (simulated)
- **API Review Generation**: 5-15 seconds (depends on Claude)
- **Memory Usage**: ~20 MB
- **PDF Export**: 1-2 seconds

## Troubleshooting

### Reviews Not Generating
- **Demo Mode**: Check browser console (F12) for errors
- **API Mode**: Verify `ANTHROPIC_API_KEY` is set
- **Connection**: Test backend with `GET /api/health`

### PDF Export Not Working
- Check browser console for html2pdf errors
- Ensure pop-ups are not blocked
- Try different browser

### Backend Connection Issues
- Verify backend URL in `app.js`
- Check CORS settings
- Ensure backend is running (`npm start`)
- Test with curl: `curl http://localhost:3000/api/health`

## Future Enhancements

- [ ] Real-time collaborative reviews
- [ ] Review history and tracking
- [ ] Comparison with previous paper versions
- [ ] Multi-language support
- [ ] LaTeX/BibTeX parsing
- [ ] Integration with arXiv/IEEE Xplore
- [ ] Reviewer identity anonymization
- [ ] Review sharing and publishing
- [ ] Metrics dashboard
- [ ] Reviewer reputation system

## Security Notes

- **Frontend (Demo Mode)**: No sensitive data handled
- **Backend with API Key**: Never expose API keys in frontend
- **Deployment**: Use environment variables for secrets
- **CORS**: Configure appropriately for your domain
- **User Data**: Reviews are not stored (stateless design)

## Contributing

Contributions welcome! Areas for enhancement:
- Additional research fields
- Enhanced UI/UX
- Backend optimizations
- Multilingual support
- Additional metrics

## License

MIT License - Free for educational and research use

## References

- [Claude AI Documentation](https://docs.anthropic.com/)
- [Peer Review Best Practices](https://www.library.ucsb.edu/sites/default/files/bestpractices.html)
- [Academic Writing Standards](https://www.nature.com/articles/d41586-019-02953-2)
- [Research Ethics Guidelines](https://www.icmje.org/)

## Support

- 📧 Email: your-email@example.com
- 🐛 Issues: Create GitHub issue
- 💬 Discussions: GitHub discussions

---

**Current Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: ✅ Production Ready (Demo Mode)  
**Backend Integration**: Optional (Claude API ready)
