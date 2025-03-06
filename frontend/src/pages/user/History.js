import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  ChevronLeft, Calendar, Search, Filter, 
  Clock, CheckCircle, XCircle, AlertCircle, 
  ExternalLink, RefreshCw, FileText, ArrowLeft, ArrowRight
} from "lucide-react";
import "../../styles/history.css";

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date-desc");
  
  const practiceHistory = [
    {
      id: 1,
      title: "Climate Change Impact on Agriculture",
      date: "2025-03-01",
      questionType: "TFNG",
      totalQuestions: 10,
      correct: 7,
      incorrect: 2,
      notAttempted: 1,
      timeSpent: "12:45",
      tags: ["Environment", "Agriculture", "Scientific"],
      accuracy: 78,
    },
    {
      id: 2,
      title: "History of Modern Computing",
      date: "2025-02-28",
      questionType: "YNNG",
      totalQuestions: 12,
      correct: 9,
      incorrect: 3,
      notAttempted: 0,
      timeSpent: "15:20",
      tags: ["Technology", "History", "Innovation"],
      accuracy: 75,
    },
    {
      id: 3,
      title: "Marine Biology: Ocean Ecosystems",
      date: "2025-02-25",
      questionType: "TFNG",
      totalQuestions: 15,
      correct: 12,
      incorrect: 1,
      notAttempted: 2,
      timeSpent: "18:10",
      tags: ["Biology", "Marine", "Ecosystem"],
      accuracy: 92,
    },
    {
      id: 4,
      title: "Modern Art Movements of the 20th Century",
      date: "2025-02-20",
      questionType: "YNNG",
      totalQuestions: 8,
      correct: 5,
      incorrect: 3,
      notAttempted: 0,
      timeSpent: "10:35",
      tags: ["Art", "Culture", "History"],
      accuracy: 62,
    },
    {
      id: 5,
      title: "Renewable Energy Technologies",
      date: "2025-02-15",
      questionType: "TFNG",
      totalQuestions: 12,
      correct: 10,
      incorrect: 1,
      notAttempted: 1,
      timeSpent: "14:22",
      tags: ["Energy", "Technology", "Environment"],
      accuracy: 83,
    },
  ];

  const filteredByTab = practiceHistory.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "tfng" && item.questionType === "TFNG") return true;
    if (activeTab === "ynng" && item.questionType === "YNNG") return true;
    return false;
  });

  const filteredBySearch = filteredByTab.filter(item => {
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const sortedHistory = [...filteredBySearch].sort((a, b) => {
    switch(sortBy) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "score-desc":
        return b.accuracy - a.accuracy;
      case "score-asc":
        return a.accuracy - b.accuracy;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = sortedHistory.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const isHistoryEmpty = filteredBySearch.length === 0

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    setCurrentPage(1); 
  };

  // Format time function
  const formatTime = (timeString) => {
    const [minutes, seconds] = timeString.split(':');
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="history-container">
      <div className="history-content">
        {/* Header with back button */}
        <div className="history-header">
          <Button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="page-title">Practice History</h1>
        </div>

        {/* Tab Navigation */}
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
            className={`tab-button ${activeTab === 'tfng' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tfng');
              setCurrentPage(1);
            }}
          >
            True/False/Not Given
          </button>
          <button 
            className={`tab-button ${activeTab === 'ynng' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ynng');
              setCurrentPage(1);
            }}
          >
            Yes/No/Not Given
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title or tag..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if(e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button 
              className="filter-button"
              onClick={handleSearch}
            >
              <Search size={16} />
            </Button>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <span className="filter-label">Sort by:</span>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
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

        {/* History List or Empty State */}
        {isHistoryEmpty ? (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <h2 className="empty-title">No practice history found</h2>
            <p className="empty-description">
              {searchQuery || activeTab !== "all" 
                ? "No results match your current filters. Try adjusting your search criteria or reset filters."
                : "You haven't completed any practice sessions yet. Start practicing to build your history."
              }
            </p>
            {searchQuery || activeTab !== "all" ? (
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
          <div className="history-list">
            {paginatedHistory.map((item) => (
              <div className="history-card" key={item.id}>
                <div className="card-header">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-date">
                    <Calendar size={16} />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-value correct">{item.correct}</span>
                      <span className="stat-label">Correct</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-value incorrect">{item.incorrect}</span>
                      <span className="stat-label">Incorrect</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-value not-attempted">{item.notAttempted}</span>
                      <span className="stat-label">Not Attempted</span>
                    </div>
                    
                    <div className="stat-item">
                      <span className="stat-value time-spent">{formatTime(item.timeSpent)}</span>
                      <span className="stat-label">Time Spent</span>
                    </div>
                  </div>
                  
                  <div className="card-tags">
                    <div className="card-tag">
                      {item.questionType === "TFNG" 
                        ? "True/False/Not Given" 
                        : "Yes/No/Not Given"
                      }
                    </div>
                    {item.tags.map((tag, index) => (
                      <div className="card-tag" key={index}>{tag}</div>
                    ))}
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="accuracy-wrapper">
                    <span className="accuracy-label">
                      Accuracy: {item.accuracy}%
                    </span>
                    <div className="accuracy-bar">
                      <div 
                        className="accuracy-fill" 
                        style={{ width: `${item.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Button 
                      className="card-button view-button"
                      onClick={() => navigate(`/history/${item.id}`)}
                    >
                      <ExternalLink size={16} />
                      <span>View Details</span>
                    </Button>
                    
                    <Button 
                      className="card-button retry-button"
                      onClick={() => navigate(`/practice/${item.id}/retry`)}
                    >
                      <RefreshCw size={16} />
                      <span>Retry</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isHistoryEmpty && totalPages > 1 && (
          <div className="pagination">
            <button 
              className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;