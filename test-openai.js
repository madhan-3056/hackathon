// Test script to verify OpenAI integration is working
import dotenv from 'dotenv';
import { analyzeDocument, explainLegalTerm } from './services/aiService.js';

// Load environment variables
dotenv.config();

console.log('Starting OpenAI integration test...');

// Check if OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY not found in environment variables');
    console.log('Please make sure you have added your OpenAI API key to the .env file');
    process.exit(1);
}

// Test analyzeDocument function
const testAnalyzeDocument = async () => {
    console.log('\nTesting analyzeDocument function...');

    const sampleDocument = `
    EMPLOYMENT AGREEMENT
    
    This Employment Agreement ("Agreement") is made and entered into as of [Date], by and between [Company Name], a [State] corporation ("Company"), and [Employee Name] ("Employee").
    
    1. EMPLOYMENT. Company agrees to employ Employee, and Employee agrees to be employed by Company, beginning on [Start Date] and continuing until terminated in accordance with the provisions of this Agreement.
    
    2. POSITION AND DUTIES. Employee shall serve as [Position] of Company, with such duties and responsibilities as may be assigned to Employee by Company from time to time.
    
    3. COMPENSATION. Company shall pay Employee a base salary of $[Amount] per year, payable in accordance with Company's standard payroll practices.
    
    4. AT-WILL EMPLOYMENT. Employee's employment with Company is "at-will," meaning that either Employee or Company may terminate the employment relationship at any time, with or without cause, and with or without notice.
    
    5. CONFIDENTIALITY. Employee agrees to maintain the confidentiality of all confidential and proprietary information of Company.
    
    IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
  `;

    try {
        const result = await analyzeDocument(sampleDocument);
        console.log('Analysis result:', result);
        return true;
    } catch (error) {
        console.error('Error analyzing document:', error);
        return false;
    }
};

// Test explainLegalTerm function
const testExplainLegalTerm = async () => {
    console.log('\nTesting explainLegalTerm function...');

    const legalTerm = 'force majeure';

    try {
        const result = await explainLegalTerm(legalTerm);
        console.log(`Explanation of "${legalTerm}":`);
        console.log(result);
        return true;
    } catch (error) {
        console.error('Error explaining legal term:', error);
        return false;
    }
};

// Run tests
const runTests = async () => {
    const analyzeResult = await testAnalyzeDocument();
    const explainResult = await testExplainLegalTerm();

    console.log('\nTest results:');
    console.log('- analyzeDocument:', analyzeResult ? 'PASSED' : 'FAILED');
    console.log('- explainLegalTerm:', explainResult ? 'PASSED' : 'FAILED');

    if (analyzeResult && explainResult) {
        console.log('\nAll tests passed! OpenAI integration is working correctly.');
    } else {
        console.log('\nSome tests failed. Please check the error messages above.');
    }
};

// Run the tests
runTests().catch(error => {
    console.error('Error running tests:', error);
});