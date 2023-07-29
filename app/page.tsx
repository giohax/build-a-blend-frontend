'use client'
import Image from 'next/image'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ReadableStreamDefaultReadResult } from 'stream/web';
import IconBoxArrowInUp from './arrow';
import SubmitIcon from '@/submit-icon';



export default function Home() {
  const [input, setInput] = useState<string>("");
  const [streamedData, setStreamedData] = useState<string>("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    fetch("https://build-a-bear-backend-6c980c5e3e3e.herokuapp.com/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    }).then(res => res.json())
      .then(data => {
        const formattedText = data.response.response.split('\n').map((item: string, i: number) => <div key={i}>{item}</div>);
        setStreamedData(formattedText)
        setLoading(false)
      })
      .catch(error => console.error('Error:', error));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion.substring(1, suggestion.length - 1))
  }

  const Suggestion = () => {
    const suggestions = [
      "'I need to get rid of bacterial infections'",
      "'I feel depressed and anxious all the time'",
      "'I need to gain muscle mass and improve physical performance'",
      "'I need a natural nootropic to enhance my memory and learning'",
      "'My hair is thinning and receding'",
      "'I want to be more confident and get rid of my social anxiety'",
      "'I want to lose weight quickly'"
    ];

    return (
      <div className="mt-4">
        <h1 className="text-center">Examples</h1>
        <ul>
          {
            suggestions.map((item: string, index: number) => (
                <li key={index}
                  onClick={(e) => handleSuggestion(item)}
                  className="bg-black border rounded-lg px-4 py-3 w-full border-neutral-700 mt-2 transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer hover:bg-neutral-800">{item}<IconBoxArrowInUp className="inline text-xl ml-4" /></li>
                
            ))
          }
        </ul>
      </div>
    )
  }


  return (
    <div className="flex flex-col bg-black text-white justify-center items-center min-h-screen p-4 ">
      <form onSubmit={handleSubmit} className="max-w-xl w-full">
        <h1 className='text-center text-2xl mb-4'>Build-A-Blend</h1>
        <label>
          <div className="flex items-center justify-between bg-black border rounded-lg px-4 py-3 w-full border-neutral-700">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              className='bg-black w-full pr-2 focus:outline-none focus:ring-0'
              placeholder='Describe a symptom or a desired outcome in health or life...'
            />
            <button type='submit'>
              <SubmitIcon className="h-4 w-4" />
            </button>
            
          </div>

        </label>
        {
          !loading && streamedData.length == 0 && <Suggestion />
        }
      </form>

      {
        loading && <span className="loader"></span>
      }
      {
        streamedData.length > 0 && !loading && (
          <div className="max-w-xl max-h-96 border rounded-lg overflow-auto py-3 px-4  border-neutral-700  mt-4 leading-8">
            <div className="w-full h-full ">
              {streamedData}
            </div>
          </div>
        )
      }

    </div>
  );
}
