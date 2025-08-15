
# Talkinggod-AI- HanZi Bilingual Prompt Optimizer
"Efficiency through linguistic diversity. A cross-linguistic toolkit for optimizing LLM prompts by leveraging Chinese (ZH) token efficiency and Navajo-inspired linguistic principles. Reduce API costs by ~30% while maintaining precision. Open-source under AGPLv3, with commercial licensing available for enterprises."
# Bilingual Prompt Optimizer 🐎🔠

**Talkinggod AI** | *"Efficiency through linguistic diversity"*

[![AGPLv3 License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE-AGPL)

## Features ✨
- **Token Optimization**: ~30% savings via ZH/EN hybrid prompts.
- **Commercial Licensing**: Contact us for enterprise use.
## License 📜  
This project is dual-licensed:  
- **GPLv3** for open-source/non-commercial use.  
- **Commercial licenses** available for proprietary integrations (contact contact@talkinggod.ai). 


Advanced Optimization Panel: A new UI section that allows you to:
Select a target LLM model (e.g., Gemini, Claude, DeepSeek) to apply model-specific syntax optimizations.
Enable Anthropic-style XML tagging to structure prompts for better clarity and performance.
Choose a reasoning strategy like Tree-of-Thoughts or ReWOO to guide the model's problem-solving process.
Sophisticated Prompt Construction: The backend logic now chains your selections together, wrapping the original prompt in layers of targeted instructions (XML tags, reasoning modules, model-specific prefixes) before sending it to the Gemini API for optimization.
Performance Metrics: The app now provides deeper insights beyond just token counts. After each optimization, a new panel displays:
Latency: The time taken for the optimization request to complete.
Semantic Fidelity & Instruction Adherence: Mocked scores that simulate how well the optimized prompt retains the original's meaning and follows instructions, demonstrating a more holistic approach to quality analysis.
Seamless Integration: All new components are built to match the existing visual theme, ensuring a consistent and professional user experience.


**Copyright © 2024 Talkinggod AI. All rights reserved.**


View your app in AI Studio: https://ai.studio/apps/drive/1J5YVAbAbXYUkPPICboDxT0YEKpWVAcI7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
