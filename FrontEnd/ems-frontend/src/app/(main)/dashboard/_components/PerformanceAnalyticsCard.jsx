import { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  IconButton, 
  useTheme,
  Grid,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  InputAdornment,
  IconButton as MuiIconButton,
  Snackbar
} from '@mui/material';
import { 
  MoreVert,
  Bolt,
  Add,
  Refresh,
  Close as CloseIcon,
  Schedule,
  Event,
  Notifications,
  Settings,
  Download,
  Upload,
  Search,
  FilterList,
  Bookmark,
  Share,
  Print,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  CalendarToday,
  WorkOutline,
  Home,
  DirectionsCar,
  Restaurant,
  LocalHospital,
  School,
  ShoppingCart,
  Payment,
  Receipt,
  AccountBalance,
  CreditCard,
  Assignment,
  Description,
  Folder,
  CloudUpload,
  CloudDownload,
  Security,
  Lock,
  Visibility,
  VisibilityOff,
  Wifi,
  Bluetooth,
  VolumeUp,
  Brightness4,
  Language,
  Translate,
  Palette,
  Transform,
  Code,
  ContentCopy,
  Check,
  ContentPaste,
  FormatIndentIncrease,
  FormatIndentDecrease,
  Send,
  PlayArrow,
  Stop,
  Refresh as RefreshIcon,
  ColorLens,
  Tune,
  DataObject,
  Storage,
  Api,
  BugReport,
  Build,
  Science,
  Psychology,
  Memory,
  Speed,
  Storage as StorageIcon,
  Cloud,
  NetworkCheck,
  Router,
  Hub,
  DeviceHub,
  Timeline,
  TrendingUp,
  Analytics,
  Assessment,
  ShowChart,
  Edit,
  Delete,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle,
  Warning,
  Error,
  Info,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Person,
  Group,
  Task,
  Star,
  Flag,
  Target,
  Timeline as TimelineIcon,
  BarChart,
  PieChart,
  ShowChart as ShowChartIcon
} from '@mui/icons-material';

