// Adversarial Peer Reviewer
// AI-powered academic reviewer system

class AdversarialReviewer {
    constructor() {
        this.form = document.getElementById('reviewForm');
        this.outputContent = document.getElementById('outputContent');
        this.submitBtn = document.getElementById('submitBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.downloadBtn.addEventListener('click', () => this.downloadReview());
        
        // For demo purposes - in production, connect to your backend
        this.backendUrl = '/api/review'; // Change to your actual backend URL
        this.useMockMode = true; // Set to false when backend is ready
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const abstract = document.getElementById('abstract').value;
        const field = document.getElementById('field').value;
        const rigor = document.getElementById('rigor').value;

        if (!title.trim() || !abstract.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        // Show loading state
        this.submitBtn.disabled = true;
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoader = this.submitBtn.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        try {
            let review;
            
            if (this.useMockMode) {
                // Demo mode - generate mock review
                review = await this.generateMockReview(title, abstract, field, rigor);
            } else {
                // Production mode - call your backend
                review = await this.callBackendAPI(title, abstract, field, rigor);
            }

            this.displayReview(review, title, field, rigor);
            this.downloadBtn.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            this.outputContent.innerHTML = `
                <div style="color: #e74c3c; padding: 20px;">
                    <strong>Error generating review:</strong><br>
                    ${error.message}<br>
                    <small style="margin-top: 10px; display: block;">
                        Make sure your backend API is configured properly.
                    </small>
                </div>
            `;
        } finally {
            // Reset button state
            this.submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    async callBackendAPI(title, abstract, field, rigor) {
        const response = await fetch(this.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                abstract,
                field,
                rigor
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    async generateMockReview(title, abstract, field, rigor) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract key concepts from abstract for more relevant review
        const sentences = abstract.split('.').filter(s => s.trim().length > 0);
        const wordCount = abstract.split(/\s+/).length;

        const weaknessSets = {
            'strict': [
                {
                    title: 'Insufficient Evidence for Main Claims',
                    description: 'The abstract makes several bold assertions without providing sufficient empirical support or preliminary results. Key theoretical foundations are assumed rather than established.',
                    impact: 'Critical - Undermines credibility of the entire research program'
                },
                {
                    title: 'Lack of Clear Methodological Novelty',
                    description: 'The proposed approach appears to be a straightforward application of existing methodologies without clear innovations or improvements over prior work. The competitive advantage is unclear.',
                    impact: 'High - Raises questions about originality and contribution'
                },
                {
                    title: 'Vague Impact and Applicability',
                    description: 'While the research topic is addressed, the practical implications and real-world applicability remain poorly articulated. The scope of impact on the field is ambiguous.',
                    impact: 'High - Limits the significance and adoption potential'
                },
                {
                    title: 'Missing Related Work Discussion',
                    description: 'The abstract fails to adequately position the work within the existing literature landscape. Key prior work and competitive approaches are not referenced or compared.',
                    impact: 'High - Suggests inadequate literature review'
                }
            ],
            'moderate': [
                {
                    title: 'Limited Methodological Details',
                    description: 'While the overall approach is sound, specific methodological choices lack justification. Key algorithm parameters or data processing steps are not explained.',
                    impact: 'Moderate - Affects reproducibility and detailed evaluation'
                },
                {
                    title: 'Incomplete Evaluation Framework',
                    description: 'The abstract mentions validation but does not specify metrics, baselines, or datasets. The evaluation strategy needs clarification and strengthening.',
                    impact: 'Moderate - Important for assessing the contribution'
                },
                {
                    title: 'Generalization and Scope Concerns',
                    description: 'It is unclear how well the proposed approach generalizes beyond the specific context presented. Boundary conditions and limitations are not discussed.',
                    impact: 'Moderate - Affects the breadth of impact'
                }
            ],
            'constructive': [
                {
                    title: 'Opportunity for Broader Context',
                    description: 'The work could be strengthened by situating it within a larger research vision and explaining how it connects to open fundamental questions in the field.',
                    impact: 'Development area - Would enhance significance'
                },
                {
                    title: 'Potential for Enhanced Validation',
                    description: 'Consider adding cross-validation approaches or testing on additional datasets to strengthen the empirical support for your claims.',
                    impact: 'Enhancement opportunity - Would improve robustness'
                },
                {
                    title: 'Clearer Communication of Innovation',
                    description: 'While the technical content appears solid, better articulation of what is novel compared to existing work would strengthen the positioning.',
                    impact: 'Presentation improvement - Would increase clarity'
                }
            ]
        };

        const improvementSets = {
            'strict': [
                'Provide preliminary experimental results or key performance metrics in the abstract to substantiate core claims',
                'Explicitly state how the proposed method differs from and improves upon existing state-of-the-art approaches with specific comparisons',
                'Include a clear quantitative statement of expected impact (e.g., "improves efficiency by X%", "reduces cost by Y")',
                'Reference at least 2-3 key prior works and explain the specific gap your research addresses'
            ],
            'moderate': [
                'Add 2-3 specific details about the methodology (algorithms, frameworks, data sources) that differentiate your approach',
                'Specify evaluation metrics and at least one baseline or comparative approach that will be used',
                'Clarify the primary user/application domain and expected scale of deployment or adoption',
                'Include any preliminary results or proof-of-concept findings that validate feasibility'
            ],
            'constructive': [
                'Expand the abstract slightly to better connect individual components into a coherent research narrative',
                'Add details about novel aspects of your approach compared to most closely related work',
                'Include a statement about potential practical applications or broader research implications',
                'Consider mentioning any collaborations or resources that strengthen the research program'
            ]
        };

        const weaknessLevel = rigor === 'strict' ? 'strict' : (rigor === 'constructive' ? 'constructive' : 'moderate');
        const weaknesses = weaknessSets[weaknessLevel].slice(0, Math.random() > 0.5 ? 3 : 4);
        const improvements = improvementSets[weaknessLevel];

        // Generate scores based on rigor
        const baseScore = rigor === 'strict' ? 55 : (rigor === 'constructive' ? 75 : 65);
        const variance = (rigor === 'strict' ? 10 : 5);
        
        return {
            title: title,
            field: field,
            rigor: rigor,
            timestamp: new Date().toISOString(),
            weaknesses: weaknesses,
            improvements: improvements,
            summary: this.generateSummary(rigor, wordCount),
            scores: {
                novelty: Math.max(40, Math.min(100, baseScore + Math.random() * variance - variance/2)),
                methodology: Math.max(40, Math.min(100, baseScore + Math.random() * variance - variance/2)),
                clarity: Math.max(45, Math.min(100, baseScore + 10)),
                significance: Math.max(40, Math.min(100, baseScore + Math.random() * variance - variance/2))
            },
            overall: Math.max(40, Math.min(100, baseScore))
        };
    }

    generateSummary(rigor, wordCount) {
        const summaries = {
            'strict': `This abstract presents a research direction, but requires substantial strengthening before publication. The work needs clearer differentiation from existing approaches, stronger empirical validation, and more explicit connection to open problems in the field. Word count analysis: ${wordCount} words - ${wordCount < 150 ? 'too brief' : wordCount > 250 ? 'acceptable but could be more concise' : 'appropriate'}.`,
            'moderate': `The research direction shows promise and addresses a relevant problem. With moderate revisions to clarify methodology, strengthen evaluation strategy, and better position within theliterature, this work could make a solid contribution. Focus improvements on empirical validation and clearer articulation of novelty.`,
            'constructive': `The abstract communicates a sound research approach. To optimize impact, consider enhancing the positioning within broader research themes, adding preliminary results, and strengthening the articulation of innovation relative to similar work. The core contribution appears solid.'`
        };
        return summaries[rigor] || summaries['moderate'];
    }

    displayReview(review, title, field, rigor) {
        const now = new Date();
        const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

        let html = `
            <div class="review-header">
                <div class="review-title">Adversarial Peer Review Report</div>
                <div class="review-meta">
                    <strong>Paper:</strong> ${this.escapeHtml(title)}<br>
                    <strong>Field:</strong> ${field.replace('-', ' ').toUpperCase()}<br>
                    <strong>Review Date:</strong> ${dateStr}<br>
                    <strong>Review Type:</strong> ${rigor.charAt(0).toUpperCase() + rigor.slice(1)} Rigor Level
                </div>
            </div>

            <div class="review-section">
                <div class="review-section-title">📋 Executive Summary</div>
                <p style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 15px;">
                    ${review.summary}
                </p>
            </div>

            <div class="review-section">
                <div class="review-section-title">⚠️ Critical Weaknesses (${review.weaknesses.length})</div>
                ${review.weaknesses.map((w, idx) => `
                    <div class="weakness">
                        <div class="weakness-title">${idx + 1}. ${w.title}</div>
                        <div class="weakness-description">${w.description}</div>
                        <div class="weakness-impact">🔴 Impact: ${w.impact}</div>
                    </div>
                `).join('')}
            </div>

            <div class="review-section">
                <div class="review-section-title">✅ Recommended Improvements</div>
                ${review.improvements.map((imp, idx) => `
                    <div class="improvement">
                        <div class="improvement-title">Suggestion ${idx + 1}</div>
                        <div class="improvement-content">${imp}</div>
                    </div>
                `).join('')}
            </div>

            <div class="review-section">
                <div class="review-section-title">📊 Evaluation Scores</div>
                <div class="overall-score">
                    <div class="score-card">
                        <div class="score-label">Novelty</div>
                        <div class="score-value">${Math.round(review.scores.novelty)}/100</div>
                    </div>
                    <div class="score-card">
                        <div class="score-label">Methodology</div>
                        <div class="score-value">${Math.round(review.scores.methodology)}/100</div>
                    </div>
                    <div class="score-card">
                        <div class="score-label">Clarity</div>
                        <div class="score-value">${Math.round(review.scores.clarity)}/100</div>
                    </div>
                    <div class="score-card">
                        <div class="score-label">Significance</div>
                        <div class="score-value">${Math.round(review.scores.significance)}/100</div>
                    </div>
                </div>
                <div style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 6px; text-align: center;">
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 5px;">OVERALL SCORE</div>
                    <div style="font-size: 28px; font-weight: bold; color: ${this.getScoreColor(review.overall)};">
                        ${Math.round(review.overall)}/100
                    </div>
                </div>
            </div>

            <div class="review-section" style="border-top: 2px solid var(--border-color); padding-top: 15px; margin-top: 20px;">
                <div style="font-size: 11px; color: var(--text-secondary); text-align: center;">
                    Generated by Adversarial Peer Reviewer | AI-Powered Academic Analysis<br>
                    This review represents a rigorous adversarial evaluation to strengthen your research.
                </div>
            </div>
        `;

        this.outputContent.innerHTML = html;
        this.currentReview = { html, title, field, rigor, scores: review.scores };
    }

    getScoreColor(score) {
        if (score >= 80) return '#27ae60';
        if (score >= 70) return '#f39c12';
        if (score >= 60) return '#e67e22';
        return '#c0392b';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    downloadReview() {
        if (!this.currentReview) return;

        const element = document.createElement('div');
        element.innerHTML = this.currentReview.html;
        element.style.padding = '20px';
        element.style.backgroundColor = '#1a1a2e';
        element.style.color = '#ecf0f1';

        const opt = {
            margin: 10,
            filename: `Peer-Review-${this.currentReview.title.substring(0, 30).replace(/\s+/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdversarialReviewer();
});
