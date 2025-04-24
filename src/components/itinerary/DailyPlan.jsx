import React from 'react';
import { formatDate } from '../../utils/formatters';

const DailyPlan = ({ dayPlan }) => {
  if (!dayPlan) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No activities planned for this day.</p>
      </div>
    );
  }

  const { day, date, morning, afternoon, evening, accommodation } = dayPlan;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Day {day} - {formatDate(date)}</h2>
      </div>

      <div className="p-6">
        {/* Morning Activities */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-yellow-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Morning</h3>
          </div>
          <div className="pl-10">
            {morning ? (
              <div className="text-gray-600 prose" dangerouslySetInnerHTML={{ __html: formatMarkdownAsProse(morning) }} />
            ) : (
              <p className="text-gray-500 italic">No activities scheduled for the morning.</p>
            )}
          </div>
        </div>

        {/* Afternoon Activities */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4zm0 5a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
                <path d="M10 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Afternoon</h3>
          </div>
          <div className="pl-10">
            {afternoon ? (
              <div className="text-gray-600 prose" dangerouslySetInnerHTML={{ __html: formatMarkdownAsProse(afternoon) }} />
            ) : (
              <p className="text-gray-500 italic">No activities scheduled for the afternoon.</p>
            )}
          </div>
        </div>

        {/* Evening Activities */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-indigo-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Evening</h3>
          </div>
          <div className="pl-10">
            {evening ? (
              <div className="text-gray-600 prose" dangerouslySetInnerHTML={{ __html: formatMarkdownAsProse(evening) }} />
            ) : (
              <p className="text-gray-500 italic">No activities scheduled for the evening.</p>
            )}
          </div>
        </div>

        {/* Accommodation */}
        {accommodation && (
          <div>
            <div className="flex items-center mb-3">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Overnight Stay</h3>
            </div>
            <div className="pl-10">
              <p className="text-gray-600">{accommodation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format markdown text as HTML
const formatMarkdownAsProse = (markdown) => {
  if (!markdown) return '';
  
  // Simple markdown formatting
  let formatted = markdown
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
    // Convert headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>')
    // Convert lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>)/g, '<ul class="list-disc pl-5 my-2">$1</ul>')
    // Convert bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Convert italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Wrap paragraphs (text not already in HTML tags)
  formatted = formatted.replace(/^(?!<[a-z]).+/gm, '<p>$&</p>');
  
  // Fix nested paragraphs in list items
  formatted = formatted.replace(/<li><p>(.+)<\/p><\/li>/g, '<li>$1</li>');
  
  return formatted;
};

export default DailyPlan;