export default function QuickActionsCard() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickTools, setShowQuickTools] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Tools state
  const [activeTool, setActiveTool] = useState('code-snippet');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Code Snippet Tool State
  const [codeSnippet, setCodeSnippet] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('javascript');
  const [snippetTitle, setSnippetTitle] = useState('');
  
  // API Tester Tool State
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiBody, setApiBody] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  
  // Password Generator Tool State
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // JSON Formatter Tool State
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  
  // Color Picker Tool State
  const [selectedColor, setSelectedColor] = useState('#1976d2');
  const [colorFormat, setColorFormat] = useState('hex');
  
  // Base64 Tool State
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');

  // Ensure component is mounted on client side to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Realistic quick actions that employees actually use
  const quickActions = [
    {
      id: 'schedule',
      title: 'Schedule Meeting',
      icon: <Schedule />,
      color: 'primary',
      description: 'Book a meeting room or schedule a call',
      action: () => alert('Opening meeting scheduler...')
    },
    {
      id: 'leave',
      title: 'Request Leave',
      icon: <Event />,
      color: 'success',
      description: 'Submit leave application',
      action: () => alert('Opening leave request form...')
    },
    {
      id: 'expense',
      title: 'Submit Expense',
      icon: <Receipt />,
      color: 'warning',
      description: 'Upload expense receipts',
      action: () => alert('Opening expense submission...')
    },
    {
      id: 'report',
      title: 'Generate Report',
      icon: <Description />,
      color: 'info',
      description: 'Create performance reports',
      action: () => alert('Opening report generator...')
    },
    {
      id: 'training',
      title: 'Training Courses',
      icon: <School />,
      color: 'secondary',
      description: 'Access learning materials',
      action: () => alert('Opening training portal...')
    },
    {
      id: 'directory',
      title: 'Employee Directory',
      icon: <WorkOutline />,
      color: 'primary',
      description: 'Find team members',
      action: () => alert('Opening employee directory...')
    }
  ];

  // Useful tools and utilities for software company employees
  const tools = [
    {
      id: 'code-snippet',
      title: 'Code Snippet',
      icon: <Description />,
      description: 'Save and share code snippets',
      component: 'CodeSnippetTool'
    },
    {
      id: 'api-tester',
      title: 'API Tester',
      icon: <FilterList />,
      description: 'Test API endpoints quickly',
      component: 'ApiTesterTool'
    },
    {
      id: 'password-generator',
      title: 'Password Gen',
      icon: <Security />,
      description: 'Generate secure passwords',
      component: 'PasswordGeneratorTool'
    },
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      icon: <Assignment />,
      description: 'Format and validate JSON',
      component: 'JsonFormatterTool'
    },
    {
      id: 'color-picker',
      title: 'Color Picker',
      icon: <Palette />,
      description: 'Pick and convert colors',
      component: 'ColorPickerTool'
    },
    {
      id: 'base64-converter',
      title: 'Base64 Tool',
      icon: <Transform />,
      description: 'Encode/decode Base64',
      component: 'Base64ConverterTool'
    }
  ];

  // Recent activities (mock data)
  const recentActivities = [
    { id: 1, action: 'Generated secure password', time: '2 hours ago', type: 'security' },
    { id: 2, action: 'Tested API endpoint', time: '4 hours ago', type: 'development' },
    { id: 3, action: 'Saved code snippet', time: '1 day ago', type: 'development' },
    { id: 4, action: 'Formatted JSON data', time: '2 days ago', type: 'development' }
  ];

  // Simple interaction handlers
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    action();
  };

  // Tool functions
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    if (chars === '') {
      setSnackbarMessage('Please select at least one character type');
      setSnackbarOpen(true);
      return;
    }
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON: ' + error.message);
      setFormattedJson('');
    }
  };

  const convertBase64 = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      setBase64Output('Error: ' + error.message);
    }
  };

  const testApi = async () => {
    if (!apiUrl) {
      setSnackbarMessage('Please enter a URL');
      setSnackbarOpen(true);
      return;
    }
    
    setIsApiLoading(true);
    try {
      const headers = apiHeaders ? JSON.parse(apiHeaders) : {};
      const body = apiBody ? JSON.parse(apiBody) : null;
      
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      const responseText = await response.text();
      setApiResponse(`Status: ${response.status} ${response.statusText}\n\n${responseText}`);
    } catch (error) {
      setApiResponse('Error: ' + error.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard!');
    setSnackbarOpen(true);
  };

  const handleToolClick = (tool) => {
    setActiveTool(tool.id);
    setShowQuickTools(true);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'security': return <Security />;
      case 'development': return <Code />;
      case 'meeting': return <Schedule />;
      case 'profile': return <WorkOutline />;
      default: return <Assignment />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'security': return 'error.main';
      case 'development': return 'primary.main';
      case 'meeting': return 'info.main';
      case 'profile': return 'success.main';
      default: return 'text.secondary';
    }
  };

  // Show loading state until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Paper elevation={4} sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        minHeight: 400,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
          : 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={40} />
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={4} sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        minHeight: 400,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
          : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
            : '0 12px 40px rgba(0, 0, 0, 0.1)',
        }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bolt sx={{ 
              color: 'primary.main', 
              fontSize: 28
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              fontFamily: 'var(--font-poppins)',
              color: 'text.primary'
            }}>
              Quick Actions & Tools
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh" arrow>
              <IconButton 
                size="small" 
                onClick={handleRefresh}
                disabled={isLoading}
                sx={{ color: 'text.secondary' }}
              >
                {isLoading ? <CircularProgress size={16} /> : <Refresh />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings" arrow>
              <IconButton 
                size="small" 
                onClick={() => setShowSettings(true)}
                sx={{ color: 'text.secondary' }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="More Options" arrow>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Quick Actions Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            fontFamily: 'var(--font-lexend)',
            fontWeight: 500,
            mb: 2
          }}>
            Quick Actions
          </Typography>
          <Grid container spacing={1}>
            {quickActions.map((action) => (
              <Grid item xs={6} md={4} key={action.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : `${action.color}.light`,
                      '& .action-icon': {
                        color: `${action.color}.main`
                      }
                    }
                  }}
                  onClick={() => handleQuickAction(action.action)}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 1
                  }}>
                    <Box sx={{
                      p: 0.5,
                      borderRadius: 1,
                      bgcolor: `${action.color}.light`,
                      color: `${action.color}.main`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      className: 'action-icon'
                    }}>
                      {action.icon}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    fontFamily: 'var(--font-poppins)',
                    mb: 0.5
                  }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    fontFamily: 'var(--font-lexend)',
                    opacity: 0.8,
                    lineHeight: 1.2
                  }}>
                    {action.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tools Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontFamily: 'var(--font-lexend)',
              fontWeight: 500
            }}>
              Useful Tools
            </Typography>
            <Chip 
              label="6 tools" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Grid container spacing={1}>
            {tools.slice(0, 4).map((tool) => (
              <Grid item xs={6} key={tool.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.03)' 
                      : 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2,
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'primary.light',
                      '& .tool-icon': {
                        color: 'primary.main'
                      }
                    }
                  }}
                  onClick={() => handleToolClick(tool)}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1
                  }}>
                    <Box sx={{
                      p: 0.5,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'action.hover',
                      color: theme.palette.mode === 'dark' 
                        ? 'primary.light' 
                        : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      className: 'tool-icon'
                    }}>
                      {tool.icon}
                    </Box>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 500,
                      color: 'text.primary',
                      fontFamily: 'var(--font-poppins)'
                    }}>
                      {tool.title}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Activities */}
        <Box sx={{ 
          p: 2, 
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            fontFamily: 'var(--font-poppins)',
            mb: 1
          }}>
            Recent Activities
          </Typography>
          <List dense sx={{ p: 0 }}>
            {recentActivities.map((activity) => (
              <ListItem key={activity.id} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box sx={{
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: theme.palette.mode === 'dark'
                      ? `${getActivityColor(activity.type)}20`
                      : `${getActivityColor(activity.type)}10`,
                    color: getActivityColor(activity.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getActivityIcon(activity.type)}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ 
                      fontWeight: 500,
                      color: 'text.primary',
                      fontFamily: 'var(--font-poppins)'
                    }}>
                      {activity.action}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary',
                      fontFamily: 'var(--font-lexend)'
                    }}>
                      {activity.time}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Settings Dialog */}
      <Dialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.95)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'var(--font-poppins)',
          fontWeight: 600
        }}>
          Quick Actions Settings
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Enable Notifications"
              sx={{ fontFamily: 'var(--font-lexend)' }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={autoSave} 
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
              }
              label="Auto-save Forms"
              sx={{ fontFamily: 'var(--font-lexend)' }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={darkMode} 
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
              sx={{ fontFamily: 'var(--font-lexend)' }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" sx={{ 
              fontFamily: 'var(--font-poppins)',
              fontWeight: 600,
              mb: 1
            }}>
              Quick Access Preferences
            </Typography>
            
            <FormControl fullWidth size="small">
              <InputLabel>Default Action</InputLabel>
              <Select label="Default Action" defaultValue="schedule">
                <MenuItem value="schedule">Schedule Meeting</MenuItem>
                <MenuItem value="leave">Request Leave</MenuItem>
                <MenuItem value="expense">Submit Expense</MenuItem>
                <MenuItem value="report">Generate Report</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowSettings(false)}
            variant="outlined"
            sx={{ 
              fontFamily: 'var(--font-lexend)',
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              fontFamily: 'var(--font-lexend)',
              borderRadius: 2
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Tools Dialog */}
      <Dialog 
        open={showQuickTools} 
        onClose={() => setShowQuickTools(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.95)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-poppins)',
          fontWeight: 600
        }}>
          Developer Tools
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh" arrow>
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => setShowQuickTools(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTool} 
              onChange={(e, newValue) => setActiveTool(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 3 }}
            >
              {tools.map((tool) => (
                <Tab 
                  key={tool.id}
                  value={tool.id}
                  label={tool.title}
                  icon={tool.icon}
                  iconPosition="start"
                  sx={{ 
                    fontFamily: 'var(--font-lexend)',
                    minHeight: 64
                  }}
                />
              ))}
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {/* Code Snippet Tool */}
            {activeTool === 'code-snippet' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  Code Snippet Manager
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Snippet Title"
                      fullWidth
                      value={snippetTitle}
                      onChange={(e) => setSnippetTitle(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={snippetLanguage}
                        onChange={(e) => setSnippetLanguage(e.target.value)}
                        label="Language"
                      >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                        <MenuItem value="html">HTML</MenuItem>
                        <MenuItem value="css">CSS</MenuItem>
                        <MenuItem value="sql">SQL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(codeSnippet)}
                      >
                        Copy
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<Download />}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Code Snippet"
                      multiline
                      rows={8}
                      fullWidth
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* API Tester Tool */}
            {activeTool === 'api-tester' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  API Tester
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="API URL"
                      fullWidth
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://api.example.com/endpoint"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Method</InputLabel>
                      <Select
                        value={apiMethod}
                        onChange={(e) => setApiMethod(e.target.value)}
                        label="Method"
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                        <MenuItem value="PATCH">PATCH</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Headers (JSON)"
                      multiline
                      rows={3}
                      fullWidth
                      value={apiHeaders}
                      onChange={(e) => setApiHeaders(e.target.value)}
                      placeholder='{"Authorization": "Bearer token"}'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Request Body (JSON)"
                      multiline
                      rows={3}
                      fullWidth
                      value={apiBody}
                      onChange={(e) => setApiBody(e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      startIcon={isApiLoading ? <CircularProgress size={16} /> : <Send />}
                      onClick={testApi}
                      disabled={isApiLoading}
                      sx={{ mb: 2 }}
                    >
                      {isApiLoading ? 'Testing...' : 'Test API'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Response"
                      multiline
                      rows={6}
                      fullWidth
                      value={apiResponse}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Password Generator Tool */}
            {activeTool === 'password-generator' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  Password Generator
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Password Length: {passwordLength}
                    </Typography>
                    <Slider
                      value={passwordLength}
                      onChange={(e, value) => setPasswordLength(value)}
                      min={8}
                      max={32}
                      marks
                      sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeUppercase} 
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                          />
                        }
                        label="Include Uppercase (A-Z)"
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeLowercase} 
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                          />
                        }
                        label="Include Lowercase (a-z)"
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeNumbers} 
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                          />
                        }
                        label="Include Numbers (0-9)"
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeSymbols} 
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                          />
                        }
                        label="Include Symbols (!@#$%^&*)"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button 
                      variant="contained" 
                      onClick={generatePassword}
                      sx={{ mb: 2 }}
                    >
                      Generate Password
                    </Button>
                    {generatedPassword && (
                      <Box>
                        <TextField
                          label="Generated Password"
                          fullWidth
                          value={generatedPassword}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <MuiIconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </MuiIconButton>
                                <MuiIconButton
                                  onClick={() => copyToClipboard(generatedPassword)}
                                  edge="end"
                                >
                                  <ContentCopy />
                                </MuiIconButton>
                              </InputAdornment>
                            ),
                            type: showPassword ? 'text' : 'password'
                          }}
                          sx={{ mb: 2 }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Password Strength: {generatedPassword.length >= 12 ? 'Strong' : generatedPassword.length >= 8 ? 'Medium' : 'Weak'}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* JSON Formatter Tool */}
            {activeTool === 'json-formatter' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  JSON Formatter & Validator
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<FormatIndentIncrease />}
                        onClick={formatJson}
                      >
                        Format
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(formattedJson)}
                        disabled={!formattedJson}
                      >
                        Copy
                      </Button>
                    </Box>
                    <TextField
                      label="Input JSON"
                      multiline
                      rows={12}
                      fullWidth
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      error={!!jsonError}
                      helperText={jsonError}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Formatted JSON"
                      multiline
                      rows={12}
                      fullWidth
                      value={formattedJson}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Color Picker Tool */}
            {activeTool === 'color-picker' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  Color Picker & Converter
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Pick a Color
                      </Typography>
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        style={{ width: '100%', height: 50, borderRadius: 8 }}
                      />
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Color Format</InputLabel>
                      <Select
                        value={colorFormat}
                        onChange={(e) => setColorFormat(e.target.value)}
                        label="Color Format"
                      >
                        <MenuItem value="hex">HEX</MenuItem>
                        <MenuItem value="rgb">RGB</MenuItem>
                        <MenuItem value="hsl">HSL</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(selectedColor)}
                      >
                        Copy Color
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Color Preview
                      </Typography>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: 100, 
                          bgcolor: selectedColor,
                          borderRadius: 2,
                          border: 1,
                          borderColor: 'divider',
                          mb: 2
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        HEX: {selectedColor}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        RGB: {(() => {
                          const r = parseInt(selectedColor.slice(1, 3), 16);
                          const g = parseInt(selectedColor.slice(3, 5), 16);
                          const b = parseInt(selectedColor.slice(5, 7), 16);
                          return `rgb(${r}, ${g}, ${b})`;
                        })()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Base64 Converter Tool */}
            {activeTool === 'base64-converter' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)' }}>
                  Base64 Encoder/Decoder
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button 
                        variant={base64Mode === 'encode' ? 'contained' : 'outlined'}
                        onClick={() => setBase64Mode('encode')}
                      >
                        Encode
                      </Button>
                      <Button 
                        variant={base64Mode === 'decode' ? 'contained' : 'outlined'}
                        onClick={() => setBase64Mode('decode')}
                      >
                        Decode
                      </Button>
                    </Box>
                    <TextField
                      label={`Input (${base64Mode === 'encode' ? 'Text' : 'Base64'})`}
                      multiline
                      rows={6}
                      fullWidth
                      value={base64Input}
                      onChange={(e) => setBase64Input(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={convertBase64}
                      sx={{ mb: 2 }}
                    >
                      {base64Mode === 'encode' ? 'Encode' : 'Decode'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(base64Output)}
                        disabled={!base64Output}
                      >
                        Copy
                      </Button>
                    </Box>
                    <TextField
                      label={`Output (${base64Mode === 'encode' ? 'Base64' : 'Text'})`}
                      multiline
                      rows={6}
                      fullWidth
                      value={base64Output}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setShowQuickTools(false)}
            variant="outlined"
            sx={{ 
              fontFamily: 'var(--font-lexend)',
              borderRadius: 2
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
} 