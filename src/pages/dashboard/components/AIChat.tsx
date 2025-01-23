import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export function AIChat() {
  const [message, setMessage] = useState('');

  const messages = [
    { role: 'assistant', content: 'Hello! I\'m your AI nutrition assistant. How can I help you today?' },
    { role: 'user', content: 'What are some healthy breakfast ideas?' },
    { role: 'assistant', content: 'Here are some nutritious breakfast options:\n\n1. Oatmeal with berries and nuts\n2. Greek yogurt parfait\n3. Whole grain toast with avocado\n4. Smoothie bowl with fruits and seeds' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-12rem)] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">AI Health Assistant</h3>
          <p className="text-gray-600">Get personalized nutrition advice and meal recommendations</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="bg-green-600 text-white p-2 rounded-lg">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}