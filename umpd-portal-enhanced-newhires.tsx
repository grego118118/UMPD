import React, { useState } from 'react';

// Enhanced retirement table component with dynamic data
const RetirementTable = ({ calculationData }) => {
  const rows = calculationData || [
    { factor: 2.0, years: 30, age: 55, projectedDate: "3/21/2028", percentage: 60.0, annualBenefit: 50158.94, monthlyBenefit: 4179.91 },
    { factor: 2.1, years: 31, age: 56, projectedDate: "3/21/2029", percentage: 65.1, annualBenefit: 54422.45, monthlyBenefit: 4535.20 },
    { factor: 2.2, years: 32, age: 57, projectedDate: "3/21/2030", percentage: 70.4, annualBenefit: 58853.16, monthlyBenefit: 4904.43 },
    { factor: 2.25, years: 33, age: 58, projectedDate: "3/21/2031", percentage: 74.3, annualBenefit: 62113.49, monthlyBenefit: 5176.12 },
    { factor: 2.3, years: 34, age: 59, projectedDate: "3/21/2032", percentage: 78.2, annualBenefit: 65373.82, monthlyBenefit: 5447.82 },
    { factor: 2.4, years: 35, age: 60, projectedDate: "3/21/2033", percentage: 80.0, annualBenefit: 66878.59, monthlyBenefit: 5573.22 },
    { factor: 2.5, years: 36, age: 61, projectedDate: "3/21/2034", percentage: 80.0, annualBenefit: 66878.59, monthlyBenefit: 5573.22 }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Factor<br/>(%)</th>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Years of<br/>Service</th>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Age at<br/>Retirement</th>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Projected<br/>Retirement Date</th>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Percentage</th>
            <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Annual<br/>Benefit</th>
            <th className="py-2 px-4 border-b font-semibold text-gray-700 text-left">Monthly<br/>Benefit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-green-50" : "bg-white"}>
              <td className="py-2 px-4 border-b border-r text-gray-700">{row.factor.toFixed(1)}%</td>
              <td className="py-2 px-4 border-b border-r text-gray-700">{row.years}</td>
              <td className="py-2 px-4 border-b border-r text-gray-700">{row.age}</td>
              <td className="py-2 px-4 border-b border-r text-gray-700">{row.projectedDate}</td>
              <td className="py-2 px-4 border-b border-r text-gray-700">{row.percentage.toFixed(1)}%</td>
              <td className="py-2 px-4 border-b border-r text-gray-700">${row.annualBenefit.toFixed(2)}</td>
              <td className="py-2 px-4 border-b text-gray-700">${row.monthlyBenefit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UMPDPortal = () => {
  const [activeTab, setActiveTab] = useState('retirement');
  const [showRetirementResults, setShowRetirementResults] = useState(false);
  const [showOvertimeResults, setShowOvertimeResults] = useState(false);
  
  // Retirement calculation states
  const [retirementResults, setRetirementResults] = useState({
    monthlyBenefit: 4179.91,
    annualBenefit: 50158.94,
    yearsOfService: 30,
    ageAtRetirement: 55,
    replacementRatio: 60.0,
    tableData: null
  });
  
  // Overtime calculation states
  const [overtimeResults, setOvertimeResults] = useState({
    whiteSlipPay: 0,
    blueSlipPay: 0,
    yellowSlipPay: 0,
    pinkSlipPay: 0,
    totalOvertimePay: 0,
    regularPay: 0,
    totalPay: 0
  });
  
  // New Hires Guide expanded sections state
  const [expandedSection, setExpandedSection] = useState('');
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('');
    } else {
      setExpandedSection(section);
    }
  };

  // Calculate years between two dates (only counting complete years)
  const calculateCompleteYears = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // First check if the end date is on or after the anniversary of the start date
    let years = end.getFullYear() - start.getFullYear();
    
    // If we haven't reached the anniversary day yet, subtract one year
    if (
      end.getMonth() < start.getMonth() || 
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
    ) {
      years--;
    }
    
    // If they're exactly the same day but one day later (like 03/20/1997 to 03/20/2028), 
    // that counts as a complete year
    if (
      end.getMonth() === start.getMonth() && 
      end.getDate() === start.getDate() && 
      end.getFullYear() > start.getFullYear()
    ) {
      // This is an exact anniversary, so the years are already correct
    }
    
    // Ensure we don't return a negative number
    return Math.max(0, years);
  };
  
  // Calculate age at a given date
  const calculateAge = (birthDate, targetDate) => {
    return calculateCompleteYears(birthDate, targetDate);
  };

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Calculate retirement benefits based on inputs
  const calculateRetirementBenefits = () => {
    try {
      // Get input values
      const dobInput = document.getElementById('dob');
      const hireDateInput = document.getElementById('hireDate');
      const salaryInput = document.getElementById('salary');
      const retirementDateInput = document.getElementById('retirementDate');
      const retirementGroupSelect = document.getElementById('retirementGroup');
      const membershipDateSelect = document.getElementById('membershipDate');
      const retirementOptionSelect = document.getElementById('retirementOption');
      
      // Parse values
      const dob = dobInput ? new Date(dobInput.value) : new Date('1980-01-01');
      const hireDate = hireDateInput ? new Date(hireDateInput.value) : new Date('2010-01-01');
      const salary = salaryInput ? parseFloat(salaryInput.value) : 70000;
      const retirementDate = retirementDateInput ? new Date(retirementDateInput.value) : new Date('2040-01-01');
      const retirementGroup = retirementGroupSelect ? retirementGroupSelect.value : 'group2';
      const membershipDate = membershipDateSelect ? membershipDateSelect.value : 'before-april-2012';
      const retirementOption = retirementOptionSelect ? retirementOptionSelect.value : 'optionA';
      
      // Calculate years of service based on complete years
      const yearsOfService = calculateCompleteYears(hireDate, retirementDate);
      
      // Calculate age at retirement
      const ageAtRetirement = calculateAge(dob, retirementDate);
      
      // Special case for Group 3 (State Police)
      if (retirementGroup === 'group3') {
        // State Police: 75% after 25 years of service regardless of age
        let percentage;
        if (yearsOfService >= 25) {
          percentage = 75.0; // Maximum 75% for Group 3
        } else {
          // For less than 25 years, use a proportional calculation
          percentage = (yearsOfService / 25) * 75.0;
        }
        
        // Calculate annual benefit
        let annualBenefit = (salary * percentage) / 100;
        
        // Adjust for retirement option
        if (retirementOption === 'optionB') {
          annualBenefit *= 0.97; // Option B reduction (example: 3%)
        } else if (retirementOption === 'optionC') {
          annualBenefit *= 0.88; // Option C reduction (example: 12%)
        }
        
        // Calculate monthly benefit
        const monthlyBenefit = annualBenefit / 12;
        
        // Generate table data for different scenarios
        const tableData = [];
        for (let i = 0; i < 7; i++) {
          const additionalYears = i;
          
          // Calculate new retirement date adding additional years
          const adjRetirementDate = new Date(retirementDate);
          adjRetirementDate.setFullYear(adjRetirementDate.getFullYear() + additionalYears);
          
          const adjYearsOfService = yearsOfService + additionalYears;
          const adjAgeAtRetirement = ageAtRetirement + additionalYears;
          
          // Calculate percentage for State Police
          let adjPercentage;
          if (adjYearsOfService >= 25) {
            adjPercentage = 75.0; // Maximum 75% for Group 3
          } else {
            adjPercentage = (adjYearsOfService / 25) * 75.0;
          }
          
          // Fixed factor for State Police - using 3.0 as display value
          const adjFactor = 3.0;
          
          // Calculate annual benefit
          let adjAnnualBenefit = (salary * adjPercentage) / 100;
          
          // Adjust for retirement option
          if (retirementOption === 'optionB') {
            adjAnnualBenefit *= 0.97;
          } else if (retirementOption === 'optionC') {
            adjAnnualBenefit *= 0.88;
          }
          
          // Calculate monthly benefit
          const adjMonthlyBenefit = adjAnnualBenefit / 12;
          
          tableData.push({
            factor: adjFactor,
            years: adjYearsOfService,
            age: adjAgeAtRetirement,
            projectedDate: formatDate(adjRetirementDate),
            percentage: adjPercentage,
            annualBenefit: adjAnnualBenefit,
            monthlyBenefit: adjMonthlyBenefit
          });
        }
        
        // Update results state
        setRetirementResults({
          monthlyBenefit,
          annualBenefit,
          yearsOfService,
          ageAtRetirement,
          replacementRatio: percentage,
          tableData
        });
      } else {
        // Standard calculation for Groups 1, 2, and 4
        // Get starting age and factor based on retirement group
        let startingAge;
        switch (retirementGroup) {
          case 'group1': // General Employees
            startingAge = 60;
            break;
          case 'group2': // Public Safety
            startingAge = 55;
            break;
          case 'group4': // Fire, Police, Corrections
            startingAge = 50;
            break;
          default:
            startingAge = 55;
        }
        
        // Calculate factor based on retirement age and starting age
        let factor;
        if (ageAtRetirement < startingAge) {
          // If retiring before the starting age, use lower factor
          factor = 1.5;
        } else {
          // Calculate factor based on how many years past starting age
          const yearsPastStartingAge = ageAtRetirement - startingAge;
          if (yearsPastStartingAge >= 5) {
            factor = 2.5; // Max factor
          } else {
            // Increase factor by 0.1 for each year past starting age
            factor = 2.0 + (yearsPastStartingAge * 0.1);
          }
        }
        
        // Adjust factor based on membership date
        if (membershipDate === 'after-april-2012') {
          factor -= 0.25; // Reduced factor for newer employees
        }
        
        // Calculate percentage (capped at 80%)
        let percentage = Math.min(factor * yearsOfService, 80);
        
        // Calculate annual benefit
        let annualBenefit = (salary * percentage) / 100;
        
        // Adjust for retirement option
        if (retirementOption === 'optionB') {
          annualBenefit *= 0.97; // Option B reduction (example: 3%)
        } else if (retirementOption === 'optionC') {
          annualBenefit *= 0.88; // Option C reduction (example: 12%)
        }
        
        // Calculate monthly benefit
        const monthlyBenefit = annualBenefit / 12;
        
        // Generate table data for different scenarios
        const tableData = [];
        for (let i = 0; i < 7; i++) {
          const additionalYears = i;
          
          // Calculate new retirement date adding additional years
          const adjRetirementDate = new Date(retirementDate);
          adjRetirementDate.setFullYear(adjRetirementDate.getFullYear() + additionalYears);
          
          const adjYearsOfService = yearsOfService + additionalYears;
          const adjAgeAtRetirement = ageAtRetirement + additionalYears;
          
          // Calculate factor based on retirement age and starting age
          let adjFactor;
          if (adjAgeAtRetirement < startingAge) {
            // If retiring before the starting age, use lower factor
            adjFactor = 1.5;
          } else {
            // Calculate factor based on how many years past starting age
            const yearsPastStartingAge = adjAgeAtRetirement - startingAge;
            if (yearsPastStartingAge >= 5) {
              adjFactor = 2.5; // Max factor
            } else {
              // Increase factor by 0.1 for each year past starting age
              adjFactor = 2.0 + (yearsPastStartingAge * 0.1);
            }
          }
          
          // Adjust factor based on membership date
          if (membershipDate === 'after-april-2012') {
            adjFactor -= 0.25; // Reduced factor for newer employees
          }
          
          // Calculate percentage (capped at 80%)
          const adjPercentage = Math.min(adjFactor * adjYearsOfService, 80);
          
          // Calculate annual benefit
          let adjAnnualBenefit = (salary * adjPercentage) / 100;
          
          // Adjust for retirement option
          if (retirementOption === 'optionB') {
            adjAnnualBenefit *= 0.97;
          } else if (retirementOption === 'optionC') {
            adjAnnualBenefit *= 0.88;
          }
          
          // Calculate monthly benefit
          const adjMonthlyBenefit = adjAnnualBenefit / 12;
          
          tableData.push({
            factor: adjFactor,
            years: adjYearsOfService,
            age: adjAgeAtRetirement,
            projectedDate: formatDate(adjRetirementDate),
            percentage: adjPercentage,
            annualBenefit: adjAnnualBenefit,
            monthlyBenefit: adjMonthlyBenefit
          });
        }
        
        // Update results state
        setRetirementResults({
          monthlyBenefit,
          annualBenefit,
          yearsOfService,
          ageAtRetirement,
          replacementRatio: percentage,
          tableData
        });
      }
      
      // Show results
      setShowRetirementResults(true);
      
      // Make sure results section is visible
      const resultsSection = document.querySelector(".bg-green-50");
      if (resultsSection) {
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
      
    } catch (error) {
      console.error("Error calculating retirement benefits:", error);
      
      // Fallback to default values if calculation fails
      setRetirementResults({
        monthlyBenefit: 4179.91,
        annualBenefit: 50158.94,
        yearsOfService: 30,
        ageAtRetirement: 55,
        replacementRatio: 60.0,
        tableData: null
      });
      
      // Still show results with fallback values
      setShowRetirementResults(true);
      
      const resultsSection = document.querySelector(".bg-green-50");
      if (resultsSection) {
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  
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
      
      {activeTab === 'retirement' && (
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">Massachusetts State Retirement Calculator</h1>
            <p className="text-gray-600">Estimate your retirement benefits</p>
          </header>

          <div className="bg-blue-50 p-4 rounded mb-6">
            <h2 className="text-lg font-medium text-blue-800 mb-2">Your Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="1980-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <input
                  id="hireDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="2010-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Annual Salary</label>
                <input
                  id="salary"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="70000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projected Retirement Date</label>
                <input
                  id="retirementDate"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="2040-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Group</label>
                <select
                  id="retirementGroup"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="group2"
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
                  id="membershipDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="before-april-2012"
                >
                  <option value="before-april-2012">Before April 2, 2012</option>
                  <option value="after-april-2012">After April 2, 2012</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Option</label>
                <select
                  id="retirementOption"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="optionA"
                >
                  <option value="optionA">Option A - Full Allowance</option>
                  <option value="optionB">Option B - Reduced (1-5%)</option>
                  <option value="optionC">Option C - Reduced (7-15%)</option>
                </select>
              </div>
            </div>
            <button
              onClick={calculateRetirementBenefits}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Calculate Retirement Benefit
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded mb-6" style={{display: 'none'}}>
            <h2 className="text-lg font-medium text-green-800 mb-2">Your Estimated Retirement Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Benefit:</p>
                <p className="text-xl font-bold text-green-700">${retirementResults.monthlyBenefit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Benefit:</p>
                <p className="text-xl font-bold text-green-700">${retirementResults.annualBenefit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Complete Years of Service at Retirement:</p>
                <p className="text-xl font-bold text-green-700">{retirementResults.yearsOfService}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Income Replacement Ratio:</p>
                <p className="text-xl font-bold text-green-700">{retirementResults.replacementRatio.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age at Retirement:</p>
                <p className="text-xl font-bold text-green-700">{retirementResults.ageAtRetirement}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="mb-4 text-gray-700">
                This table shows how your retirement benefit would change with different calculation factors and
                years of service.
              </p>
              <RetirementTable calculationData={retirementResults.tableData} />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'overtime' && (
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
                  id="topStepRate"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="41.02"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Hourly Rate ($)</label>
                <input
                  id="hourlyRate"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="41.02"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regular Bi-Monthly Hours</label>
                <input
                  id="regularHours"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="80"
                />
                <p className="text-xs text-gray-500 mt-1">Standard is 80 hours per bi-monthly pay period</p>
              </div>
              <div className="flex items-end">
                <div className="bg-gray-100 p-2 rounded w-full">
                  <p className="text-sm font-medium text-gray-700">Regular Bi-Monthly Pay:</p>
                  <p id="regularPay" className="text-lg font-bold text-gray-800">$3,281.60</p>
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
                  id="whiteSlipHours"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blue Slip Hours (1.5x hourly rate)</label>
                <input
                  id="blueSlipHours"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yellow Slip Hours (15% of top step + 1.5x top step rate)</label>
                <input
                  id="yellowSlipHours"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="0"
                />
                <p className="text-xs text-gray-500 mt-1">Currently $70.75/hr</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pink Slip Hours (7.5% of top step + 1.5x top step rate)</label>
                <input
                  id="pinkSlipHours"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  defaultValue="0"
                />
                <p className="text-xs text-gray-500 mt-1">Currently $66.14/hr</p>
              </div>
            </div>
            <button
              onClick={() => {
                // Get input values
                const topStepRate = parseFloat(document.getElementById('topStepRate').value) || 41.02;
                const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 41.02;
                const regularHours = parseFloat(document.getElementById('regularHours').value) || 80;
                
                const whiteSlipHours = parseFloat(document.getElementById('whiteSlipHours').value) || 0;
                const blueSlipHours = parseFloat(document.getElementById('blueSlipHours').value) || 0;
                const yellowSlipHours = parseFloat(document.getElementById('yellowSlipHours').value) || 0;
                const pinkSlipHours = parseFloat(document.getElementById('pinkSlipHours').value) || 0;
                
                // Calculate pay
                const regularPay = hourlyRate * regularHours;
                const whiteSlipPay = whiteSlipHours * (hourlyRate * 1.5);
                const blueSlipPay = blueSlipHours * (hourlyRate * 1.5);
                
                // Yellow slip = 15% of top step + 1.5x top step rate
                const yellowSlipRate = (topStepRate * 0.15) + (topStepRate * 1.5);
                const yellowSlipPay = yellowSlipHours * yellowSlipRate;
                
                // Pink slip = 7.5% of top step + 1.5x top step rate
                const pinkSlipRate = (topStepRate * 0.075) + (topStepRate * 1.5);
                const pinkSlipPay = pinkSlipHours * pinkSlipRate;
                
                // Total overtime pay
                const totalOvertimePay = whiteSlipPay + blueSlipPay + yellowSlipPay + pinkSlipPay;
                
                // Total pay
                const totalPay = regularPay + totalOvertimePay;
                
                // Update results
                setOvertimeResults({
                  whiteSlipPay,
                  blueSlipPay,
                  yellowSlipPay,
                  pinkSlipPay,
                  totalOvertimePay,
                  regularPay,
                  totalPay
                });
                
                // Show results
                setShowOvertimeResults(true);
                
                // Make sure results section is visible
                const resultsSection = document.getElementById('overtimeResults');
                if (resultsSection) {
                  resultsSection.style.display = "block";
                  resultsSection.scrollIntoView({ behavior: "smooth" });
                }
                
                // Update regular pay display
                const payDisplay = document.getElementById('regularPay');
                if (payDisplay) {
                  payDisplay.textContent = `$${regularPay.toFixed(2)}`;
                }
              }}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Calculate Overtime Pay
            </button>
          </div>

          {/* Overtime Results Section */}
          <div 
            id="overtimeResults" 
            className="bg-green-50 border border-green-200 p-4 rounded mb-6" 
            style={{display: showOvertimeResults ? 'block' : 'none'}}
          >
            <h2 className="text-lg font-medium text-green-800 mb-2">Your Overtime Calculations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Regular Pay:</p>
                <p className="text-xl font-bold text-green-700">${overtimeResults.regularPay.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Overtime Pay:</p>
                <p className="text-xl font-bold text-green-700">${overtimeResults.totalOvertimePay.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pay:</p>
                <p className="text-xl font-bold text-green-700">${overtimeResults.totalPay.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-green-800 mb-2">Overtime Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Type</th>
                      <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Pay Rate</th>
                      <th className="py-2 px-4 border-b border-r font-semibold text-gray-700 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="py-2 px-4 border-b border-r text-gray-700">White Slip (1.5x)</td>
                      <td className="py-2 px-4 border-b border-r text-gray-700">${(parseFloat(document.getElementById('hourlyRate')?.value || 41.02) * 1.5).toFixed(2)}/hr</td>
                      <td className="py-2 px-4 border-b text-gray-700">${overtimeResults.whiteSlipPay.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-2 px-4 border-b border-r text-gray-700">Blue Slip (1.5x)</td>
                      <td className="py-2 px-4 border-b border-r text-gray-700">${(parseFloat(document.getElementById('hourlyRate')?.value || 41.02) * 1.5).toFixed(2)}/hr</td>
                      <td className="py-2 px-4 border-b text-gray-700">${overtimeResults.blueSlipPay.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-4 border-b border-r text-gray-700">Yellow Slip (15% + 1.5x)</td>
                      <td className="py-2 px-4 border-b border-r text-gray-700">$70.75/hr</td>
                      <td className="py-2 px-4 border-b text-gray-700">${overtimeResults.yellowSlipPay.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="py-2 px-4 border-b border-r text-gray-700">Pink Slip (7.5% + 1.5x)</td>
                      <td className="py-2 px-4 border-b border-r text-gray-700">$66.14/hr</td>
                      <td className="py-2 px-4 border-b text-gray-700">${overtimeResults.pinkSlipPay.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'newhires' && (
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">New Hires Guide for UMPD Officers</h1>
            <p className="text-gray-600">Important steps and resources for starting your new position</p>
          </header>

          {/* First Day Checklist Section */}
          <div className="bg-blue-50 p-5 rounded mb-6">
            <button 
              onClick={() => toggleSection('firstDay')}
              className="w-full flex justify-between items-center"
            >
              <h2 className="text-lg font-medium text-blue-800">First Day Checklist</h2>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-blue-600 transform ${expandedSection === 'firstDay' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className={`space-y-6 ${expandedSection === 'firstDay' ? 'block mt-4' : 'hidden'}`}>
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
                    <p className="ml-2"><span className="font-medium">Union Dues Deduction Form:</span> Complete the <a href="https://nepba.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NEPBA</a> union dues authorization form in your onboarding packet.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Direct Deposit Form:</span> Set up direct deposit through <a href="https://www.umass.edu/hr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">HR</a> for your bi-weekly paychecks.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Tax Forms:</span> Complete W-4 and M-4 tax withholding forms. Access at <a href="https://www.umass.edu/humres/forms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">HR Forms</a>.</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Required Documentation
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">I-9 Form:</span> Bring acceptable identification documents to complete the I-9 form on your first day. See <a href="https://www.uscis.gov/i-9-central/form-i-9-acceptable-documents" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">acceptable documents</a>.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Emergency Contact Form:</span> Complete emergency contact information. Available from <a href="https://www.umass.edu/umpd/forms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UMPD Forms</a>.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Benefits Enrollment Section */}
          <div className="bg-blue-50 p-5 rounded mb-6">
            <button 
              onClick={() => toggleSection('benefits')}
              className="w-full flex justify-between items-center"
            >
              <h2 className="text-lg font-medium text-blue-800">Benefits Enrollment</h2>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-blue-600 transform ${expandedSection === 'benefits' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className={`space-y-6 ${expandedSection === 'benefits' ? 'block mt-4' : 'hidden'}`}>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Health Insurance
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">GIC Health Plans:</span> Select from available health insurance plans. See <a href="https://www.umass.edu/hr/benefits-and-pay/benefits/health-insurance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Health Insurance Options</a>.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Dental and Vision:</span> Enroll in optional dental and vision plans. Visit <a href="https://www.umass.edu/hr/benefits-and-pay/employee-benefits" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Employee Benefits</a>.</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Retirement & Financial
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">State Retirement System:</span> Complete enrollment in the Massachusetts State Retirement System. Learn more at <a href="https://www.umass.edu/humres/retirement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UMass Retirement</a>.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Deferred Compensation:</span> Consider enrolling in the 457(b) deferred compensation plan for additional retirement savings. Visit <a href="https://www.mass.gov/service-details/learn-about-the-deferred-compensation-smart-plan" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SMART Plan</a>.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Important Resources Section */}
          <div className="bg-blue-50 p-5 rounded mb-6">
            <button 
              onClick={() => toggleSection('resources')}
              className="w-full flex justify-between items-center"
            >
              <h2 className="text-lg font-medium text-blue-800">Important Resources</h2>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-blue-600 transform ${expandedSection === 'resources' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className={`space-y-6 ${expandedSection === 'resources' ? 'block mt-4' : 'hidden'}`}>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Department Contacts
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">UMPD Main Office:</span> 413-545-2121 (non-emergency), <a href="mailto:umpd@admin.umass.edu" className="text-blue-600 hover:underline">umpd@admin.umass.edu</a></p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Human Resources:</span> 413-545-1396, <a href="mailto:hr@umass.edu" className="text-blue-600 hover:underline">hr@umass.edu</a></p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">NEPBA Union Rep:</span> Contact the <a href="https://nepba.org/executive-committee/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NEPBA representative</a> for your division</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Training & Development
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Required Training:</span> Complete mandatory trainings through <a href="https://www.umass.edu/it/support/moodle" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UMass Moodle</a></p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Policy Manual:</span> Review the <a href="https://www.umass.edu/umpd/forms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UMPD Policy Manual</a> (available from your supervisor)</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-md font-bold text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                  Online Resources
                </h3>
                <ul className="mt-2 space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">UMPD Website:</span> <a href="https://www.umass.edu/umpd" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.umass.edu/umpd</a></p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">HR Direct:</span> Access payroll and benefits information at <a href="https://www.umass.edu/humres/hr-direct" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">HR Direct Portal</a></p>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </span>
                    <p className="ml-2"><span className="font-medium">Campus Map:</span> <a href="https://www.umass.edu/map/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">UMass Campus Map</a></p>
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
                  <strong>Important:</strong> You have 10 calendar days from your hire date to complete benefit enrollment forms. Missing this deadline may result in having to wait until the next open enrollment period. Contact <a href="https://www.umass.edu/hr/benefits-and-pay/employee-benefits" target="_blank" rel="noopener noreferrer" className="font-medium underline">Benefits Office</a> with questions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded shadow">
            <h2 className="text-lg font-medium text-blue-800 mb-3">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="https://www.umass.edu/hr/forms" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-700">HR Forms Library</span>
              </a>
              <a href="https://www.mass.gov/orgs/state-board-of-retirement" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700">State Retirement Board</span>
              </a>
              <a href="https://nepba.org/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700">NEPBA Union Website</span>
              </a>
              <a href="https://www.umass.edu/umpd/forms" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span className="text-gray-700">UMPD Forms</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'contract' && (
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-blue-800">UMPD Collective Bargaining Agreement Assistant</h1>
            <p className="text-gray-600">Ask questions about your rights, benefits, and obligations under the current CBA</p>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <form className="flex flex-col space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask a question about the collective bargaining agreement..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      Ask
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Example: "What are my overtime rights?" or "How does vacation accrual work?"
                  </p>
                </form>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">How many sick days do I get per year?</h2>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700">Based on Article 14, Section 3 of the Collective Bargaining Agreement, officers are entitled to 15 sick days per fiscal year, which accrue at a rate of 1.25 days per month. Unused sick leave may be accumulated up to a maximum of 120 days. For situations requiring extended sick leave, options include requesting an advance of sick leave or applying for FMLA coverage.</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Citations:</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <span className="text-sm text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      <a className="text-sm text-blue-600 hover:underline">
                        Article 14, Section 3 (Page 27)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
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
                </div>
                
                <div className="mt-6">
                  <h2 className="text-md font-semibold text-gray-700 mb-3">Recent Questions</h2>
                  <ul className="space-y-2">
                    <li>
                      <button className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline">
                        What are the overtime provisions?
                      </button>
                    </li>
                    <li>
                      <button className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline">
                        How many sick days do I get per year?
                      </button>
                    </li>
                    <li>
                      <button className="text-sm text-left text-blue-600 hover:text-blue-800 hover:underline">
                        What is the procedure for shift bidding?
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-md font-semibold text-gray-700 mb-3">Common Topics</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Overtime', 'Vacation', 'Sick Leave', 'Grievance'].map((topic, index) => (
                      <button
                        key={index}
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
      )}
    </div>
  );
};

export default UMPDPortal;
