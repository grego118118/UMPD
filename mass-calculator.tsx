import { useState } from 'react';

// CBA Questions Interface Component
const CBAQuestionsInterface = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([
    'What are the overtime provisions?',
    'How many sick days do I get per year?',
    'What is the procedure for shift bidding?'
  ]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call to query the CBA document
    setTimeout(() => {
      // Mock response for demonstration purposes
      const mockResponse = {
        answer: 'Based on Article 14, Section 3 of the Collective Bargaining Agreement, officers are entitled to 15 sick days per fiscal year, which accrue at a rate of 1.25 days per month. Unused sick leave may be accumulated up to a maximum of 120 days. For situations requiring extended sick leave, options include requesting an advance of sick leave or applying for FMLA coverage.',
        citations: [
          { page: 27, section: 'Article 14, Section 3' },
          { page: 28, section: 'Article 14, Section 3.5' }
        ],
        relatedSections: [
          'Article 14 - Sick Leave',
          'Article 15 - Family Medical Leave'
        ]
      };
      
      setAnswer(mockResponse);
      setIsLoading(false);
      
      // Add to recent questions if not already there
      if (!recentQuestions.includes(question)) {
        setRecentQuestions(prev => [question, ...prev.slice(0, 4)]);
      }
    }, 1500);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">UMPD Collective Bargaining Agreement Assistant</h1>
        <p className="text-gray-600">Ask questions about your rights, benefits, and obligations under the current CBA</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the collective bargaining agreement..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-blue-300"
                >
                  {isLoading ? 'Searching...' : 'Ask'}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Example: "What are my overtime rights?" or "How does vacation accrual work?"
              </p>
            </form>
          </div>

          {isLoading && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex justify-center items-center">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {answer && !isLoading && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{question}</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700">{answer.answer}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Citations:</h3>
                <ul className="space-y-1">
                  {answer.citations.map((citation, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-sm text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      <a 
                        href={`https://umass.sharepoint.com/:b:/s/humres/EVU9XC6E4JpPu_3Uklb1vO8BO6dhPtHnZ-jUr4_5BwYZfg?e=zUC23v#page=${citation.page}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {citation.section} (Page {citation.page})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {answer.relatedSections && answer.relatedSections.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Related Sections:</h3>
                  <div className="flex flex-wrap gap-2">
                    {answer.relatedSections.map((section, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-md font-semibold text-gray-700 mb-3">CBA Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span className="text-sm text-gray-700">Current Agreement: 2021-2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">Last Updated: January 15, 2024</span>
              </div>
              <div className="pt-2">
                <a 
                  href="https://umass.sharepoint.com/:b:/s/humres/EVU9XC6E4JpPu_3Uklb1vO8BO6dhPtHnZ-jUr4_5BwYZfg?e=zUC23v" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Full Agreement
                </a>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-md font-semibold text-gray-700 mb-3">Recent Questions</h2>
              <ul className="space-y-2">
                {recentQuestions.map((q, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => {
                        setQuestion(q);
                        handleSubmit();
                      }}
                      className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <h2 className="text-md font-semibold text-gray-700 mb-3">Common Topics</h2>
              <div className="flex flex-wrap gap-2">
                {['Overtime', 'Vacation', 'Sick Leave', 'Grievance', 'Discipline', 'Compensation', 'Shifts', 'Details'].map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuestion(`What does the CBA say about ${topic.toLowerCase()}?`);
                      handleSubmit();
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-xs font-medium text-gray-700 transition duration-150 ease-in-out"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};const NewHiresGuide = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">New Hires Guide for UMPD Officers</h1>
        <p className="text-gray-600">Important steps to complete when starting your new position</p>
      </header>

      <div className="bg-blue-50 p-5 rounded mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-4">First Day Checklist</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-bold text-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Payroll and Deductions
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Union Dues Deduction Form:</span> Complete the NEPBA union dues authorization form in your onboarding packet.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Direct Deposit Form:</span> Set up direct deposit through HR for your bi-weekly paychecks.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Tax Withholding Forms:</span> Complete both federal (W-4) and state tax withholding forms.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-bold text-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Benefits Enrollment
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Health Insurance:</span> Select a health insurance plan from the GIC (Group Insurance Commission) options.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Dental Plan Enrollment:</span> Complete the dental plan enrollment form (separate from health insurance).</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Vision Care Plan:</span> Complete the vision/eye care enrollment form.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Life Insurance:</span> Review and select your life insurance coverage options.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-bold text-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Retirement and Savings
            </h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">State Retirement System:</span> Complete enrollment in the Massachusetts State Retirement System.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">403(b) Annuity Plan:</span> Set up your optional 403(b) supplemental retirement account.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Deferred Compensation (457 Plan):</span> Consider enrolling in the Massachusetts SMART Plan for additional retirement savings.</p>
              </li>
              <li className="flex items-start">
                <span className="h-6 flex items-center sm:h-7">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="ml-2"><span className="font-medium">Beneficiary Forms:</span> Designate beneficiaries for your retirement accounts and life insurance.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> You have 10 calendar days from your hire date to complete benefit enrollment forms. Missing this deadline may result in having to wait until the next open enrollment period.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-5 rounded">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Additional Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Key Contacts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Human Resources:</strong> 413-545-1111, hr@umass.edu</li>
              <li><strong>Benefits Office:</strong> 413-545-2222, benefits@umass.edu</li>
              <li><strong>Payroll Department:</strong> 413-545-3333, payroll@umass.edu</li>
              <li><strong>NEPBA Union Representative:</strong> 413-545-4444, union@nepba.org</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-600 hover:underline">UMass HR Portal</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">GIC Benefits Guide</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">NEPBA Union Benefits</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">403(b) Plan Information</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Massachusetts SMART Plan (457)</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};import { useState } from 'react';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('retirement');
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'retirement' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('retirement')}
          >
            Retirement Calculator
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'overtime' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overtime')}
          >
            UMPD Overtime Calculator
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'newhires' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('newhires')}
          >
            New Hires Guide
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'contract' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('contract')}
          >
            Contract
          </button>
        </nav>
      </div>
      
      {activeTab === 'retirement' ? (
        <RetirementCalculator />
      ) : activeTab === 'overtime' ? (
        <OvertimeCalculator />
      ) : activeTab === 'newhires' ? (
        <NewHiresGuide />
      ) : (
        <CBAQuestionsInterface />
      )}
    </div>
  );
};

const RetirementCalculator = () => {
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [formData, setFormData] = useState({
    age: 45,
    yearsOfService: 15,
    averageSalary: 70000,
    retirementAge: 55,
    retirementGroup: 'group2',
    membershipDate: 'before-april-2012',
    retirementType: 'superannuation',
    retirementOption: 'optionA'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['age', 'yearsOfService', 'averageSalary', 'retirementAge'].includes(name) ? Number(value) : value
    });
  };
  
  const calculateBenefit = () => {
    // Basic calculation example
    const factor = formData.retirementGroup === 'group2' ? 0.02 : 0.025;
    const years = Math.min(formData.yearsOfService + (formData.retirementAge - formData.age), 32);
    const percentage = Math.min(years * factor * 100, 80);
    const annualBenefit = formData.averageSalary * (percentage / 100);
    const optionFactor = formData.retirementOption === 'optionA' ? 1 : 
                         formData.retirementOption === 'optionB' ? 0.97 : 0.88;
    
    setResult({
      monthlyBenefit: (annualBenefit * optionFactor / 12).toFixed(2),
      annualBenefit: (annualBenefit * optionFactor).toFixed(2),
      projectedYearsOfService: years,
      replacementRatio: (annualBenefit * optionFactor / formData.averageSalary * 100).toFixed(1),
      factor: (factor * 100).toFixed(1),
      optionReduction: formData.retirementOption === 'optionA' ? 0 : 
                       formData.retirementOption === 'optionB' ? 3 : 12
    });
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Massachusetts State Retirement Calculator</h1>
        <p className="text-gray-600">Estimate your retirement benefits</p>
      </header>

      <div className="bg-blue-50 p-4 rounded mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Your Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
            <input
              type="number"
              name="yearsOfService"
              value={formData.yearsOfService}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Average Annual Salary</label>
            <input
              type="number"
              name="averageSalary"
              value={formData.averageSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
            <input
              type="number"
              name="retirementAge"
              value={formData.retirementAge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Group</label>
            <select
              name="retirementGroup"
              value={formData.retirementGroup}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="group1">Group 1 - General Employees</option>
              <option value="group2">Group 2 - Public Safety</option>
              <option value="group3">Group 3 - State Police</option>
              <option value="group4">Group 4 - Fire, Police, Corrections</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Date</label>
            <select
              name="membershipDate"
              value={formData.membershipDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="before-april-2012">Before April 2, 2012</option>
              <option value="after-april-2012">After April 2, 2012</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Option</label>
            <select
              name="retirementOption"
              value={formData.retirementOption}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="optionA">Option A - Full Allowance</option>
              <option value="optionB">Option B - Reduced (1-5%)</option>
              <option value="optionC">Option C - Reduced (7-15%)</option>
            </select>
          </div>
        </div>
        <button
          onClick={calculateBenefit}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Calculate Retirement Benefit
        </button>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-6">
          <h2 className="text-lg font-medium text-green-800 mb-2">Your Estimated Retirement Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Benefit:</p>
              <p className="text-xl font-bold text-green-700">${result.monthlyBenefit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Annual Benefit:</p>
              <p className="text-xl font-bold text-green-700">${result.annualBenefit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Years of Service at Retirement:</p>
              <p className="text-xl font-bold text-green-700">{result.projectedYearsOfService}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Income Replacement Ratio:</p>
              <p className="text-xl font-bold text-green-700">{result.replacementRatio}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OvertimeCalculator = () => {
  const [topStepRate, setTopStepRate] = useState(45.00);
  const [officerRate, setOfficerRate] = useState(41.02);
  const [regularHours, setRegularHours] = useState(80);
  const [hoursWorked, setHoursWorked] = useState({
    whiteSlip: 0,
    blueSlip: 0,
    yellowSlip: 0,
    pinkSlip: 0
  });
  const [results, setResults] = useState(null);

  const handleHoursChange = (type, value) => {
    setHoursWorked(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };

  const calculateOvertime = () => {
    // Calculate rates
    const whiteSlipRate = officerRate * 1.5;
    const blueSlipRate = officerRate * 1.5;
    const yellowSlipRate = 70.75; // Fixed rate for yellow slip
    const pinkSlipRate = 66.14; // Fixed rate for pink slip

    // Calculate regular pay
    const regularPay = officerRate * regularHours;

    // Calculate earnings for each slip type
    const whiteSlipEarnings = whiteSlipRate * hoursWorked.whiteSlip;
    const blueSlipEarnings = blueSlipRate * hoursWorked.blueSlip;
    const yellowSlipEarnings = yellowSlipRate * hoursWorked.yellowSlip;
    const pinkSlipEarnings = pinkSlipRate * hoursWorked.pinkSlip;

    // Calculate total earnings
    const overtimeEarnings = whiteSlipEarnings + blueSlipEarnings + yellowSlipEarnings + pinkSlipEarnings;
    const totalEarnings = regularPay + overtimeEarnings;
    const totalHours = regularHours + hoursWorked.whiteSlip + hoursWorked.blueSlip + hoursWorked.yellowSlip + hoursWorked.pinkSlip;

    setResults({
      rates: {
        regular: officerRate.toFixed(2),
        whiteSlip: whiteSlipRate.toFixed(2),
        blueSlip: blueSlipRate.toFixed(2),
        yellowSlip: yellowSlipRate.toFixed(2),
        pinkSlip: pinkSlipRate.toFixed(2)
      },
      earnings: {
        regular: regularPay.toFixed(2),
        whiteSlip: whiteSlipEarnings.toFixed(2),
        blueSlip: blueSlipEarnings.toFixed(2),
        yellowSlip: yellowSlipEarnings.toFixed(2),
        pinkSlip: pinkSlipEarnings.toFixed(2)
      },
      overtimeTotal: overtimeEarnings.toFixed(2),
      total: totalEarnings.toFixed(2),
      totalHours
    });
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">UMPD Overtime Calculator</h1>
        <p className="text-gray-600">Calculate overtime earnings for UMass Police Department officers</p>
      </header>

      <div className="bg-blue-50 p-4 rounded mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Pay Rate Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Top Step Patrol Officer Rate ($)</label>
            <input
              type="number"
              value={topStepRate}
              onChange={(e) => setTopStepRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Hourly Rate ($)</label>
            <input
              type="number"
              value={officerRate}
              onChange={(e) => setOfficerRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regular Bi-Monthly Hours</label>
            <input
              type="number"
              value={regularHours}
              onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Standard is 80 hours per bi-monthly pay period</p>
          </div>
          <div className="flex items-end">
            <div className="bg-gray-100 p-2 rounded w-full">
              <p className="text-sm font-medium text-gray-700">Regular Bi-Monthly Pay:</p>
              <p className="text-lg font-bold text-gray-800">${(officerRate * regularHours).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-6">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Overtime Hours</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">White Slip Hours (1.5x hourly rate)</label>
            <input
              type="number"
              value={hoursWorked.whiteSlip || ''}
              onChange={(e) => handleHoursChange('whiteSlip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blue Slip Hours (1.5x hourly rate)</label>
            <input
              type="number"
              value={hoursWorked.blueSlip || ''}
              onChange={(e) => handleHoursChange('blueSlip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yellow Slip Hours (15% of top step + 1.5x top step rate)</label>
            <input
              type="number"
              value={hoursWorked.yellowSlip || ''}
              onChange={(e) => handleHoursChange('yellowSlip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Currently $70.75/hr</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pink Slip Hours (7.5% of top step + 1.5x top step rate)</label>
            <input
              type="number"
              value={hoursWorked.pinkSlip || ''}
              onChange={(e) => handleHoursChange('pinkSlip', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Currently $66.14/hr</p>
          </div>
        </div>
        <button
          onClick={calculateOvertime}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Calculate Overtime Pay
        </button>
      </div>

      {results && (
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-6">
          <h2 className="text-lg font-medium text-green-800 mb-4">Overtime Calculation Results</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Pay Type</th>
                  <th className="py-2 px-4 border-b">Hours</th>
                  <th className="py-2 px-4 border-b">Rate</th>
                  <th className="py-2 px-4 border-b">Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">Regular Pay</td>
                  <td className="py-2 px-4 border-b">{regularHours}</td>
                  <td className="py-2 px-4 border-b">${results.rates.regular}/hr</td>
                  <td className="py-2 px-4 border-b">${results.earnings.regular}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">White Slip (1.5x)</td>
                  <td className="py-2 px-4 border-b">{hoursWorked.whiteSlip}</td>
                  <td className="py-2 px-4 border-b">${results.rates.whiteSlip}/hr</td>
                  <td className="py-2 px-4 border-b">${results.earnings.whiteSlip}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Blue Slip (1.5x)</td>
                  <td className="py-2 px-4 border-b">{hoursWorked.blueSlip}</td>
                  <td className="py-2 px-4 border-b">${results.rates.blueSlip}/hr</td>
                  <td className="py-2 px-4 border-b">${results.earnings.blueSlip}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Yellow Slip (15% of top step + 1.5x top step)</td>
                  <td className="py-2 px-4 border-b">{hoursWorked.yellowSlip}</td>
                  <td className="py-2 px-4 border-b">${results.rates.yellowSlip}/hr</td>
                  <td className="py-2 px-4 border-b">${results.earnings.yellowSlip}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Pink Slip (7.5% of top step + 1.5x top step)</td>
                  <td className="py-2 px-4 border-b">{hoursWorked.pinkSlip}</td>
                  <td className="py-2 px-4 border-b">${results.rates.pinkSlip}/hr</td>
                  <td className="py-2 px-4 border-b">${results.earnings.pinkSlip}</td>
                </tr>
                <tr className="border-t-2 border-gray-400">
                  <td className="py-2 px-4 border-b font-medium">Overtime Subtotal</td>
                  <td className="py-2 px-4 border-b">{results.totalHours - regularHours}</td>
                  <td className="py-2 px-4 border-b">-</td>
                  <td className="py-2 px-4 border-b font-medium">${results.overtimeTotal}</td>
                </tr>
                <tr className="font-bold bg-blue-50">
                  <td className="py-2 px-4 border-b">Total Bi-Monthly Pay</td>
                  <td className="py-2 px-4 border-b">{results.totalHours}</td>
                  <td className="py-2 px-4 border-b">-</td>
                  <td className="py-2 px-4 border-b">${results.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-100 p-3 rounded text-sm">
            <h3 className="font-medium text-blue-800 mb-1">UMPD Overtime Types</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li><strong>White Slip:</strong> Standard overtime at 1.5x your hourly rate</li>
              <li><strong>Blue Slip:</strong> Equivalent to White Slip (1.5x your hourly rate)</li>
              <li><strong>Yellow Slip:</strong> 15% of top step plus 1.5x top step patrol rate ($70.75/hr)</li>
              <li><strong>Pink Slip:</strong> 7.5% of top step plus 1.5x top step patrol rate ($66.14/hr)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;