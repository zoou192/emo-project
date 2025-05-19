import axios from 'axios';

const AI_API_URL = 'https://aigc.sankuai.com/v1/openai/native/chat/completions';
const APP_ID = '21914512440130904097';

export async function callAIModel(audioUrl, text) {
    try {
        const response = await axios({
            method: 'post',
            url: AI_API_URL,
            headers: {
                'Authorization': `Bearer ${APP_ID}`,
                'Content-Type': 'application/json'
            },
            data: {
                messages: [
                    {
                        content: [
                            {
                                audio_url: {
                                    url: audioUrl
                                },
                                type: 'audio_url'
                            },
                            {
                                type: 'text',
                                text: text
                            }
                        ],
                        role: 'user'
                    }
                ],
                model: 'Qwen2-Audio'
            }
        });

        return response.data;
    } catch (error) {
        console.error('调用 AI 模型时发生错误:', error);
        throw error;
    }
} 