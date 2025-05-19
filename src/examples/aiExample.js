import { callAIModel } from '../services/aiService.js';

async function main() {
    try {
        const audioUrl = 'https://s3plus-bj02.sankuai.com/aigc-public-resources/1272-128104-0000.flac';
        const text = '这段语音的内容是什么';
        
        const result = await callAIModel(audioUrl, text);
        console.log('AI 响应:', result);
    } catch (error) {
        console.error('运行示例时发生错误:', error);
    }
}

main(); 