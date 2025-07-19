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
  
  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Opened Developer Tools', time: 'Just now', type: 'development' }
  ]);
  
  // Code Snippet Tool State
  const [codeSnippet, setCodeSnippet] = useState('System.out.println("Hello World");');
  const [snippetLanguage, setSnippetLanguage] = useState('java');
  const [snippetTitle, setSnippetTitle] = useState('Sample Java Code');
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // API Tester Tool State
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiHeaders, setApiHeaders] = useState('{"Content-Type": "application/json"}');
  const [apiBody, setApiBody] = useState('{"title": "Sample Post", "body": "This is a test post"}');
  const [apiResponse, setApiResponse] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [savedApiRequests, setSavedApiRequests] = useState([]);
  const [selectedApiRequest, setSelectedApiRequest] = useState(null);
  const [isEditingApi, setIsEditingApi] = useState(false);
  
  // Password Generator Tool State
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('Kj9#mN2$pL8@');
  const [showPassword, setShowPassword] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState([]);
  
  // JSON Formatter Tool State
  const [jsonInput, setJsonInput] = useState('{"name":"John Doe","age":30,"city":"New York","skills":["JavaScript","React","Node.js"]}');
  const [formattedJson, setFormattedJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [savedJsonSnippets, setSavedJsonSnippets] = useState([]);
  const [selectedJsonSnippet, setSelectedJsonSnippet] = useState(null);
  const [isEditingJson, setIsEditingJson] = useState(false);
  
  // Color Picker Tool State
  const [selectedColor, setSelectedColor] = useState('#1976d2');
  const [colorFormat, setColorFormat] = useState('hex');
  const [savedColors, setSavedColors] = useState([]);
  
  // Base64 Tool State
  const [base64Input, setBase64Input] = useState('Hello World!');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  const [savedBase64Conversions, setSavedBase64Conversions] = useState([]);
  const [selectedBase64Conversion, setSelectedBase64Conversion] = useState(null);
  const [isEditingBase64, setIsEditingBase64] = useState(false);

  // Ensure component is mounted on client side to prevent hydration issues
  useEffect(() => {
    setMounted(true);
    // Load saved data from localStorage
    const savedSnippetsData = localStorage.getItem('codeSnippets');
    const savedApiRequestsData = localStorage.getItem('apiRequests');
    const savedPasswordsData = localStorage.getItem('savedPasswords');
    const savedJsonSnippetsData = localStorage.getItem('jsonSnippets');
    const savedColorsData = localStorage.getItem('savedColors');
    const savedBase64ConversionsData = localStorage.getItem('base64Conversions');
    
    if (savedSnippetsData) {
      setSavedSnippets(JSON.parse(savedSnippetsData));
    }
    if (savedApiRequestsData) {
      setSavedApiRequests(JSON.parse(savedApiRequestsData));
    }
    if (savedPasswordsData) {
      setSavedPasswords(JSON.parse(savedPasswordsData));
    }
    if (savedJsonSnippetsData) {
      setSavedJsonSnippets(JSON.parse(savedJsonSnippetsData));
    }
    if (savedColorsData) {
      setSavedColors(JSON.parse(savedColorsData));
    }
    if (savedBase64ConversionsData) {
      setSavedBase64Conversions(JSON.parse(savedBase64ConversionsData));
    }
  }, []);

  // Auto-format JSON and convert Base64 on component load
  useEffect(() => {
    if (mounted) {
      // Auto-format the default JSON
      try {
        const parsed = JSON.parse(jsonInput);
        setFormattedJson(JSON.stringify(parsed, null, 2));
        setJsonError('');
      } catch (error) {
        setJsonError('Invalid JSON format');
      }
      
      // Auto-convert the default Base64
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        try {
          setBase64Output(atob(base64Input));
        } catch (error) {
          setBase64Output('Invalid Base64 string');
        }
      }
    }
  }, [mounted]);

  // Force dialog background for dark theme
  useEffect(() => {
    if (showQuickTools && theme.palette.mode === 'dark') {
      const dialogPaper = document.querySelector('.MuiDialog-paper');
      if (dialogPaper) {
        dialogPaper.style.background = 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)';
      }
    }
  }, [showQuickTools, theme.palette.mode]);

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('codeSnippets', JSON.stringify(savedSnippets));
    }
  }, [savedSnippets, mounted]);

  // Save API requests to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('apiRequests', JSON.stringify(savedApiRequests));
    }
  }, [savedApiRequests, mounted]);

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    }
  }, [savedPasswords, mounted]);

  // Save JSON snippets to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('jsonSnippets', JSON.stringify(savedJsonSnippets));
    }
  }, [savedJsonSnippets, mounted]);

  // Save colors to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('savedColors', JSON.stringify(savedColors));
    }
  }, [savedColors, mounted]);

  // Save base64 conversions to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('base64Conversions', JSON.stringify(savedBase64Conversions));
    }
  }, [savedBase64Conversions, mounted]);

  // Code snippet functions
  const saveSnippet = () => {
    if (!snippetTitle.trim() || !codeSnippet.trim()) {
      setSnackbarMessage('Please provide both title and code');
      setSnackbarOpen(true);
      return;
    }

    const newSnippet = {
      id: selectedSnippet ? selectedSnippet.id : Date.now(),
      title: snippetTitle.trim(),
      language: snippetLanguage,
      code: codeSnippet.trim(),
      createdAt: selectedSnippet ? selectedSnippet.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing && selectedSnippet) {
      setSavedSnippets(prev => prev.map(s => s.id === selectedSnippet.id ? newSnippet : s));
      setSnackbarMessage('Snippet updated successfully');
      addActivity(`Updated code snippet: ${snippetTitle}`, 'development');
    } else {
      setSavedSnippets(prev => [newSnippet, ...prev]);
      setSnackbarMessage('Snippet saved successfully');
      addActivity(`Saved code snippet: ${snippetTitle}`, 'development');
    }

    setSnippetTitle('');
    setCodeSnippet('');
    setSnippetLanguage('javascript');
    setSelectedSnippet(null);
    setIsEditing(false);
    setSnackbarOpen(true);
  };

  const loadSnippet = (snippet) => {
    setSnippetTitle(snippet.title);
    setSnippetLanguage(snippet.language);
    setCodeSnippet(snippet.code);
    setSelectedSnippet(snippet);
    setIsEditing(true);
  };

  const deleteSnippet = (snippetId) => {
    const snippetToDelete = savedSnippets.find(s => s.id === snippetId);
    setSavedSnippets(prev => prev.filter(s => s.id !== snippetId));
    if (selectedSnippet && selectedSnippet.id === snippetId) {
      setSnippetTitle('');
      setCodeSnippet('');
      setSnippetLanguage('javascript');
      setSelectedSnippet(null);
      setIsEditing(false);
    }
    setSnackbarMessage('Snippet deleted successfully');
    if (snippetToDelete) {
      addActivity(`Deleted code snippet: ${snippetToDelete.title}`, 'development');
    }
    setSnackbarOpen(true);
  };

  const clearForm = () => {
    setSnippetTitle('');
    setCodeSnippet('');
    setSnippetLanguage('javascript');
    setSelectedSnippet(null);
    setIsEditing(false);
  };

  const filteredSnippets = savedSnippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    addActivity(`Generated ${passwordLength}-character password`, 'security');
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setJsonError('');
      addActivity('Formatted JSON data', 'development');
    } catch (error) {
      setJsonError('Invalid JSON: ' + error.message);
      setFormattedJson('');
    }
  };

  const convertBase64 = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
        addActivity('Encoded text to Base64', 'development');
      } else {
        setBase64Output(atob(base64Input));
        addActivity('Decoded Base64 to text', 'development');
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
      addActivity(`Tested ${apiMethod} API: ${apiUrl}`, 'development');
    } catch (error) {
      setApiResponse('Error: ' + error.message);
    } finally {
      setIsApiLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard!');
    addActivity('Copied content to clipboard', 'development');
    setSnackbarOpen(true);
  };

  const handleToolClick = (tool) => {
    setActiveTool(tool.id);
    setShowQuickTools(true);
    addActivity(`Opened ${tool.title}`, 'development');
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

  // Helper function to add activities
  const addActivity = (action, type = 'development') => {
    const newActivity = {
      id: Date.now(),
      action,
      time: 'Just now',
      type
    };
    
    setRecentActivities(prev => [
      newActivity,
      ...prev.slice(0, 9) // Keep only 10 activities
    ]);
    
    // Update time after 1 minute
    setTimeout(() => {
      setRecentActivities(prev => 
        prev.map(activity => 
          activity.id === newActivity.id 
            ? { ...activity, time: '1 minute ago' }
            : activity
        )
      );
    }, 60000);
    
    // Update time after 5 minutes
    setTimeout(() => {
      setRecentActivities(prev => 
        prev.map(activity => 
          activity.id === newActivity.id 
            ? { ...activity, time: '5 minutes ago' }
            : activity
        )
      );
    }, 300000);
    
    // Update time after 1 hour
    setTimeout(() => {
      setRecentActivities(prev => 
        prev.map(activity => 
          activity.id === newActivity.id 
            ? { ...activity, time: '1 hour ago' }
            : activity
        )
      );
    }, 3600000);
  };

  // API Tester functions
  const saveApiRequest = () => {
    if (!apiUrl.trim()) {
      setSnackbarMessage('Please provide an API URL');
      setSnackbarOpen(true);
      return;
    }

    const newRequest = {
      id: selectedApiRequest ? selectedApiRequest.id : Date.now(),
      name: `API Request ${savedApiRequests.length + 1}`,
      url: apiUrl.trim(),
      method: apiMethod,
      headers: apiHeaders.trim(),
      body: apiBody.trim(),
      createdAt: selectedApiRequest ? selectedApiRequest.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditingApi && selectedApiRequest) {
      setSavedApiRequests(prev => prev.map(r => r.id === selectedApiRequest.id ? newRequest : r));
      setSnackbarMessage('API request updated successfully');
      addActivity(`Updated API request: ${newRequest.name}`, 'development');
    } else {
      setSavedApiRequests(prev => [newRequest, ...prev]);
      setSnackbarMessage('API request saved successfully');
      addActivity(`Saved API request: ${newRequest.name}`, 'development');
    }

    setSnackbarOpen(true);
  };

  const loadApiRequest = (request) => {
    setApiUrl(request.url);
    setApiMethod(request.method);
    setApiHeaders(request.headers);
    setApiBody(request.body);
    setSelectedApiRequest(request);
    setIsEditingApi(true);
  };

  const deleteApiRequest = (requestId) => {
    const requestToDelete = savedApiRequests.find(r => r.id === requestId);
    setSavedApiRequests(prev => prev.filter(r => r.id !== requestId));
    if (selectedApiRequest && selectedApiRequest.id === requestId) {
      setApiUrl('');
      setApiMethod('GET');
      setApiHeaders('');
      setApiBody('');
      setSelectedApiRequest(null);
      setIsEditingApi(false);
    }
    setSnackbarMessage('API request deleted successfully');
    if (requestToDelete) {
      addActivity(`Deleted API request: ${requestToDelete.name}`, 'development');
    }
    setSnackbarOpen(true);
  };

  // Password Generator functions
  const savePassword = () => {
    if (!generatedPassword) {
      setSnackbarMessage('Please generate a password first');
      setSnackbarOpen(true);
      return;
    }

    const newPassword = {
      id: Date.now(),
      password: generatedPassword,
      length: passwordLength,
      settings: {
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      },
      createdAt: new Date().toISOString(),
    };

    setSavedPasswords(prev => [newPassword, ...prev]);
    setSnackbarMessage('Password saved successfully');
    addActivity(`Saved ${passwordLength}-character password`, 'security');
    setSnackbarOpen(true);
  };

  const deletePassword = (passwordId) => {
    setSavedPasswords(prev => prev.filter(p => p.id !== passwordId));
    setSnackbarMessage('Password deleted successfully');
    addActivity('Deleted saved password', 'security');
    setSnackbarOpen(true);
  };

  // JSON Formatter functions
  const saveJsonSnippet = () => {
    if (!jsonInput.trim()) {
      setSnackbarMessage('Please provide JSON input');
      setSnackbarOpen(true);
      return;
    }

    const newJsonSnippet = {
      id: selectedJsonSnippet ? selectedJsonSnippet.id : Date.now(),
      name: `JSON Snippet ${savedJsonSnippets.length + 1}`,
      input: jsonInput.trim(),
      formatted: formattedJson,
      createdAt: selectedJsonSnippet ? selectedJsonSnippet.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditingJson && selectedJsonSnippet) {
      setSavedJsonSnippets(prev => prev.map(s => s.id === selectedJsonSnippet.id ? newJsonSnippet : s));
      setSnackbarMessage('JSON snippet updated successfully');
      addActivity(`Updated JSON snippet: ${newJsonSnippet.name}`, 'development');
    } else {
      setSavedJsonSnippets(prev => [newJsonSnippet, ...prev]);
      setSnackbarMessage('JSON snippet saved successfully');
      addActivity(`Saved JSON snippet: ${newJsonSnippet.name}`, 'development');
    }

    setSnackbarOpen(true);
  };

  const loadJsonSnippet = (snippet) => {
    setJsonInput(snippet.input);
    setFormattedJson(snippet.formatted);
    setSelectedJsonSnippet(snippet);
    setIsEditingJson(true);
  };

  const deleteJsonSnippet = (snippetId) => {
    const snippetToDelete = savedJsonSnippets.find(s => s.id === snippetId);
    setSavedJsonSnippets(prev => prev.filter(s => s.id !== snippetId));
    if (selectedJsonSnippet && selectedJsonSnippet.id === snippetId) {
      setJsonInput('');
      setFormattedJson('');
      setSelectedJsonSnippet(null);
      setIsEditingJson(false);
    }
    setSnackbarMessage('JSON snippet deleted successfully');
    if (snippetToDelete) {
      addActivity(`Deleted JSON snippet: ${snippetToDelete.name}`, 'development');
    }
    setSnackbarOpen(true);
  };

  // Color Picker functions
  const saveColor = () => {
    const newColor = {
      id: Date.now(),
      color: selectedColor,
      format: colorFormat,
      createdAt: new Date().toISOString(),
    };

    setSavedColors(prev => [newColor, ...prev]);
    setSnackbarMessage('Color saved successfully');
    addActivity(`Saved color: ${selectedColor}`, 'development');
    setSnackbarOpen(true);
  };

  const deleteColor = (colorId) => {
    setSavedColors(prev => prev.filter(c => c.id !== colorId));
    setSnackbarMessage('Color deleted successfully');
    addActivity('Deleted saved color', 'development');
    setSnackbarOpen(true);
  };

  // Base64 functions
  const saveBase64Conversion = () => {
    if (!base64Input.trim()) {
      setSnackbarMessage('Please provide input for conversion');
      setSnackbarOpen(true);
      return;
    }

    const newConversion = {
      id: selectedBase64Conversion ? selectedBase64Conversion.id : Date.now(),
      name: `Base64 ${base64Mode} ${savedBase64Conversions.length + 1}`,
      input: base64Input.trim(),
      output: base64Output,
      mode: base64Mode,
      createdAt: selectedBase64Conversion ? selectedBase64Conversion.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditingBase64 && selectedBase64Conversion) {
      setSavedBase64Conversions(prev => prev.map(c => c.id === selectedBase64Conversion.id ? newConversion : c));
      setSnackbarMessage('Base64 conversion updated successfully');
      addActivity(`Updated Base64 conversion: ${newConversion.name}`, 'development');
    } else {
      setSavedBase64Conversions(prev => [newConversion, ...prev]);
      setSnackbarMessage('Base64 conversion saved successfully');
      addActivity(`Saved Base64 conversion: ${newConversion.name}`, 'development');
    }

    setSnackbarOpen(true);
  };

  const loadBase64Conversion = (conversion) => {
    setBase64Input(conversion.input);
    setBase64Output(conversion.output);
    setBase64Mode(conversion.mode);
    setSelectedBase64Conversion(conversion);
    setIsEditingBase64(true);
  };

  const deleteBase64Conversion = (conversionId) => {
    const conversionToDelete = savedBase64Conversions.find(c => c.id === conversionId);
    setSavedBase64Conversions(prev => prev.filter(c => c.id !== conversionId));
    if (selectedBase64Conversion && selectedBase64Conversion.id === conversionId) {
      setBase64Input('');
      setBase64Output('');
      setSelectedBase64Conversion(null);
      setIsEditingBase64(false);
    }
    setSnackbarMessage('Base64 conversion deleted successfully');
    if (conversionToDelete) {
      addActivity(`Deleted Base64 conversion: ${conversionToDelete.name}`, 'development');
    }
    setSnackbarOpen(true);
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
            background: theme.palette.mode === 'dark'
              ? '#1a1a1a'
              : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${theme.palette.divider}`,
            '& .MuiDialog-paper': {
              background: theme.palette.mode === 'dark'
                ? '#1a1a1a'
                : 'rgba(255, 255, 255, 0.95)',
            }
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            background: theme.palette.mode === 'dark'
              ? '#1a1a1a'
              : 'rgba(255, 255, 255, 0.95)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.8)' 
              : 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-poppins)',
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
          background: theme.palette.mode === 'dark'
            ? '#1a1a1a'
            : 'rgba(255, 255, 255, 0.95)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          Developer Tools
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh" arrow>
              <IconButton size="small" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={() => setShowQuickTools(false)} sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: 0, 
          background: theme.palette.mode === 'dark'
            ? '#1a1a1a'
            : 'rgba(255, 255, 255, 0.95)',
          '&.MuiDialogContent-root': {
            background: theme.palette.mode === 'dark'
              ? '#1a1a1a'
              : 'rgba(255, 255, 255, 0.95)',
          }
        }}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: theme.palette.mode === 'dark'
              ? '#1a1a1a'
              : 'rgba(255, 255, 255, 0.95)',
          }}>
            <Tabs 
              value={activeTool} 
              onChange={(e, newValue) => setActiveTool(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                px: 3,
                background: theme.palette.mode === 'dark'
                  ? '#1a1a1a'
                  : 'rgba(255, 255, 255, 0.95)',
                '& .MuiTab-root': {
                  color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
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
                    minHeight: 64,
                    color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Box>
          
          <Box sx={{ 
            p: 3, 
            background: theme.palette.mode === 'dark'
              ? '#1a1a1a'
              : 'rgba(255, 255, 255, 0.95)',
            minHeight: '400px',
          }}>
            {/* Code Snippet Tool */}
            {activeTool === 'code-snippet' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  Code Snippet Manager
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Form */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        {isEditing ? 'Edit Snippet' : 'Create New Snippet'}
                      </Typography>
                    </Box>
                    
                    <TextField
                      label="Snippet Title"
                      fullWidth
                      value={snippetTitle}
                      onChange={(e) => setSnippetTitle(e.target.value)}
                      placeholder="Enter snippet title..."
                      sx={{ 
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>Language</InputLabel>
                      <Select
                        value={snippetLanguage}
                        onChange={(e) => setSnippetLanguage(e.target.value)}
                        label="Language"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '& .MuiSelect-select': {
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          }
                        }}
                      >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                        <MenuItem value="html">HTML</MenuItem>
                        <MenuItem value="css">CSS</MenuItem>
                        <MenuItem value="sql">SQL</MenuItem>
                        <MenuItem value="typescript">TypeScript</MenuItem>
                        <MenuItem value="react">React</MenuItem>
                        <MenuItem value="nodejs">Node.js</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label="Code Snippet"
                      multiline
                      rows={8}
                      fullWidth
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="Enter your code here..."
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        onClick={saveSnippet}
                        disabled={!snippetTitle.trim() || !codeSnippet.trim()}
                        sx={{ 
                          minWidth: 100,
                          bgcolor: (!snippetTitle.trim() || !codeSnippet.trim()) 
                            ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            : 'primary.main',
                          color: (!snippetTitle.trim() || !codeSnippet.trim())
                            ? theme.palette.mode === 'dark' ? '#cccccc' : '#666666'
                            : 'white',
                          '&:hover': {
                            bgcolor: (!snippetTitle.trim() || !codeSnippet.trim())
                              ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
                              : 'primary.dark',
                          }
                        }}
                      >
                        {isEditing ? 'Update' : 'Save'}
                      </Button>
                      
                      {isEditing && (
                        <Button 
                          variant="outlined" 
                          onClick={clearForm}
                          sx={{
                            borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                            color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              bgcolor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.02)',
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(codeSnippet)}
                        disabled={!codeSnippet.trim()}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Grid>
                  
                  {/* Right side - Saved Snippets */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved Snippets ({savedSnippets.length})
                      </Typography>
                    </Box>
                    
                    <TextField
                      label="Search snippets"
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title or language..."
                      sx={{ 
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <Box sx={{ 
                      maxHeight: 400, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {filteredSnippets.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            {searchQuery ? 'No snippets found' : 'No saved snippets yet'}
                          </Typography>
                        </Box>
                      ) : (
                        filteredSnippets.map((snippet) => (
                          <Box
                            key={snippet.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                flex: 1,
                                mr: 1
                              }}>
                                {snippet.title}
                              </Typography>
                              <Chip 
                                label={snippet.language} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 20,
                                  bgcolor: theme.palette.primary.main,
                                  color: 'white'
                                }} 
                              />
                            </Box>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {new Date(snippet.updatedAt).toLocaleDateString()} • {snippet.code.length} chars
                            </Typography>
                            
                            <Box sx={{ 
                              p: 1, 
                              bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#f5f5f5',
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                              maxHeight: 60,
                              overflow: 'hidden',
                              mb: 1
                            }}>
                              {snippet.code.substring(0, 100)}{snippet.code.length > 100 ? '...' : ''}
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => loadSnippet(snippet)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => copyToClipboard(snippet.code)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deleteSnippet(snippet.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* API Tester Tool */}
            {activeTool === 'api-tester' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  API Tester
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Form */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        {isEditingApi ? 'Edit API Request' : 'New API Request'}
                      </Typography>
                    </Box>
                    
                    <TextField
                      label="API URL"
                      fullWidth
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://api.example.com/endpoint"
                      sx={{ 
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>Method</InputLabel>
                      <Select
                        value={apiMethod}
                        onChange={(e) => setApiMethod(e.target.value)}
                        label="Method"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '& .MuiSelect-select': {
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          }
                        }}
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                        <MenuItem value="PATCH">PATCH</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label="Headers (JSON)"
                      multiline
                      rows={3}
                      fullWidth
                      value={apiHeaders}
                      onChange={(e) => setApiHeaders(e.target.value)}
                      placeholder='{"Authorization": "Bearer token"}'
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <TextField
                      label="Request Body (JSON)"
                      multiline
                      rows={3}
                      fullWidth
                      value={apiBody}
                      onChange={(e) => setApiBody(e.target.value)}
                      placeholder='{"key": "value"}'
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                        }
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        startIcon={isApiLoading ? <CircularProgress size={16} /> : <Send />}
                        onClick={testApi}
                        disabled={isApiLoading || !apiUrl.trim()}
                        sx={{ minWidth: 100 }}
                      >
                        {isApiLoading ? 'Testing...' : 'Test API'}
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={saveApiRequest}
                        disabled={!apiUrl.trim()}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          bgcolor: (!apiUrl.trim()) 
                            ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        {isEditingApi ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    
                    {apiResponse && (
                      <TextField
                        label="Response"
                        multiline
                        rows={6}
                        fullWidth
                        value={apiResponse}
                        InputProps={{ readOnly: true }}
                        sx={{
                          mt: 2,
                          '& .MuiInputBase-root': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? '#ffffff' 
                              : 'rgba(0, 0, 0, 0.02)',
                            border: `1px solid ${theme.palette.divider}`,
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          }
                        }}
                      />
                    )}
                  </Grid>
                  
                  {/* Right side - Saved Requests */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved Requests ({savedApiRequests.length})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 500, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {savedApiRequests.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            No saved API requests yet
                          </Typography>
                        </Box>
                      ) : (
                        savedApiRequests.map((request) => (
                          <Box
                            key={request.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                flex: 1,
                                mr: 1
                              }}>
                                {request.name}
                              </Typography>
                              <Chip 
                                label={request.method} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 20,
                                  bgcolor: request.method === 'GET' ? 'success.main' : 
                                          request.method === 'POST' ? 'primary.main' :
                                          request.method === 'PUT' ? 'warning.main' :
                                          request.method === 'DELETE' ? 'error.main' : 'info.main',
                                  color: 'white'
                                }} 
                              />
                            </Box>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1,
                              fontFamily: 'monospace',
                              wordBreak: 'break-all'
                            }}>
                              {request.url}
                            </Typography>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => loadApiRequest(request)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Load
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deleteApiRequest(request.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Password Generator Tool */}
            {activeTool === 'password-generator' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  Password Generator
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Generator */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeUppercase} 
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                          />
                        }
                        label="Include Uppercase (A-Z)"
                        sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeLowercase} 
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                          />
                        }
                        label="Include Lowercase (a-z)"
                        sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeNumbers} 
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                          />
                        }
                        label="Include Numbers (0-9)"
                        sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={includeSymbols} 
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                          />
                        }
                        label="Include Symbols (!@#$%^&*)"
                        sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        onClick={generatePassword}
                        sx={{ minWidth: 100 }}
                      >
                        Generate Password
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={savePassword}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          bgcolor: (!generatedPassword) 
                            ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        Save Password
                      </Button>
                    </Box>
                    
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
                                  sx={{ color: theme.palette.mode === 'dark' ? '#666666' : theme.palette.text.secondary }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </MuiIconButton>
                                <MuiIconButton
                                  onClick={() => copyToClipboard(generatedPassword)}
                                  edge="end"
                                  sx={{ color: theme.palette.mode === 'dark' ? '#666666' : theme.palette.text.secondary }}
                                >
                                  <ContentCopy />
                                </MuiIconButton>
                              </InputAdornment>
                            ),
                            type: showPassword ? 'text' : 'password'
                          }}
                          sx={{ 
                            mb: 2,
                            '& .MuiInputBase-root': {
                              bgcolor: theme.palette.mode === 'dark' 
                                ? '#ffffff' 
                                : 'rgba(0, 0, 0, 0.02)',
                              border: `1px solid ${theme.palette.divider}`,
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                            },
                            '& .MuiInputBase-input': {
                              color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                          Password Strength: {generatedPassword.length >= 12 ? 'Strong' : generatedPassword.length >= 8 ? 'Medium' : 'Weak'}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  {/* Right side - Saved Passwords */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved Passwords ({savedPasswords.length})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 500, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {savedPasswords.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            No saved passwords yet
                          </Typography>
                        </Box>
                      ) : (
                        savedPasswords.map((password) => (
                          <Box
                            key={password.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                flex: 1,
                                mr: 1
                              }}>
                                Password {savedPasswords.indexOf(password) + 1}
                              </Typography>
                              <Chip 
                                label={`${password.length} chars`} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 20,
                                  bgcolor: password.length >= 12 ? 'success.main' : 
                                          password.length >= 8 ? 'warning.main' : 'error.main',
                                  color: 'white'
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ 
                              p: 1, 
                              bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#f5f5f5',
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                              color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                              mb: 1,
                              wordBreak: 'break-all'
                            }}>
                              {password.password}
                            </Box>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {new Date(password.createdAt).toLocaleDateString()} • 
                              {password.settings.uppercase ? ' A-Z' : ''}
                              {password.settings.lowercase ? ' a-z' : ''}
                              {password.settings.numbers ? ' 0-9' : ''}
                              {password.settings.symbols ? ' !@#$' : ''}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => copyToClipboard(password.password)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deletePassword(password.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* JSON Formatter Tool */}
            {activeTool === 'json-formatter' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  JSON Formatter
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Formatter */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        {isEditingJson ? 'Edit JSON Snippet' : 'New JSON Input'}
                      </Typography>
                    </Box>
                    
                    <TextField
                      label="JSON Input"
                      multiline
                      rows={8}
                      fullWidth
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='{"name": "John", "age": 30, "city": "New York"}'
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        onClick={formatJson}
                        disabled={!jsonInput.trim()}
                        sx={{ minWidth: 100 }}
                      >
                        Format JSON
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={saveJsonSnippet}
                        disabled={!jsonInput.trim()}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          bgcolor: (!jsonInput.trim()) 
                            ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        {isEditingJson ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    
                    {jsonError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {jsonError}
                      </Alert>
                    )}
                    
                    {formattedJson && (
                      <TextField
                        label="Formatted JSON"
                        multiline
                        rows={8}
                        fullWidth
                        value={formattedJson}
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiInputBase-root': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? '#ffffff' 
                              : 'rgba(0, 0, 0, 0.02)',
                            border: `1px solid ${theme.palette.divider}`,
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          }
                        }}
                      />
                    )}
                  </Grid>
                  
                  {/* Right side - Saved JSON Snippets */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved JSON Snippets ({savedJsonSnippets.length})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 500, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {savedJsonSnippets.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            No saved JSON snippets yet
                          </Typography>
                        </Box>
                      ) : (
                        savedJsonSnippets.map((snippet) => (
                          <Box
                            key={snippet.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                flex: 1,
                                mr: 1
                              }}>
                                {snippet.name}
                              </Typography>
                              <Chip 
                                label={`${snippet.input.length} chars`} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 20,
                                  bgcolor: 'info.main',
                                  color: 'white'
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ 
                              p: 1, 
                              bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#f5f5f5',
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                              mb: 1,
                              maxHeight: 100,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {snippet.input}
                            </Box>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {new Date(snippet.updatedAt).toLocaleDateString()}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => loadJsonSnippet(snippet)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Load
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => copyToClipboard(snippet.formatted)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deleteJsonSnippet(snippet.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Color Picker Tool */}
            {activeTool === 'color-picker' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  Color Picker
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Color Picker */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Color Selection
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Selected Color
                      </Typography>
                      <Box sx={{ 
                        width: '100%', 
                        height: 100, 
                        bgcolor: selectedColor, 
                        borderRadius: 2, 
                        border: `2px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: getContrastColor(selectedColor),
                            fontWeight: 600,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {selectedColor}
                        </Typography>
                      </Box>
                      
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        style={{ 
                          width: '100%', 
                          height: 50, 
                          borderRadius: 8,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          cursor: 'pointer'
                        }}
                      />
                    </Box>
                    
                    <TextField
                      label="Color Value"
                      fullWidth
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          fontFamily: 'monospace',
                        }
                      }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>Format</InputLabel>
                      <Select
                        value={colorFormat}
                        onChange={(e) => setColorFormat(e.target.value)}
                        label="Format"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '& .MuiSelect-select': {
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          }
                        }}
                      >
                        <MenuItem value="hex">HEX</MenuItem>
                        <MenuItem value="rgb">RGB</MenuItem>
                        <MenuItem value="hsl">HSL</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        onClick={() => copyToClipboard(selectedColor)}
                        sx={{ minWidth: 100 }}
                      >
                        Copy Color
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={saveColor}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          bgcolor: 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        Save Color
                      </Button>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Color Formats
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                      }}>
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          mb: 1, 
                          fontFamily: 'monospace',
                          color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary
                        }}>
                          HEX: {selectedColor}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          mb: 1, 
                          fontFamily: 'monospace',
                          color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary
                        }}>
                          RGB: {hexToRgb(selectedColor)}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          fontFamily: 'monospace',
                          color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary
                        }}>
                          HSL: {hexToHsl(selectedColor)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Right side - Saved Colors */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved Colors ({savedColors.length})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 500, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {savedColors.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            No saved colors yet
                          </Typography>
                        </Box>
                      ) : (
                        savedColors.map((color) => (
                          <Box
                            key={color.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: color.color, 
                                borderRadius: 1, 
                                border: `1px solid ${theme.palette.divider}`,
                                mr: 2
                              }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ 
                                  fontWeight: 600, 
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontFamily: 'monospace',
                                  fontSize: '0.875rem'
                                }}>
                                  {color.color}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                                  display: 'block'
                                }}>
                                  {new Date(color.createdAt).toLocaleDateString()} • {color.format.toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => copyToClipboard(color.color)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => setSelectedColor(color.color)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Load
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deleteColor(color.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Base64 Converter Tool */}
            {activeTool === 'base64-converter' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontFamily: 'var(--font-poppins)', color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary }}>
                  Base64 Converter
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Left side - Converter */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        {isEditingBase64 ? 'Edit Base64 Conversion' : 'New Conversion'}
                      </Typography>
                    </Box>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary }}>Mode</InputLabel>
                      <Select
                        value={base64Mode}
                        onChange={(e) => setBase64Mode(e.target.value)}
                        label="Mode"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '& .MuiSelect-select': {
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          }
                        }}
                      >
                        <MenuItem value="encode">Encode</MenuItem>
                        <MenuItem value="decode">Decode</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label={base64Mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                      multiline
                      rows={6}
                      fullWidth
                      value={base64Input}
                      onChange={(e) => setBase64Input(e.target.value)}
                      placeholder={base64Mode === 'encode' ? 'Enter text to encode to Base64' : 'Enter Base64 string to decode'}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? '#ffffff' 
                            : 'rgba(0, 0, 0, 0.02)',
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused': {
                            borderColor: theme.palette.primary.main,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        onClick={convertBase64}
                        disabled={!base64Input.trim()}
                        sx={{ minWidth: 100 }}
                      >
                        {base64Mode === 'encode' ? 'Encode' : 'Decode'}
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={saveBase64Conversion}
                        disabled={!base64Input.trim()}
                        sx={{
                          borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                          color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                          bgcolor: (!base64Input.trim()) 
                            ? theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.02)',
                          }
                        }}
                      >
                        {isEditingBase64 ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    
                    {base64Output && (
                      <TextField
                        label={base64Mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                        multiline
                        rows={6}
                        fullWidth
                        value={base64Output}
                        InputProps={{ readOnly: true }}
                        sx={{
                          '& .MuiInputBase-root': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? '#ffffff' 
                              : 'rgba(0, 0, 0, 0.02)',
                            border: `1px solid ${theme.palette.divider}`,
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.secondary,
                          },
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                          }
                        }}
                      />
                    )}
                  </Grid>
                  
                  {/* Right side - Saved Conversions */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                        Saved Conversions ({savedBase64Conversions.length})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: 500, 
                      overflowY: 'auto',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}>
                      {savedBase64Conversions.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}>
                            No saved conversions yet
                          </Typography>
                        </Box>
                      ) : (
                        savedBase64Conversions.map((conversion) => (
                          <Box
                            key={conversion.id}
                            sx={{
                              p: 2,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                              },
                              '&:last-child': {
                                borderBottom: 'none',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ 
                                fontWeight: 600, 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                flex: 1,
                                mr: 1
                              }}>
                                {conversion.name}
                              </Typography>
                              <Chip 
                                label={conversion.mode.toUpperCase()} 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.75rem',
                                  height: 20,
                                  bgcolor: conversion.mode === 'encode' ? 'primary.main' : 'secondary.main',
                                  color: 'white'
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ 
                              p: 1, 
                              bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#f5f5f5',
                              borderRadius: 1,
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.primary,
                              mb: 1,
                              maxHeight: 60,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {conversion.input}
                            </Box>
                            
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {new Date(conversion.updatedAt).toLocaleDateString()}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => loadBase64Conversion(conversion)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Load
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => copyToClipboard(conversion.output)}
                                sx={{
                                  borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
                                  color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: theme.palette.mode === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.1)' 
                                      : 'rgba(0, 0, 0, 0.02)',
                                  }
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined"
                                color="error"
                                onClick={() => deleteBase64Conversion(conversion.id)}
                                sx={{
                                  borderColor: theme.palette.error.main,
                                  color: theme.palette.error.main,
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    bgcolor: theme.palette.error.main,
                                    color: 'white',
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          background: theme.palette.mode === 'dark'
            ? '#1a1a1a'
            : 'rgba(255, 255, 255, 0.95)',
        }}>
          <Button 
            onClick={() => setShowQuickTools(false)}
            variant="outlined"
            sx={{ 
              fontFamily: 'var(--font-lexend)',
              borderRadius: 2,
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.divider,
              color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.02)',
              }
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