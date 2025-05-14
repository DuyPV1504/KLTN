import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  ChevronLeft, Search, AlertCircle, 
  ExternalLink, RefreshCw, FileText, ArrowLeft, ArrowRight,
  Check, X, HelpCircle
} from "lucide-react";
import "../../styles/history.css";

const MOCK_HISTORY_DATA = [
  {
    _id: "hist1",
    score: "4/6",
    practiceType: "TFNG",
    date: "2025-05-05",
    passage: "The concept of sustainable development emerged in the 1980s from scientific studies on the relationship between the environment and society. The 1987 Brundtland Report, 'Our Common Future', defined it as development that meets the needs of the present without compromising the ability of future generations to meet their own needs. This concept recognized the interdependence of economic development, social equity, and environmental protection. Since then, sustainable development has been increasingly incorporated into international agreements and national policies, though implementation remains challenging due to competing priorities and interests.",
    questions: [
      {
        text: "Sustainable development was first defined in scientific studies during the 1980s.",
        correctAnswer: "False",
        userAnswer: "True",
        explanation: "The passage states that the concept emerged in the 1980s from scientific studies, but it was defined by the Brundtland Report in 1987, not by the scientific studies themselves."
      },
      {
        text: "The Brundtland Report recognized that economic development, social equity, and environmental protection are interconnected.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage explicitly states that the concept recognized the interdependence of these three factors."
      },
      {
        text: "Implementation of sustainable development policies has been successful globally.",
        correctAnswer: "False",
        userAnswer: "False",
        explanation: "The passage mentions that implementation remains challenging due to competing priorities and interests."
      },
      {
        text: "The concept of sustainable development was first introduced in international agreements.",
        correctAnswer: "False",
        userAnswer: "False",
        explanation: "According to the passage, the concept emerged from scientific studies, not international agreements."
      },
      {
        text: "The Brundtland Report was published under the title 'Our Common Future'.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage directly states this information."
      }
    ]
  },
  {
    _id: "hist2",
    score: "5/6",
    practiceType: "YNNG",
    date: "2025-05-05",
    passage: "Urban migration presents both challenges and opportunities for cities worldwide. As people move from rural to urban areas seeking better employment and living conditions, cities must adapt their infrastructure and services. Housing shortages, traffic congestion, and environmental degradation are common issues faced by rapidly growing urban centers. However, urbanization also brings increased economic activity, cultural diversity, and opportunities for innovation. Smart city initiatives using technology to improve efficiency and sustainability offer promising solutions to manage urban growth effectively.",
    questions: [
      {
        text: "City need to adapt their infrastructure due to urban migration",
        correctAnswer: "Yes",
        userAnswer: "Yes",
        explanation: "The passage explicitly states that 'cities must adapt their infrastructure and services' as people move from rural to urban areas."
      },
      {
        text: "Urban migration driven primarily by political factors",
        correctAnswer: "Not Given",
        userAnswer: "No",
        explanation: "The passage mentions that people move 'seeking better employment and living conditions', but does not discuss political factors at all, so the information is not given."
      },
      {
        text: "Smart city initiatives aim to address urban growth challenges",
        correctAnswer: "Yes",
        userAnswer: "Yes",
        explanation: "The passage states that smart city initiatives 'offer promising solutions to manage urban growth effectively'."
      },
      {
        text: "Housing shortages more severe than traffic congestion in urban centers",
        correctAnswer: "Not Given",
        userAnswer: "Not Given",
        explanation: "The passage mentions both issues as common problems but does not compare their severity."
      },
      {
        text: "Urbanization lead to decreased cultural diversity",
        correctAnswer: "No",
        userAnswer: "No",
        explanation: "The passage states that urbanization 'brings increased economic activity, cultural diversity, and opportunities for innovation'."
      }
    ]
  },
  {
    _id: "hist3",
    score: "5/6",
    practiceType: "TFNG",
    date: "2025-05-05",
    passage: "Remote work has transformed traditional employment patterns globally. The COVID-19 pandemic accelerated this trend, forcing many organizations to implement work-from-home policies. Studies indicate that remote workers often report higher job satisfaction and productivity, though challenges like isolation and difficulty separating work from personal life remain. Organizations now increasingly adopt hybrid models combining in-office and remote work. This shift has broader implications for urban planning, real estate markets, and regional economic development as worker location becomes more flexible.",
    questions: [
      {
        text: "The COVID-19 pandemic slowed down the adoption of remote work.",
        correctAnswer: "False",
        userAnswer: "False",
        explanation: "The passage states that the pandemic 'accelerated' the trend, not slowed it down."
      },
      {
        text: "Remote workers report higher job satisfaction but lower productivity.",
        correctAnswer: "False",
        userAnswer: "False",
        explanation: "The passage indicates that remote workers report both higher job satisfaction AND higher productivity."
      },
      {
        text: "Hybrid work models combine remote and in-office work.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage explicitly states that organizations 'adopt hybrid models combining in-office and remote work'."
      },
      {
        text: "Remote work has implications for real estate markets.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage mentions that this shift has broader implications for 'real estate markets'."
      },
      {
        text: "Organizations prefer fully remote work over hybrid models.",
        correctAnswer: "Not Given",
        userAnswer: "False",
        explanation: "The passage states that organizations increasingly adopt hybrid models, but does not compare preferences between fully remote and hybrid models."
      }
    ]
  },
  {
    _id: "hist4",
    score: "3/6",
    practiceType: "YNNG",
    date: "2025-05-05",
    passage: "Artificial intelligence (AI) continues to advance rapidly across various fields. Machine learning algorithms now power applications from medical diagnostics to automated translation services. While these technologies offer significant benefits, they also raise important ethical considerations regarding privacy, bias in algorithmic decision-making, and potential impacts on employment. Researchers emphasize the importance of developing AI systems with robust safeguards and transparent processes. As AI becomes more integrated into daily life, ongoing dialogue between technologists, policymakers, and the public will be essential to ensure these tools benefit society broadly.",
    questions: [
      {
        text: "AI development involve ethical considerations about privacy",
        correctAnswer: "Yes",
        userAnswer: "Yes",
        explanation: "The passage explicitly mentions 'ethical considerations regarding privacy' in relation to AI technologies."
      },
      {
        text: "Machine learning algorithms limited to medical applications only",
        correctAnswer: "No",
        userAnswer: "No",
        explanation: "The passage states that these algorithms power applications 'from medical diagnostics to automated translation services', indicating a wide range of applications."
      },
      {
        text: "AI eventually replace all human jobs",
        correctAnswer: "Not Given",
        userAnswer: "Yes",
        explanation: "The passage mentions 'potential impacts on employment' but does not state or imply that AI will replace all human jobs."
      },
      {
        text: "Transparency important in AI system development",
        correctAnswer: "Yes",
        userAnswer: "Not Given",
        explanation: "The passage mentions the importance of developing AI systems with 'transparent processes'."
      },
      {
        text: "Only technologists and policymakers be involved in discussions about AI.",
        correctAnswer: "No",
        userAnswer: "No",
        explanation: "The passage states that dialogue between 'technologists, policymakers, and the public' is essential, indicating that the public should also be involved."
      }
    ]
  },
  {
    _id: "hist5",
    score: "5/6",
    practiceType: "TFNG",
    date: "2025-05-05",
    passage: "Renewable energy adoption has accelerated globally in recent years. Solar and wind power costs have decreased dramatically, making them increasingly competitive with fossil fuel sources. Countries are setting ambitious targets for carbon neutrality, spurring investment in clean energy infrastructure. Despite this progress, challenges remain in grid integration, energy storage, and addressing intermittency issues. Developing nations face unique obstacles in transitioning their energy systems while meeting growing demand. International cooperation and technological innovation will be crucial to achieving a sustainable global energy transition that addresses climate change while ensuring energy access for all.",
    questions: [
      {
        text: "Renewable energy costs have significantly decreased in recent years.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage states that 'Solar and wind power costs have decreased dramatically'."
      },
      {
        text: "Fossil fuels are no longer used in any developed countries.",
        correctAnswer: "Not Given",
        userAnswer: "Not Given",
        explanation: "The passage mentions that renewables are increasingly competitive with fossil fuels but does not state that fossil fuels have been eliminated in any countries."
      },
      {
        text: "Energy storage is a challenge for renewable energy adoption.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage explicitly mentions 'energy storage' as one of the challenges that remain in renewable energy adoption."
      },
      {
        text: "Developing nations have the same energy transition challenges as developed countries.",
        correctAnswer: "False",
        userAnswer: "False",
        explanation: "The passage states that 'Developing nations face unique obstacles in transitioning their energy systems'."
      },
      {
        text: "International cooperation is important for achieving sustainable energy transition.",
        correctAnswer: "True",
        userAnswer: "True",
        explanation: "The passage states that 'International cooperation and technological innovation will be crucial to achieving a sustainable global energy transition'."
      }
    ]
  }
];

