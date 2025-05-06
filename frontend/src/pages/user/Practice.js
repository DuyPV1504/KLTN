import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  ArrowLeft, Upload, Clipboard, Loader2,
  HelpCircle, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Clock, AlertCircle
} from "lucide-react";
import axios from "axios";
import "../../styles/practice.css";

const API_URL = process.env.REACT_APP_API_URL || '';

const Practice = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState(null); 
  const [file, setFile] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsViewed, setResultsViewed] = useState(false);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  useEffect(() => {
    if (submitted && !resultsViewed) {
      setShowResultsModal(true);
    }
  }, [submitted, resultsViewed]);

  const handleTextUpload = (e) => {
    setErrorMessage("");
    const uploadedFile = e.target.files[0];
    
    if (!uploadedFile) return;
    
    const validTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(uploadedFile.type)) {
      setErrorMessage("Invalid file type. Please upload a .txt, .doc, .docx, or .pdf file.");
      return;
    }
    
    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file. Please try again.");
    };
    reader.readAsText(uploadedFile);
  };

  const handleGenerateQuestions = async () => {
    if (!text.trim() || !questionType) return;
  
    setLoading(true);
    setErrorMessage("");
    setGenerationProgress(10);
  
    // Khai báo biến để lưu interval ID
    let progressInterval;
  
    try {
      console.log(
        `Generating ${
          questionType === "TFNG"
            ? "True/False/Not Given"
            : "Yes/No/Not Given"
        } questions`
      );
  
      // Cập nhật progress trong khi chờ API
      progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
  
      // Lấy token trước khi gọi API
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
  
      // Thực sự gọi API
      const response = await axios.post(
        `${API_URL}/api/practice/generate`,
        { text, questionType, num_questions: 6 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Clear progress và đẩy lên 100%
      clearInterval(progressInterval);
      setGenerationProgress(100);
  
      // Xử lý kết quả trả về
      const generatedQuestions = response.data.questions;
      setQuestions(generatedQuestions);
      setUserAnswers({});
      setSubmitted(false);
  
      // Khởi tạo timer cho session
      const timeLimit = 20 * 60; // 20 phút
      setTimeRemaining(timeLimit);
      const newTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(newTimer);
            setSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(newTimer);
  
    } catch (error) {
      // Khi có lỗi, vẫn clear interval và show error
      if (progressInterval) clearInterval(progressInterval);
      console.error("Error generating questions:", error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Failed to generate questions. Please try again."
      );
      setGenerationProgress(0);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (questionId, answer) => {
    if (submitted) return; 
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (timer) clearInterval(timer);
    setSubmitted(true);
    setShowResultsModal(true);
    setResultsViewed(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    if (!submitted || questions.length === 0) return 0;
    
    const correctCount = questions.filter(q => 
      userAnswers[q.id] === q.correctAnswer
    ).length;
    
    return Math.round((correctCount / questions.length) * 100);
  };
  
  const getScoreStats = () => {
    if (!submitted || questions.length === 0) return { correct: 0, incorrect: 0, unanswered: 0 };
    
    const stats = {
      correct: 0,
      incorrect: 0,
      unanswered: 0
    };
    
    questions.forEach(q => {
      if (!userAnswers[q.id]) {
        stats.unanswered++;
      } else if (userAnswers[q.id] === q.correctAnswer) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    });
    
    return stats;
  };

  const getAnswerStatus = (question) => {
    if (!submitted) return null;
    if (!userAnswers[question.id]) return "unanswered";
    return userAnswers[question.id] === question.correctAnswer ? "correct" : "incorrect";
  };

  const toggleExplanation = (questionId) => {
    setExpandedExplanation(expandedExplanation === questionId ? null : questionId);
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
    setResultsViewed(true);
  };

  const handleSaveResults = async () => {
    try {
      // Get token for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      // Prepare data for saving
      const resultsData = {
        passage: text,
        practiceType: questionType,
        score: calculateScore(),
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswers[q.id] || null,
          explanation: q.explanation
        }))
      };
      
      console.log("Saving results:", resultsData);
      
      // Call the API to save results
      const response = await axios.post(
        `${API_URL}/api/practice/save`, 
        resultsData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log("Results saved:", response.data);
      
      // Navigate to the history page to view the saved result
      navigate("/history");
      
    } catch (error) {
      console.error("Error saving results:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save results. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate('/user')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className={`bg-white rounded-lg shadow-md p-6 mb-8 ${showResultsModal ? 'filter blur-sm' : ''}`}>
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
            IELTS Reading Practice
          </h1>
          
          {!questions.length && (
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Question Type:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className={`p-6 rounded-xl text-lg ${
                    questionType === "TFNG"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setQuestionType("TFNG")}
                >
                  True / False / Not Given
                </Button>
                <Button
                  className={`p-6 rounded-xl text-lg ${
                    questionType === "YNNG"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setQuestionType("YNNG")}
                >
                  Yes / No / Not Given
                </Button>
              </div>
            </div>
          )}
          
          {questionType && !questions.length && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Enter or Upload Text:</h2>
              
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Paste your reading passage here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  {text && (
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={() => setText("")}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="Clear text"
                      >
                        <XCircle className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    {text.length > 0 ? `Character count: ${text.length}` : ""}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label 
                      htmlFor="file-upload" 
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{file ? file.name : "Upload text file"}</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.doc,.docx,.pdf"
                        className="hidden"
                        onChange={handleTextUpload}
                      />
                    </label>
                    {file && (
                      <div className="mt-1 text-xs text-gray-500 flex items-center">
                        <button 
                          onClick={() => {setFile(null); setText("");}}
                          className="text-red-500 hover:text-red-700 underline flex items-center"
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Remove file
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl md:w-auto transition-colors"
                    onClick={() => {
                      navigator.clipboard.readText().then(clipText => {
                        setText(clipText);
                      }).catch(err => {
                        setErrorMessage("Failed to access clipboard. Please paste manually.");
                      });
                    }}
                  >
                    <Clipboard className="w-5 h-5" />
                    Paste from Clipboard
                  </Button>
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}
                
                <Button
                  className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-medium disabled:opacity-50 transition-colors"
                  disabled={!text.trim() || loading}
                  onClick={handleGenerateQuestions}
                >
                  {loading ? (
                    <div className="w-full">
                      <div className="flex items-center justify-center mb-1">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Generating Questions...</span>
                      </div>
                      <div className="w-full bg-purple-300 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-300" 
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    `Generate ${
                      questionType === "TFNG"
                        ? "True/False/Not Given"
                        : "Yes/No/Not Given"
                    } Questions`
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    <span>The AI will analyze your text and generate appropriate IELTS questions</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {questions.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    IELTS Reading Task
                  </h2>
                  <p className="text-sm text-gray-600">
                    {questionType === "TFNG" ? "True/False/Not Given" : "Yes/No/Not Given"} Questions
                  </p>
                </div>
                
                {!submitted && timeRemaining > 0 && (
                  <div className="py-2 px-4 bg-blue-100 text-blue-800 rounded-md flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                
                {submitted && resultsViewed && (
                  <div className="py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md shadow-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Score: {calculateScore()}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <div className="bg-white p-5 rounded-md border border-gray-300 mb-6">
                    <div className="font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">
                      Reading Passage
                    </div>
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                      <p className="whitespace-pre-line text-gray-800 leading-relaxed">{text}</p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-md">
                    <p className="text-blue-800 font-medium mb-1">Questions 1-6</p>
                    <p className="text-gray-700 text-sm">
                      Do the following statements agree with the information given in the Reading Passage?
                    </p>
                    <div className="mt-2 text-sm">
                      {questionType === "TFNG" ? (
                        <div className="flex flex-col space-y-1">
                          <p><span className="font-semibold">TRUE</span> if the statement agrees with the information</p>
                          <p><span className="font-semibold">FALSE</span> if the statement contradicts the information</p>
                          <p><span className="font-semibold">NOT GIVEN</span> if there is no information on this</p>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-1">
                          <p><span className="font-semibold">YES</span> if the statement agrees with the claims of the writer</p>
                          <p><span className="font-semibold">NO</span> if the statement contradicts the claims of the writer</p>
                          <p><span className="font-semibold">NOT GIVEN</span> if it is impossible to say what the writer thinks</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {questions.map((question) => {
                      const answerStatus = getAnswerStatus(question);
                      const options = questionType === "TFNG" 
                        ? ["TRUE", "FALSE", "NOT GIVEN"]
                        : ["YES", "NO", "NOT GIVEN"];
                      
                      return (
                        <div 
                          key={question.id} 
                          className={`p-4 border bg-white rounded-md ${
                            submitted && resultsViewed && answerStatus === "correct"
                              ? "border-green-300"
                              : submitted && resultsViewed && answerStatus === "incorrect"
                                ? "border-red-300"
                                : submitted && resultsViewed && answerStatus === "unanswered"
                                  ? "border-amber-300"
                                  : "border-gray-300"
                          }`}
                        >
                          <div className="flex items-start mb-4">
                            <div className="font-bold mr-3 text-blue-800 mt-0.5">
                              {question.id}.
                            </div>
                            <div className="text-gray-800">{question.text}</div>
                          </div>
                          
                          <div className="pl-8 space-y-3">
                            {options.map((option) => {
                              const isSelected = userAnswers[question.id] === option;
                              const isCorrect = submitted && option === question.correctAnswer;
                              
                              return (
                                <div 
                                  key={option}
                                  className={`flex items-center cursor-pointer ${!submitted ? "hover:bg-gray-50" : ""}`}
                                  onClick={() => !submitted && handleAnswerSelect(question.id, option)}
                                >
                                  <div className={`
                                    w-5 h-5 rounded-full border flex items-center justify-center
                                    ${isSelected ? "border-2 border-blue-500" : "border border-gray-400"}
                                    ${submitted && resultsViewed && isCorrect ? "border-2 border-green-500" : ""}
                                  `}>
                                    {isSelected && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    )}
                                  </div>
                                  
                                  <span className={`ml-2 ${
                                    submitted && resultsViewed && isCorrect ? "font-bold text-green-700" :
                                    isSelected ? "font-medium" : ""
                                  }`}>
                                    {option}
                                  </span>
                                  
                                  {submitted && resultsViewed && isSelected && (
                                    isSelected === question.correctAnswer ? (
                                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                                    )
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {submitted && resultsViewed && (
                            <div className="mt-4 pl-8">
                              <button
                                className="flex items-center text-sm text-blue-600"
                                onClick={() => toggleExplanation(question.id)}
                              >
                                <span className="underline">
                                  {expandedExplanation === question.id ? "Hide explanation" : "Show explanation"}
                                </span>
                                {expandedExplanation === question.id ? 
                                  <ChevronUp className="w-4 h-4 ml-1" /> : 
                                  <ChevronDown className="w-4 h-4 ml-1" />
                                }
                              </button>
                              
                              {expandedExplanation === question.id && (
                                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                                  <p className="text-gray-700">{question.explanation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                {!submitted ? (
                  <button
                    className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    onClick={handleSubmit}
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors shadow-sm"
                      onClick={() => {
                        setQuestions([]);
                        setQuestionType(null);
                        setText("");
                        setFile(null);
                        setUserAnswers({});
                        setSubmitted(false);
                        setResultsViewed(false);
                        if (timer) clearInterval(timer);
                        setTimer(null);
                      }}
                    >
                      Practice Again
                    </button>
                    
                    <button
                      className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                      onClick={handleSaveResults}
                    >
                      Save Results
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {showResultsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeResultsModal}></div>
            
            <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-bounce-in">
              <button 
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={closeResultsModal}
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
              
              <div className={`p-5 ${
                calculateScore() >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-600" : 
                calculateScore() >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                "bg-gradient-to-r from-red-500 to-pink-600"
              } text-white`}>
                <h3 className="text-2xl font-bold">Your Results</h3>
                <p className="opacity-80 text-sm mt-1">
                  {questionType === "TFNG" ? "True/False/Not Given" : "Yes/No/Not Given"} Questions
                </p>
              </div>
              
              <div className="p-6 bg-white">
                <div className="flex flex-col items-center gap-5 mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="8"
                      />
                      
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke={calculateScore() >= 70 ? "#10b981" : 
                               calculateScore() >= 50 ? "#f59e0b" : "#ef4444"} 
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * calculateScore()) / 100}
                        style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-gray-800">{calculateScore()}%</span>
                      <span className="text-sm text-gray-500">Score</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-green-600">{getScoreStats().correct}</div>
                        <div className="text-xs text-gray-600">Correct</div>
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-red-600">{getScoreStats().incorrect}</div>
                        <div className="text-xs text-gray-600">Incorrect</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-amber-600">{getScoreStats().unanswered}</div>
                        <div className="text-xs text-gray-600">Unanswered</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  calculateScore() >= 70 ? "bg-green-50 border border-green-200" :
                  calculateScore() >= 50 ? "bg-amber-50 border border-amber-200" :
                  "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-start">
                    {calculateScore() >= 70 
                      ? <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5" /> 
                      : calculateScore() >= 50
                        ? <AlertCircle className="w-5 h-5 mr-3 text-amber-600 mt-0.5" />
                        : <XCircle className="w-5 h-5 mr-3 text-red-600 mt-0.5" />}
                    <div>
                      <p className="font-medium">
                        {calculateScore() >= 70 
                          ? "Excellent work!" 
                          : calculateScore() >= 50
                            ? "Good effort!"
                            : "Keep practicing!"}
                      </p>
                      <p className="text-sm mt-1">
                        {calculateScore() >= 70 
                          ? "You've demonstrated a strong understanding of the IELTS reading format. Continue practicing to maintain your skills." 
                          : calculateScore() >= 50
                            ? "You're making good progress. Review the explanations for questions you missed to improve your score."
                            : "Don't give up! IELTS reading requires practice. Study the explanations carefully to understand where you can improve."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    onClick={closeResultsModal}
                  >
                    View Correct Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;