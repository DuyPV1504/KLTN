import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Upload, Clipboard, Loader2 } from "lucide-react";
import "../../styles/practice.css";

const Practice = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState(null); 
  const [file, setFile] = useState(null);

  const handleTextUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
    };
    reader.readAsText(uploadedFile);
  };

  const handleGenerateQuestions = async () => {
    if (!text.trim() || !questionType) return;
    
    setLoading(true);
    try {
      console.log(`Generating ${questionType === "tfng" ? "True/False/Not Given" : "Yes/No/Not Given"} questions`);
      
      setTimeout(() => {
        
        const mockQuestions = [
          { 
            id: 1, 
            text: "Question 1", 
            correctAnswer: questionType === "tfng" ? "True" : "Yes" 
          },
          { 
            id: 2, 
            text: "Question 2", 
            correctAnswer: questionType === "tfng" ? "False" : "No" 
          },
          { 
            id: 3, 
            text: "Question 3", 
            correctAnswer: "Not Given" 
          },
          
        ];
        
        setQuestions(mockQuestions);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating questions:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            IELTS Reading Practice Generator
          </h1>
          
          {!questions.length && (
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Question Type:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className={`p-6 rounded-xl text-lg ${
                    questionType === "tfng"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setQuestionType("tfng")}
                >
                  True / False / Not Given
                </Button>
                <Button
                  className={`p-6 rounded-xl text-lg ${
                    questionType === "ynng"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setQuestionType("ynng")}
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
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Paste your reading passage here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label 
                      htmlFor="file-upload" 
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span>{file ? file.name : "Upload text file"}</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.doc,.docx,.pdf"
                        className="hidden"
                        onChange={handleTextUpload}
                      />
                    </label>
                  </div>
                  
                  <Button
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl md:w-auto"
                    onClick={() => {
                      navigator.clipboard.readText().then(clipText => {
                        setText(clipText);
                      });
                    }}
                  >
                    <Clipboard className="w-5 h-5" />
                    Paste from Clipboard
                  </Button>
                </div>
                
                <Button
                  className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-medium disabled:opacity-50"
                  disabled={!text.trim() || loading}
                  onClick={handleGenerateQuestions}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    `Generate ${
                      questionType === "tfng"
                        ? "True/False/Not Given"
                        : "Yes/No/Not Given"
                    } Questions`
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {questions.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {questionType === "tfng" ? "True/False/Not Given" : "Yes/No/Not Given"} Questions
              </h2>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-xl max-h-64 overflow-y-auto">
                <h3 className="font-semibold mb-2">Reading Passage:</h3>
                <p className="whitespace-pre-line">{text}</p>
              </div>
              
              <div className="space-y-6 mb-8">
                {questions.map((question) => (
                  <div 
                    key={question.id} 
                    className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm"
                  >
                    <p className="text-lg mb-4">{question.text}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {questionType === "tfng" 
                        ? ["True", "False", "Not Given"].map((option) => (
                            <Button
                              key={option}
                              className={`px-6 py-3 rounded-lg ${
                                question.correctAnswer === option
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {option}
                            </Button>
                          ))
                        : ["Yes", "No", "Not Given"].map((option) => (
                            <Button
                              key={option}
                              className={`px-6 py-3 rounded-lg ${
                                question.correctAnswer === option
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {option}
                            </Button>
                          ))
                      }
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl"
                  onClick={() => {
                    setQuestions([]);
                    setQuestionType(null);
                    setText("");
                    setFile(null);
                  }}
                >
                  Start Over
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                  onClick={() => {
                    // Save results to history
                    console.log("Saving to history");
                    navigate("/history");
                  }}
                >
                  Save Results
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;