const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [minutes, seconds] = timeString.split(':');
  return `${minutes}m ${seconds}s`;
};

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(id ? "detail" : "list");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("score-desc");
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0
  });
  const [historyDetail, setHistoryDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const getMockHistoryPaginated = (page = 1, limit = 5, tab = "all", query = "", sort = "score-desc") => {
    let filteredData = [...MOCK_HISTORY_DATA];
    if (tab !== "all") {
      filteredData = filteredData.filter(item => item.practiceType === tab);
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.passage.toLowerCase().includes(lowerQuery) || 
        item.practiceType.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (sort === "score-desc") {
      filteredData.sort((a, b) => {
        const scoreA = parseInt(a.score.split('/')[0]);
        const scoreB = parseInt(b.score.split('/')[0]);
        return scoreB - scoreA;
      });
    } else if (sort === "score-asc") {
      filteredData.sort((a, b) => {
        const scoreA = parseInt(a.score.split('/')[0]);
        const scoreB = parseInt(b.score.split('/')[0]);
        return scoreA - scoreB;
      });
    }
    
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);
    
    return {
      history: paginatedData,
      pagination: {
        total: totalItems,
        page: page,
        limit: limit,
        totalPages: totalPages
      }
    };
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        
        if (viewMode === "detail" && id) {
          setTimeout(() => {
            const detail = MOCK_HISTORY_DATA.find(item => item._id === id);
            if (detail) {
              setHistoryDetail(detail);
              setError(null);
            } else {
              setError("Practice details not found");
            }
            setLoading(false);
          }, 500);
        } else {
          setTimeout(() => {
            const mockData = getMockHistoryPaginated(
              currentPage, 
              5, 
              activeTab, 
              searchQuery, 
              sortBy
            );
            
            setHistory(mockData.history);
            setPagination(mockData.pagination);
            setError(null);
            setLoading(false);
          }, 500);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
        setError(viewMode === "detail" ? "Failed to load practice details" : "Failed to load your practice history. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, viewMode, activeTab, searchQuery, sortBy, currentPage]);

  
  useEffect(() => {
    setViewMode(id ? "detail" : "list");
  }, [id]);

 
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSortBy("score-desc");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  
  const getAnswerIcon = (userAnswer, correctAnswer) => {
    if (!userAnswer) return <HelpCircle className="text-gray-400" size={20} />;
    if (userAnswer === correctAnswer) return <Check className="text-green-500" size={20} />;
    return <X className="text-red-500" size={20} />;
  };

  const getAnswerClass = (userAnswer, correctAnswer) => {
    if (!userAnswer) return "text-gray-400";
    if (userAnswer === correctAnswer) return "text-green-500 font-medium";
    return "text-red-500 font-medium";
  };

  
  const handleNavigateToDetail = (histId) => {
    setViewMode("detail");
    navigate(`/history/${histId}`);
  };

  const handleNavigateToList = () => {
    setViewMode("list");
    navigate('/history');
  };

  
  if (loading) {
    return (
      <div className="history-container">
        <div className="history-content">
          <div className="history-header">
            <Button 
              className="back-button"
              onClick={() => viewMode === "detail" ? handleNavigateToList() : navigate('/user')}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
              {viewMode === "detail" ? "Back to History" : ""}
            </Button>
            <h1 className="page-title">
              {viewMode === "detail" ? "Practice Details" : "Practice History"}
            </h1>
          </div>
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <h2 className="empty-title">
              {viewMode === "detail" ? "Loading practice details..." : "Loading history..."}
            </h2>
          </div>
        </div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="history-container">
        <div className="history-content">
          <div className="history-header">
            <Button 
              className="back-button"
              onClick={() => viewMode === "detail" ? handleNavigateToList() : navigate('/user')}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
              {viewMode === "detail" ? "Back to History" : ""}
            </Button>
          </div>
          <div className="empty-state">
            <AlertCircle className="empty-icon text-red-500" />
            <h2 className="empty-title">Error</h2>
            <p className="empty-description">{error}</p>
            <Button 
              className="start-button"
              onClick={() => viewMode === "detail" ? handleNavigateToList() : handleResetFilters()}
            >
              {viewMode === "detail" ? "Return to History" : "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  
  if (viewMode === "detail" && historyDetail) {
    return (
      <div className="history-container">
        <div className="history-content">
          <div className="history-header">
            <Button 
              className="back-button"
              onClick={handleNavigateToList}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
              Back to History
            </Button>
            <h1 className="page-title">Practice Details</h1>
          </div>

          <div>
            <div className="history-card">
              <div className="history-title">
                <h3>Score: {historyDetail.score}</h3>
                <div className="flex items-center space-x-3">
                  <p className="tag">{historyDetail.practiceType}</p>
                  <p className="text-sm text-gray-500">{formatDate(historyDetail.date)}</p>
                </div>
              </div>
              
              <div className="my-6">
                <h4 className="text-lg font-semibold mb-2">Passage</h4>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="paragraph">{historyDetail.passage}</p>
                </div>
              </div>
              
              <div className="my-6">
                <h4 className="text-lg font-semibold mb-2">Questions & Answers</h4>
                <div className="space-y-4">
                  {historyDetail.questions.map((q, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex items-start space-x-2">
                        <span className="font-medium text-gray-700">{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{q.text}</p>
                          
                          <div className="mt-3 flex items-center">
                            <div className="flex items-center space-x-2 mr-6">
                              <span className="text-sm font-medium text-gray-600">Your answer:</span>
                              <span className={getAnswerClass(q.userAnswer, q.correctAnswer)}>
                                {q.userAnswer || "Not answered"}
                              </span>
                              {getAnswerIcon(q.userAnswer, q.correctAnswer)}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">Correct answer:</span>
                              <span className="text-blue-600 font-medium">{q.correctAnswer}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Explanation: </span>
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view (default)
  return (
    <div className="history-container">
      <div className="history-content">
        <div className="history-header">
          <Button 
            className="back-button"
            onClick={() => navigate('/user')}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="page-title">Practice History</h1>
        </div>

        <div className="history-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
          >
            All Practice Sessions
          </button>
          <button 
            className={`tab-button ${activeTab === 'TFNG' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('TFNG');
              setCurrentPage(1);
            }}
          >
            True/False/Not Given
          </button>
          <button 
            className={`tab-button ${activeTab === 'YNNG' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('YNNG');
              setCurrentPage(1);
            }}
          >
            Yes/No/Not Given
          </button>
        </div>

        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <span className="filter-label">Sort by:</span>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="score-desc">Score (Highest)</option>
                <option value="score-asc">Score (Lowest)</option>
              </select>
            </div>
            
            <Button 
              className="reset-button"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <h2 className="empty-title">No practice history found</h2>
              <p className="empty-description">
                {activeTab !== "all" 
                  ? "No results match your current filters. Try adjusting your criteria or reset filters."
                  : "You haven't completed any practice sessions yet. Start practicing to build your history."
                }
              </p>
              {activeTab !== "all" ? (
                <Button 
                  className="start-button"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              ) : (
                <Button 
                  className="start-button"
                  onClick={() => navigate('/practice')}
                >
                  Start Practice
                </Button>
              )}
            </div>
          ) : (
            history.map((item) => (
              <div className="history-card" key={item._id}>
                <div className="history-title">
                  <h3>Score: {item.score}</h3>
                  <div className="flex items-center gap-2">
                    <p className="tag">{item.practiceType}</p>
                    <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                  </div>
                </div>
                <p className="paragraph">{item.passage.slice(0, 200)}...</p>
                
                <div className="button-group">
                  <Button 
                    className="view-details-btn"
                    onClick={() => handleNavigateToDetail(item._id)}
                  >
                    <ExternalLink size={18} className="mr-2" />
                    <span>View Details</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={16} />
            </button>
            
            {[...Array(pagination.totalPages)].map((_, index) => (
              <button 
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`page-button ${currentPage === pagination.totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDetail;
