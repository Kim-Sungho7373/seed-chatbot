// 필요한 라이브러리들을 불러옵니다.
const express = require('express');
const OpenAI = require('openai');
require('dotenv').config(); // .env 파일의 환경 변수를 로드합니다.

// Express 앱과 OpenAI 클라이언트를 초기화합니다.
const app = express();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // 환경 변수에서 API 키를 가져옵니다.
});

// 프론트엔드에서 보내는 JSON 형식의 요청을 처리할 수 있게 설정합니다.
app.use(express.json());
// 현재 폴더의 파일들(seed.html 등)을 웹에서 접근할 수 있도록 설정합니다.
app.use(express.static(__dirname));

// '/api/chat' 주소로 POST 요청이 왔을 때 처리할 로직입니다.
app.post('/api/chat', async (req, res) => {
    try {
        // 프론트에서 보낸 메시지를 받습니다.
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: '메시지가 없습니다.' });
        }

        // OpenAI API를 호출합니다.
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // 또는 "gpt-3.5-turbo" 등 사용 가능한 모델
            messages: [
                // AI의 역할과 정체성을 설정합니다. (HTML의 컨셉에 맞게)
                { "role": "system", "content": "당신은 '토종종자 전문가 잇-다'라는 이름의 친절한 AI 어시스턴트입니다. 토종 종자, 농업, 재배에 대한 전문적인 지식을 가지고 있으며, 사용자의 모든 질문에 상세하고 정확하게 답변합니다." },
                // 사용자의 메시지를 전달합니다.
                { "role": "user", "content": userMessage }
            ],
        });

        // AI의 답변을 추출하여 프론트엔드로 보냅니다.
        const aiResponse = completion.choices[0].message.content;
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        res.status(500).json({ error: 'AI 응답을 생성하는 데 실패했습니다.' });
    }
});

const port = process.env.PORT || 3000;
// '0.0.0.0'을 추가하여 모든 IP 주소에서 들어오는 연결을 허용합니다.
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});