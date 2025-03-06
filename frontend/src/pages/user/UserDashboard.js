import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  Search, BookOpen, BarChart2, Clock, FileText, 
  HelpCircle, User, LogOut, Menu, X 
} from "lucide-react";
import "../../styles/user.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const handleTipsClick = () => {
    setShowTipsModal(true);
  };
  
  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="main-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => navigate('/user')}>
            <img src="/doraemon.jpg" alt="IELTS Practice" className="logo-image" />
            <span className="logo-text">IELTS Practice</span>
          </div>

          <nav className="desktop-nav">
            <Button className="nav-link" onClick={() => navigate('/')}>Home</Button>
            <Button className="nav-link" onClick={handleTipsClick}>Tips & Guides</Button>
            <Button className="nav-link" onClick={handleHelpClick}>Help</Button>
          </nav>

          <div className="user-controls">
            <Button className="user-button" onClick={() => navigate('/profile')}>
              <User size={18} />
              <span>Profile</span>
            </Button>
            <Button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>

          <Button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            <Button className="mobile-nav-link" onClick={() => navigate('/')}>Home</Button>
            <Button className="mobile-nav-link" onClick={handleTipsClick}>Tips & Guides</Button>
            <Button className="mobile-nav-link" onClick={handleHelpClick}>Help</Button>
            <Button className="mobile-nav-link" onClick={() => navigate('/profile')}>Profile</Button>
            <Button className="mobile-nav-link" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </header>

      {showTipsModal && (
        <div className="modal-backdrop" onClick={() => setShowTipsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tips & Guides</h2>
              <Button className="close-button" onClick={() => setShowTipsModal(false)}>
                <X size={24} />
              </Button>
            </div>
            <div className="modal-body">
              <div className="guide-section">
                <h3>Getting Started</h3>
                <ul className="guide-list">
                  <li>
                    <strong>Start Practice:</strong> Click the "Start Practice" button on your dashboard to begin a new practice session.
                  </li>
                  <li>
                    <strong>Choose Question Type:</strong> Select between "True/False/Not Given" or "Yes/No/Not Given" question formats.
                  </li>
                  <li>
                    <strong>Enter Text:</strong> You can paste text directly, upload a file, or use your clipboard content.
                  </li>
                </ul>
              </div>

              <div className="guide-section">
                <h3>Viewing History</h3>
                <ul className="guide-list">
                  <li>
                    <strong>Access History:</strong> Click the "History" card on your dashboard.
                  </li>
                  <li>
                    <strong>View Past Results:</strong> Your practice sessions are organized by date and score.
                  </li>
                  <li>
                    <strong>Review Answers:</strong> Click on any history item to review your answers and explanations.
                  </li>
                </ul>
              </div>

              <div className="guide-section">
                <h3>Tracking Progress</h3>
                <ul className="guide-list">
                  <li>
                    <strong>Statistics:</strong> Click the "Statistics" card to view your performance trends.
                  </li>
                  <li>
                    <strong>Performance Analysis:</strong> See your accuracy by question type and topic.
                  </li>
                  <li>
                    <strong>Progress Tracking:</strong> Monitor your improvement over time with visual charts.
                  </li>
                </ul>
              </div>

              <div className="guide-section">
                <h3>Getting Advice</h3>
                <ul className="guide-list">
                  <li>
                    <strong>Access Tips:</strong> Click the "Advice & Tips" card to see strategies for IELTS reading.
                  </li>
                  <li>
                    <strong>Strategy Guides:</strong> Learn effective approaches for different question types.
                  </li>
                  <li>
                    <strong>Time Management:</strong> Find tips for managing your time during the actual IELTS test.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div className="modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Help & Support</h2>
              <Button className="close-button" onClick={() => setShowHelpModal(false)}>
                <X size={24} />
              </Button>
            </div>
            <div className="modal-body">
              <div className="help-section">
                <h3>Account Issues</h3>
                <div className="help-item">
                  <h4>Forgot Password</h4>
                  <p>
                    If you've forgotten your password, go to the login page and click "Forgot Password". 
                    Enter your email address to receive a password reset link.
                  </p>
                </div>
                <div className="help-item">
                  <h4>Update Account Information</h4>
                  <p>
                    To update your profile information, click on the "Profile" button in the top navigation bar.
                    From there, you can edit your personal details.
                  </p>
                </div>
              </div>

              <div className="help-section">
                <h3>Technical Support</h3>
                <div className="help-item">
                  <h4>Text Upload Issues</h4>
                  <p>
                    If you're having trouble uploading text files, ensure they are in .txt, .doc, or .docx format and under 5MB in size.
                  </p>
                </div>
                <div className="help-item">
                  <h4>Application Not Responding</h4>
                  <p>
                    If the application becomes unresponsive, try refreshing the page. If the problem persists,
                    clear your browser cache and cookies, then try again.
                  </p>
                </div>
              </div>

              <div className="help-section">
                <h3>Practice Questions</h3>
                <div className="help-item">
                  <h4>Results Not Saving</h4>
                  <p>
                    If your practice results aren't being saved, ensure you're logged in and have a stable internet connection.
                    Click the "Save Results" button after completing a practice session.
                  </p>
                </div>
                <div className="help-item">
                  <h4>Question Generation Issues</h4>
                  <p>
                    If questions aren't being generated properly, try using shorter text passages or check that your text
                    doesn't contain special formatting that might interfere with processing.
                  </p>
                </div>
              </div>

              <div className="help-section">
                <h3>Contact Support</h3>
                <div className="help-item">
                  <p>
                    If you need further assistance, please email us at <a href="mailto:support@ieltspractice.com">support@ieltspractice.com</a> or
                    use the form below to submit a support ticket.
                  </p>
                  <div className="contact-form">
                    <input type="text" placeholder="Subject" className="support-input" />
                    <textarea placeholder="Describe your issue in detail..." className="support-textarea"></textarea>
                    <Button className="submit-ticket-button">Submit Support Ticket</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        className="dashboard-container" 
        style={{ 
          backgroundImage: "url('/wallpaper.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="content-wrapper">
          <div className="header">
            <h1 className="dashboard-title">IELTS Reading Practice</h1>
            <p className="dashboard-subtitle">Improve your reading skills with customized practice</p>
            
            <div className="search-container">
              <div className="search-bar">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search previous tests..." 
                  className="search-input"
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  className="find-button"
                  onClick={handleSearch}
                >
                  Find
                </Button>
              </div>
            </div>
          </div>
          
          <div className="practice-button-container">
            <Button 
              className="main-practice-button"
              onClick={() => navigate('/practice')}
            >
              <FileText className="button-icon" />
              <span>Start Practice</span>
            </Button>
          </div>
          
          <div className="navigation-grid">
            <div 
              className="nav-card"
              onClick={() => navigate('/history')}
            >
              <div className="icon-wrapper bg-purple-100">
                <Clock className="feature-icon text-purple-600" />
              </div>
              <h2 className="feature-title">History</h2>
              <p className="feature-description">View your previous practice sessions and scores</p>
            </div>
            
            <div 
              className="nav-card"
              onClick={() => navigate('/statistics')}
            >
              <div className="icon-wrapper bg-orange-100">
                <BarChart2 className="feature-icon text-orange-600" />
              </div>
              <h2 className="feature-title">Statistics</h2>
              <p className="feature-description">Track your performance and progress</p>
            </div>
            
            <div 
              className="nav-card"
              onClick={() => navigate('/advice')}
            >
              <div className="icon-wrapper bg-green-100">
                <HelpCircle className="feature-icon text-green-600" />
              </div>
              <h2 className="feature-title">Advice & Tips</h2>
              <p className="feature-description">Learn strategies and tips to improve your IELTS reading skills</p>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default UserDashboard;