import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, BarChart2, Settings, 
  LogOut, Menu, X, PlusCircle, Search, 
  Bell, User, Home, BookOpen, ShieldCheck,
  LayoutDashboard, BookOpenCheck, UserPlus,
  Database, BarChart, Activity, HelpCircle,
  AlertCircle, CheckCircle, ChevronDown,
  UserCircle, Edit, Lock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import "../../styles/admin.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsCount] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarUserMenuOpen, setSidebarUserMenuOpen] = useState(false);

  const statistics = {
    users: {
      total: 1204,
      change: 8.2,
      positive: true
    },
    readings: {
      total: 76,
      change: 12.5,
      positive: true
    },
    averageScore: {
      value: 68.4,
      change: 3.7,
      positive: true
    },
    completions: {
      total: 5283,
      change: -2.4,
      positive: false
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminSession");
      navigate("/login");
    }
  };

  const recentUsers = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      dateJoined: "2025-03-01",
      status: "active",
      attempts: 23,
      avgScore: 78
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.g@example.com",
      dateJoined: "2025-02-28",
      status: "active",
      attempts: 17,
      avgScore: 82
    },
    {
      id: 3,
      name: "Thomas Wang",
      email: "thomas.w@example.com",
      dateJoined: "2025-02-25",
      status: "pending",
      attempts: 8,
      avgScore: 65
    },
    {
      id: 4,
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      dateJoined: "2025-02-20",
      status: "inactive",
      attempts: 5,
      avgScore: 59
    }
  ];

  const recentReadings = [
    {
      id: 1,
      title: "Climate Change Impacts on Ocean Ecosystems",
      addedDate: "2025-03-02",
      category: "Environment",
      questionType: "TFNG",
      attempts: 326
    },
    {
      id: 2,
      title: "The History of Modern Computing",
      addedDate: "2025-02-28",
      category: "Technology",
      questionType: "YNNG",
      attempts: 283
    },
    {
      id: 3,
      title: "Advancements in Renewable Energy",
      addedDate: "2025-02-22",
      category: "Science",
      questionType: "TFNG",
      attempts: 197
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="admin-dashboard">
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <ShieldCheck className="admin-logo" />
            <span className="admin-logo-text">IELTS Admin</span>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Main System</h3>
            <ul className="sidebar-menu">
              <li 
                className="sidebar-menu-item active"
                onClick={() => navigate('/admin')}
              >
                <LayoutDashboard className="sidebar-menu-icon" />
                <span>Dashboard</span>
              </li>
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="sidebar-menu-icon" />
                <span>Users Management</span>
              </li>
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/readings')}
              >
                <BookOpenCheck className="sidebar-menu-icon" />
                <span>Reading Passages</span>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Content</h3>
            <ul className="sidebar-menu">
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/add-reading')}
              >
                <PlusCircle className="sidebar-menu-icon" />
                <span>Add New Reading</span>
              </li>
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/add-user')}
              >
                <UserPlus className="sidebar-menu-icon" />
                <span>Add New User</span>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Reports</h3>
            <ul className="sidebar-menu">
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/statistics')}
              >
                <BarChart className="sidebar-menu-icon" />
                <span>Statistics</span>
              </li>
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/activity')}
              >
                <Activity className="sidebar-menu-icon" />
                <span>User Activity</span>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">System</h3>
            <ul className="sidebar-menu">
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="sidebar-menu-icon" />
                <span>Settings</span>
              </li>
              <li 
                className="sidebar-menu-item"
                onClick={() => navigate('/admin/help')}
              >
                <HelpCircle className="sidebar-menu-icon" />
                <span>Help & Documentation</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div 
            className="user-info"
            onClick={() => setSidebarUserMenuOpen(!sidebarUserMenuOpen)}
          >
            <div className="user-avatar">A</div>
            <div className="user-details">
              <div className="user-name">Admin User</div>
              <div className="user-role">System Administrator</div>
            </div>
            <ChevronDown 
              size={16} 
              className={`user-dropdown-icon ${sidebarUserMenuOpen ? 'open' : ''}`}
            />
          </div>
          
          {sidebarUserMenuOpen && (
            <div className="user-dropdown">
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setSidebarUserMenuOpen(false);
                  navigate('/admin/profile');
                }}
              >
                <UserCircle size={16} />
                <span>My Profile</span>
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setSidebarUserMenuOpen(false);
                  navigate('/admin/profile/edit');
                }}
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  setSidebarUserMenuOpen(false);
                  navigate('/admin/change-password');
                }}
              >
                <Lock size={16} />
                <span>Change Password</span>
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item logout-dropdown-item"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
          
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          
          <div className="header-actions">
            <form className="search-form">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
              />
            </form>
            
            <button className="notification-button">
              <Bell size={20} />
              {notificationsCount > 0 && (
                <span className="notification-count">{notificationsCount}</span>
              )}
            </button>
            
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User size={20} />
                <span>Admin</span>
                <ChevronDown 
                  size={16} 
                  className={userMenuOpen ? 'rotate-180' : ''}
                />
              </button>
              
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">A</div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">Admin User</div>
                      <div className="dropdown-user-email">admin@example.com</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/admin/profile');
                    }}
                  >
                    <UserCircle size={16} />
                    <span>My Profile</span>
                  </button>
                  
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/admin/settings');
                    }}
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Total Users</h3>
              <div className="stat-icon-wrapper icon-blue">
                <Users size={20} />
              </div>
            </div>
            <div className="stat-value">{statistics.users.total}</div>
            <div className={`stat-change ${statistics.users.positive ? 'change-positive' : 'change-negative'}`}>
              {statistics.users.positive ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statistics.users.positive ? '+' : ''}{statistics.users.change}% this month</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Reading Passages</h3>
              <div className="stat-icon-wrapper icon-purple">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="stat-value">{statistics.readings.total}</div>
            <div className={`stat-change ${statistics.readings.positive ? 'change-positive' : 'change-negative'}`}>
              {statistics.readings.positive ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statistics.readings.positive ? '+' : ''}{statistics.readings.change}% this month</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Average Score</h3>
              <div className="stat-icon-wrapper icon-green">
                <BarChart2 size={20} />
              </div>
            </div>
            <div className="stat-value">{statistics.averageScore.value}%</div>
            <div className={`stat-change ${statistics.averageScore.positive ? 'change-positive' : 'change-negative'}`}>
              {statistics.averageScore.positive ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statistics.averageScore.positive ? '+' : ''}{statistics.averageScore.change}% improvement</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3 className="stat-title">Test Completions</h3>
              <div className="stat-icon-wrapper icon-orange">
                <FileText size={20} />
              </div>
            </div>
            <div className="stat-value">{statistics.completions.total}</div>
            <div className={`stat-change ${statistics.completions.positive ? 'change-positive' : 'change-negative'}`}>
              {statistics.completions.positive ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{statistics.completions.positive ? '+' : ''}{statistics.completions.change}% this month</span>
            </div>
          </div>
        </div>
        
        <div className="data-section">
          <div className="section-header">
            <h2 className="section-title">Recent Users</h2>
            <button 
              className="view-all-link" 
              onClick={() => navigate('/admin/users')}
            >
              View all users
            </button>
          </div>
          
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Date Joined</th>
                  <th>Attempts</th>
                  <th>Avg. Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="table-avatar">
                          {user.name.charAt(0)}
                        </div>
                        <div className="user-info-cell">
                          <div className="user-name-cell">{user.name}</div>
                          <div className="user-email-cell">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatDate(user.dateJoined)}</td>
                    <td>{user.attempts}</td>
                    <td>{user.avgScore}%</td>
                    <td>
                      <div className="table-action-cell">
                        <Button 
                          className="action-button"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <User size={16} />
                        </Button>
                        <Button 
                          className="action-button"
                          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                        >
                          <Settings size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="data-section">
          <div className="section-header">
            <h2 className="section-title">Recent Reading Passages</h2>
            <button 
              className="view-all-link" 
              onClick={() => navigate('/admin/readings')}
            >
              View all passages
            </button>
          </div>
          
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Question Type</th>
                  <th>Added Date</th>
                  <th>Attempts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReadings.map(reading => (
                  <tr key={reading.id} className="content-row">
                    <td>
                      <div className="content-title">{reading.title}</div>
                    </td>
                    <td>
                      <span className="content-tag">{reading.category}</span>
                    </td>
                    <td>{reading.questionType === "TFNG" ? "True/False/Not Given" : "Yes/No/Not Given"}</td>
                    <td>{formatDate(reading.addedDate)}</td>
                    <td>{reading.attempts}</td>
                    <td>
                      <div className="table-action-cell">
                        <Button 
                          className="action-button"
                          onClick={() => navigate(`/admin/readings/${reading.id}`)}
                        >
                          <BookOpen size={16} />
                        </Button>
                        <Button 
                          className="action-button"
                          onClick={() => navigate(`/admin/readings/${reading.id}/edit`)}
                        >
                          <Settings size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="quick-actions-grid">
          <Button 
            className="quick-action-button create-button"
            onClick={() => navigate('/admin/add-reading')}
          >
            <div className="quick-action-icon">
              <PlusCircle size={24} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Add New Reading</span>
              <span className="quick-action-description">Create a new reading passage with questions</span>
            </div>
          </Button>
          
          <Button 
            className="quick-action-button users-button"
            onClick={() => navigate('/admin/add-user')}
          >
            <div className="quick-action-icon">
              <UserPlus size={24} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Add New User</span>
              <span className="quick-action-description">Create user accounts manually</span>
            </div>
          </Button>
          
          <Button 
            className="quick-action-button stats-button"
            onClick={() => navigate('/admin/statistics')}
          >
            <div className="quick-action-icon">
              <BarChart2 size={24} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">View Statistics</span>
              <span className="quick-action-description">See detailed platform statistics</span>
            </div>
          </Button>
          
          <Button 
            className="quick-action-button settings-button"
            onClick={() => navigate('/admin/settings')}
          >
            <div className="quick-action-icon">
              <Settings size={24} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">System Settings</span>
              <span className="quick-action-description">Configure platform settings</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}