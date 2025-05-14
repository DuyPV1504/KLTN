import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { 
  ChevronLeft, Search, AlertCircle, 
  ExternalLink, RefreshCw, FileText, ArrowLeft, ArrowRight
} from "lucide-react";
import "../../styles/history.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const History = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found, redirecting to login");
          navigate('/login');
          return;
        }

        console.log("Fetching history with params:", { 
          activeTab, 
          searchQuery, 
          sortBy, 
          currentPage 
        });

        const params = new URLSearchParams();
        if (activeTab !== "all") {
          params.append('practiceType', activeTab.toUpperCase());
        }
        if (searchQuery) params.append('search', searchQuery);
        params.append('sortBy', sortBy);
        params.append('page', currentPage);
        params.append('limit', 5);
        
        console.log("API URL:", `${API_URL}/api/history?${params.toString()}`);

        const response = await axios.get(`${API_URL}/api/history?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log("History API response:", response.data);
        
        setHistory(response.data.history);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch history:", err.response?.data || err.message);
        setError("Failed to load your practice history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeTab, searchQuery, sortBy, currentPage, navigate]);

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

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [minutes, seconds] = timeString.split(':');
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString) => {
    return "No date available";
  };

  const isHistoryEmpty = history.length === 0 && !loading;

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

        {loading && (
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <h2 className="empty-title">Loading history...</h2>
          </div>
        )}

        {error && !loading && (
          <div className="empty-state">
            <AlertCircle className="empty-icon" />
            <h2 className="empty-title">Error loading history</h2>
            <p className="empty-description">{error}</p>
            <Button 
              className="start-button"
              onClick={() => {
                setCurrentPage(1);
                setError(null);
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="history-list">
            {history.length === 0 ? (
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
              history.map((item) => (
                <div className="history-card" key={item._id}>
                  <div className="history-title">
                    <h3>Score: {item.score}</h3>
                    <p className="tag">{item.practiceType}</p>
                  </div>
                  <p className="paragraph">{item.passage.slice(0, 200)}...</p>

                  <div className="button-group">
                    <Button 
                      className="card-button view-button"
                      onClick={() => navigate(`/history/${item._id}`)}
                    >
                      <ExternalLink size={16} />
                      <span>View Details</span>
                    </Button>
                    <Button 
                      className="card-button retry-button"
                      onClick={() => navigate(`/practice/${item._id}/retry`)}
                    >
                      <RefreshCw size={16} />
                      <span>Retry</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && !error && history.length > 0 && pagination.totalPages > 1 && (
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

export default History;