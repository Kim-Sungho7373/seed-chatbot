require('dotenv').config(); // 추가
const express = require('express');
const openai = require('openai');
const path = require('path'); // 추가

// Express 앱과 OpenAI 클라이언트를 초기화합니다.
const app = express();
const openaiClient = new openai({
    apiKey: process.env.OPENAI_API_KEY, // 환경 변수에서 API 키를 가져옵니다.
});

// 프론트엔드에서 보내는 JSON 형식의 요청을 처리할 수 있게 설정합니다.
app.use(express.json());
// 현재 폴더의 파일들(index.html 등)을 웹에서 접근할 수 있도록 설정합니다.
app.use(express.static(path.join(__dirname, '/')));

// '/api/chat' 주소로 POST 요청이 오면 챗 서비스를 실행합니다.
app.post('/api/chat', async (req, res) => {
    try {
        // 프론트엔드에서 보낸 메시지를 받습니다.
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: '메시지가 없습니다.' });
        }

        // OpenAI API로 요청합니다.
        const completion = await openaiClient.chat.completions.create({
            model: "gpt-4", // 또는 "gpt-3.5-turbo"를 사용 가능한 모델
            messages: [
                // AI의 역할과 성격데를 설정합니다. (HTML과 CSS에 관한 내용)
                { 
                    "role": "system", 
                    "content": "토종종자 전문가 '잇-다'입니다. 한국의 토종 종자에 대해서 전문적인 지식을 가지고 상세한 답변을 내려주어야합니다. 사용자의 모든 질문에 상세하고 정확하게 답변합니다."
                },
                // 사용자의 메시지를 전달합니다.
                { "role": "user", "content": userMessage }
            ]
        });

        // AI의 답변을 추출하여 프론트엔드로 보냅니다.
        const aiResponse = completion.choices[0].message.content;
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        res.status(500).json({ error: 'AI 응답을 생성하는 데 실패했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});