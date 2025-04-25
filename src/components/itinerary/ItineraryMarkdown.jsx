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
            h1: ({ node, children, ...props }) => (
              <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props}>
                {children}
              </h1>
            ),
            h2: ({ node, children, ...props }) => (
              <h2 className="text-2xl font-bold text-gray-800 mb-3" {...props}>
                {children}
              </h2>
            ),
            h3: ({ node, children, ...props }) => (
              <h3 className="text-xl font-semibold text-gray-800 mb-2" {...props}>
                {children}
              </h3>
            ),
            
            // Style paragraphs
            p: ({ node, children, ...props }) => (
              <p className="text-gray-600 mb-4" {...props}>
                {children}
              </p>
            ),
            
            // Style lists
            ul: ({ node, children, ...props }) => (
              <ul className="list-disc pl-5 mb-4 text-gray-600" {...props}>
                {children}
              </ul>
            ),
            ol: ({ node, children, ...props }) => (
              <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props}>
                {children}
              </ol>
            ),
            li: ({ node, children, ...props }) => (
              <li className="mb-1" {...props}>
                {children}
              </li>
            ),
            
            // Style links
            a: ({ node, children, ...props }) => (
              <a 
                className="text-blue-600 hover:text-blue-800 hover:underline" 
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
            
            // Style emphasis and strong
            em: ({ node, children, ...props }) => (
              <em className="italic" {...props}>
                {children}
              </em>
            ),
            strong: ({ node, children, ...props }) => (
              <strong className="font-semibold" {...props}>
                {children}
              </strong>
            ),
            
            // Style blockquotes
            blockquote: ({ node, children, ...props }) => (
              <blockquote 
                className="border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-4" 
                {...props}
              >
                {children}
              </blockquote>
            ),
            
            // Style code blocks
            code: ({ node, inline, children, ...props }) => (
              inline ? (
                <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <code className="block bg-gray-100 rounded p-4 text-sm font-mono mb-4 overflow-x-auto" {...props}>
                  {children}
                </code>
              )
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