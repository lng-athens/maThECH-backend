const axios = require('axios');
const Bottleneck = require('bottleneck');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000,
});

async function generateQuestionnaire(req, res) {
    try {
        const prompt = req.body.prompt;
        const response = await limiter.schedule(() => openaiChat(prompt));

        const quizData = processOpenAIResponse(response);

        res.json({ quizData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function openaiChat(prompt) {
    const url = "https://api.openai.com/v1/chat/completions";
    const data = {
        model: 'gpt-3.5-turbo-1106',
        messages: [
            { role: "system", content: 'You are a helpful assistant' },
            { role: "user", content: prompt }
        ],
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
        });

        return response.data;
    }
    catch (error) {
        if (error.respose && error.response.status === 429) {
            console.log('Rate limit exceeded. Retry after a delay...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return openaiChat(prompt);
        }

        throw error;
    }
};

function processOpenAIResponse(response) {
    const quizData = response.choices[0].message.content;

    return quizData;
}

module.exports = { generateQuestionnaire };