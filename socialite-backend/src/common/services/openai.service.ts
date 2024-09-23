import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAiService {
    private readonly apiKey = process.env.OPENAI_API_KEY; // Ensure you have this in your .env file
    private readonly apiUrl = 'https://api.openai.com/v1/chat/completions'; // For GPT-4 or GPT-3.5 turbo

    async generateUsername(name: string, email: string): Promise<string> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: `Generate 10 usernames using name: ${name} and email: ${email}. Make sure is should be creative username and only give resonse as comma separated string` }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // Extract the response from OpenAI API
            let message = response.data.choices[0].message.content;

            if (!message) {
                console.warn('Received an empty response from OpenAI');
                throw new Error('No usernames generated. Try again.');
            }

            // Ensure the message is a comma-separated string
            message = message.split(',').map(item => item.trim()).join(',');
            return message;
        } catch (error) {
            console.error('Error with OpenAI request:', error);
            throw new Error('Failed to generateUsername from OpenAI');
        }
    }
}
