import React, { useState } from 'react';
import '../../styles/statistics.css';

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('tfng'); 

  return (
    <div className="statistics-container">
      <h1 className="statistics-title">IELTS Reading Analysis</h1>
      
      <div className="stat-tabs">
        <button 
          className={`tab-button ${activeTab === 'tfng' ? 'active' : ''}`}
          onClick={() => setActiveTab('tfng')}
        >
          True/False/Not Given
        </button>
        <button 
          className={`tab-button ${activeTab === 'ynng' ? 'active' : ''}`}
          onClick={() => setActiveTab('ynng')}
        >
          Yes/No/Not Given
        </button>
      </div>
      
      <div className="stats-analysis">
        <h2>Question Type Analysis</h2>
        {activeTab === 'tfng' ? (
          <div>
            <p>
              True/False/Not Given questions test your ability to identify whether the given statements 
              match the information in the reading passage.
            </p>
            <ul>
              <li><strong>True</strong> - The statement agrees with the information in the text</li>
              <li><strong>False</strong> - The statement contradicts the information in the text</li>
              <li><strong>Not Given</strong> - The information is not mentioned in the text</li>
            </ul>
            
            <h3>Common Challenges</h3>
            <p>
              Most test-takers struggle with "Not Given" answers. There's a tendency to bring outside 
              knowledge into the analysis rather than strictly using the information in the passage.
            </p>
            
            <h3>Current Trends</h3>
            <p>
              Recent IELTS exams show an increase in TFNG questions in academic passages, particularly 
              in science and historical topics. Examiners are increasingly designing questions where the 
              distinction between "False" and "Not Given" requires careful reading.
            </p>
          </div>
        ) : (
          <div>
            <p>
              Yes/No/Not Given questions test your ability to recognize the writer's views or claims in 
              the reading passage.
            </p>
            <ul>
              <li><strong>Yes</strong> - The statement reflects the writer's views or claims</li>
              <li><strong>No</strong> - The statement contradicts the writer's views or claims</li>
              <li><strong>Not Given</strong> - The writer's view is not stated on this matter</li>
            </ul>
            
            <h3>Common Challenges</h3>
            <p>
              Many test-takers confuse "No" with "Not Given" answers. Remember that "No" means the text 
              explicitly contradicts the statement, while "Not Given" means the writer doesn't express a 
              view on the matter.
            </p>
            
            <h3>Current Trends</h3>
            <p>
              Recent YNNG questions often focus on the writer's opinions about controversial topics. 
              They frequently appear in passages discussing social issues, environmental concerns, 
              and technological developments.
            </p>
          </div>
        )}
      </div>
      
      <div className="stats-tips">
        <h2>Improvement Tips</h2>
        {activeTab === 'tfng' ? (
          <ul>
            <li>
              <strong>Read the statements first</strong> - Before reading the passage, familiarize 
              yourself with the statements to know what information to look for.
            </li>
            <li>
              <strong>Focus on key words</strong> - Identify key nouns, verbs, and qualifiers in both 
              the statements and the passage.
            </li>
            <li>
              <strong>For "Not Given" answers</strong> - Be strict about only using information from the 
              text. If you find yourself making assumptions or using outside knowledge, it's likely "Not Given".
            </li>
            <li>
              <strong>Watch for qualifiers</strong> - Words like "all", "always", "never", "most" can 
              change the meaning significantly.
            </li>
            <li>
              <strong>Practice paraphrasing</strong> - Information in the passage is often expressed 
              differently from the statement.
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <strong>Identify the writer's voice</strong> - Pay attention to expressions that signal 
              the writer's opinion versus factual statements or others' opinions.
            </li>
            <li>
              <strong>Look for opinion markers</strong> - Words like "I believe", "clearly", "should", 
              "must" often indicate the writer's view.
            </li>
            <li>
              <strong>Distinguish between facts and opinions</strong> - YNNG questions specifically focus 
              on the writer's views, not general facts presented in the text.
            </li>
            <li>
              <strong>Check for implicit views</strong> - Sometimes the writer's opinion is implied rather 
              than explicitly stated.
            </li>
            <li>
              <strong>Avoid overthinking</strong> - If the writer hasn't expressed a view on the specific 
              matter in the statement, the answer is "Not Given".
            </li>
          </ul>
        )}
      </div>
      
      <div className="stats-trends">
        <h2>Practice Recommendations</h2>
        <p>
          Based on current IELTS trends, we recommend focusing on the following types of practice:
        </p>
        {activeTab === 'tfng' ? (
          <ul>
            <li>Academic articles from fields like environmental science, psychology, and archaeology</li>
            <li>Passages with technical language and specialized terminology</li>
            <li>Comparative texts discussing historical developments</li>
            <li>Texts with data, statistics, and research findings</li>
            <li>Passages with subtle distinctions that might be easily misinterpreted</li>
          </ul>
        ) : (
          <ul>
            <li>Opinion pieces from quality newspapers and magazines</li>
            <li>Review articles evaluating research or developments</li>
            <li>Academic texts that present multiple viewpoints</li>
            <li>Articles discussing controversial social or technological issues</li>
            <li>Passages that mix factual information with the author's assessment</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Statistics;