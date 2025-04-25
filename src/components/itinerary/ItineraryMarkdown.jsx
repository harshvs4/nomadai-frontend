import React from 'react';
import ReactMarkdown from 'react-markdown';

const ItineraryMarkdown = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            // Style headings
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-800 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 mb-2" {...props} />,
            
            // Style paragraphs
            p: ({ node, ...props }) => <p className="text-gray-600 mb-4" {...props} />,
            
            // Style lists
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            
            // Style links
            a: ({ node, ...props }) => (
              <a 
                className="text-blue-600 hover:text-blue-800 hover:underline" 
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            
            // Style emphasis and strong
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            
            // Style blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote 
                className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-4" 
                {...props}
              />
            ),
            
            // Style code blocks
            code: ({ node, inline, ...props }) => (
              inline ? 
                <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} /> :
                <code className="block bg-gray-100 rounded p-4 text-sm font-mono mb-4 overflow-x-auto" {...props} />
            ),
            
            // Style horizontal rules
            hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ItineraryMarkdown; 