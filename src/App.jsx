import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Leaf, UploadCloud, Activity, Settings, Users, Globe, ChevronRight, ChevronDown,
  ShieldCheck, Bug, Zap, Database, Menu, X, AlertCircle, Mail, Phone, 
  MapPin, ScanLine, Eye, BrainCircuit, Microscope, Shield, Layers, Cpu, 
  ArrowRight, Target, Lightbulb, Code, Server, ShieldAlert, CheckCircle
} from 'lucide-react';
import './App.css';

// 100% COMPLETE TRANSLATION DICTIONARY - PREVENTS ANY CRASHES
const translations = {
  en: {
    nav: { home: "Overview", works: "Architecture", info: "Pathology", detect: "Scan Leaf", about: "About", contact: "Support" },
    hero: { badge: "System v4.0 Online", title: "Crop Diagnostics.", titleSpan: "Reimagined.", subtitle: "Deploy state-of-the-art Convolutional Neural Networks directly to your fields. Instantly identify botanical pathologies with enterprise-grade accuracy.", cta: "Launch Scanner", ctaSecondary: "View Architecture" },
    bento: { b1Title: "Edge Inference", b1Desc: "Zero-latency predictions powered by highly optimized, lightweight tensor architecture running securely in your browser.", b2Title: "50,000+", b2Desc: "Samples Trained", b3Title: "Robust Generalization", b3Desc: "Advanced data augmentation ensuring accuracy across varied lighting, environments, and camera sensors.", b4Title: "< 1s", b4Desc: "Processing Time", b5Title: "Granular Precision", b5Desc: "Custom CNN specifically designed to differentiate complex botanical textures." },
    step: { title: "Seamless Integration", s1: "Capture", s1d: "Upload a clear image of the affected plant.", s2: "Analyze", s2d: "Neural networks process the image instantly.", s3: "Act", s3d: "Receive targeted, actionable treatment plans." },
    cta: { title: "Ready to protect your harvest?", desc: "Join the network of modern farmers utilizing AI diagnostics.", btn: "Initialize Scanner" },
    works: { title: "System Architecture", desc: "A deterministic pipeline engineered for maximum diagnostic fidelity.", s1: "Data Acquisition", s1d: "Images are resized to 256x256, normalized, and augmented to prevent overfitting.", s2: "Feature Extraction", s2d: "Convolutional layers apply filters to detect edges, textures, and biological anomalies.", s3: "Non-Linear Activation", s3d: "ReLU functions introduce non-linearity, allowing the network to learn complex patterns.", s4: "Classification", s4d: "The Softmax function outputs exact probability distributions for all pathology classes." },
    info: { title: "Pathology Database", desc: "Reference index for common Solanum lycopersicum diseases.", sev: "Risk Factor", diseases: [
      { name: "Healthy Leaf", type: "healthy", sym: "Rich green color, vibrant texture, no spots.", cause: "Optimal nutrition and care.", act: "Continue standard care regimen.", severity: 0 },
      { name: "Bacterial Spot", type: "disease", sym: "Small, water-soaked, dark greasy spots.", cause: "Xanthomonas bacteria.", act: "Apply copper-based bactericides.", severity: 70 },
      { name: "Yellow Leaf Curl", type: "disease", sym: "Upward curling, yellowing margins.", cause: "Begomovirus via Whiteflies.", act: "Use insecticidal soaps.", severity: 90 },
      { name: "Late Blight", type: "disease", sym: "Large irregular brown blotches.", cause: "Phytophthora infestans.", act: "Apply protective fungicides immediately.", severity: 95 },
      { name: "Early Blight", type: "disease", sym: "Brown spots with concentric rings.", cause: "Alternaria solani fungus.", act: "Prune lower leaves, keep dry.", severity: 60 },
      { name: "Leaf Mold", type: "disease", sym: "Pale greenish-yellow spots.", cause: "Passalora fulva fungus.", act: "Increase air circulation.", severity: 50 }
    ]},
    detect: { title: "Diagnostic Interface", desc: "Upload a clear image of a target leaf for neural analysis.", upload: "Drop image or browse files", predict: "Execute Analysis", reset: "New Scan", processing: "Analyzing botanical structure...", status: "Diagnostic Status", conf: "Network Confidence", error: "Connection to inference server failed.", cancel: "Cancel", id: "Identified Pathology", notes: "Clinical Observation", rec: "Recommended Action Plan", prob: "Probability Matrix" },
    about: { title: "About AgriVision", lead: "Pioneering the intersection of artificial intelligence and sustainable agriculture.", missionTitle: "Our Mission", missionDesc: "To ensure global food security by democratizing access to expert-level botanical diagnostics. We believe technology should empower farmers, not replace them.", v1: "Innovation", v1d: "Pushing the boundaries of edge-computing.", v2: "Precision", v2d: "Engineered for absolute accuracy.", v3: "Sustainability", v3d: "Reducing chemical waste via targeted intervention.", teamTitle: "Meet the Innovators", tech: "Core Infrastructure" },
    contact: { title: "Connect with Us", desc: "Our research and engineering teams are ready to assist.", team: "Core Research Team", dev: "Lead Engineer", guide: "Project Director", faqTitle: "Frequently Asked Questions", uplink: "Transmission Uplink", name: "Full Name", email: "Email Address", msg: "Detailed Inquiry", send: "Transmit Message", success: "Transmission Successful!" },
    faq: { q1: "What is the model accuracy?", a1: "We achieve 98.5% validation accuracy on the augmented PlantVillage dataset.", q2: "Does it support mobile photos?", a2: "Yes, the preprocessing module automatically scales and normalizes standard smartphone imagery.", q3: "Is there a usage cost?", a3: "Currently, this is an open academic research tool provided at no cost." },
    footer: { text: "Pioneering the intersection of artificial intelligence and sustainable agriculture.", links: "Platform", legal: "Legal & Privacy", news: "System Updates", newsDesc: "Get early access to our V4 models.", sub: "Subscribe", rights: "© 2026 AgriVision AI Research." }
  },
  hi: {
    nav: { home: "अवलोकन", works: "आर्किटेक्चर", info: "पैथोलॉजी", detect: "स्कैन लीफ", about: "बारे में", contact: "समर्थन" },
    hero: { badge: "सिस्टम v4.0 ऑनलाइन", title: "फसल निदान।", titleSpan: "पुनर्कल्पित।", subtitle: "अपने खेतों में सीधे अत्याधुनिक कनवल्शनल न्यूरल नेटवर्क तैनात करें। तुरंत रोग पहचानें।", cta: "स्कैनर लॉन्च करें", ctaSecondary: "आर्किटेक्चर देखें" },
    bento: { b1Title: "एज इनफरेंस", b1Desc: "सुरक्षित रूप से चलने वाले अनुकूलित आर्किटेक्चर द्वारा त्वरित भविष्यवाणियां।", b2Title: "50,000+", b2Desc: "प्रशिक्षित नमूने", b3Title: "मजबूत सामान्यीकरण", b3Desc: "विभिन्न प्रकाश व्यवस्था में सटीकता सुनिश्चित करना।", b4Title: "< 1s", b4Desc: "प्रसंस्करण समय", b5Title: "उच्च परिशुद्धता", b5Desc: "वानस्पतिक बनावट को अलग करने के लिए कस्टम सीएनएन।" },
    step: { title: "सहज एकीकरण", s1: "कैप्चर करें", s1d: "प्रभावित पौधे की एक स्पष्ट तस्वीर लें।", s2: "विश्लेषण करें", s2d: "न्यूरल नेटवर्क तुरंत छवि को प्रोसेस करते हैं।", s3: "कार्य करें", s3d: "लक्षित, कार्रवाई योग्य उपचार योजनाएं प्राप्त करें।" },
    cta: { title: "अपनी फसल की रक्षा के लिए तैयार हैं?", desc: "आधुनिक किसानों के नेटवर्क से जुड़ें।", btn: "स्कैनर प्रारंभ करें" },
    works: { title: "सिस्टम आर्किटेक्चर", desc: "अधिकतम निदान सटीकता के लिए इंजीनियर पाइपलाइन।", s1: "डेटा अधिग्रहण", s1d: "छवियों को 256x256 में बदला जाता है और सामान्यीकृत किया जाता है।", s2: "फ़ीचर निष्कर्षण", s2d: "कनवल्शनल परतें किनारों और विसंगतियों का पता लगाती हैं।", s3: "सक्रियण", s3d: "ReLU फ़ंक्शन जटिल पैटर्न सीखने की अनुमति देते हैं।", s4: "वर्गीकरण", s4d: "सॉफ्टमैक्स सभी वर्गों के लिए संभाव्यता आउटपुट करता है।" },
    info: { title: "रोग डेटाबेस", desc: "सामान्य टमाटर रोगों के लिए संदर्भ अनुक्रमणिका।", sev: "जोखिम कारक", diseases: [
      { name: "स्वस्थ पत्ता", type: "healthy", sym: "हरा रंग, कोई धब्बे नहीं।", cause: "इष्टतम पोषण।", act: "मानक देखभाल जारी रखें।", severity: 0 },
      { name: "बैक्टीरियल स्पॉट", type: "disease", sym: "छोटे, काले धब्बे।", cause: "बैक्टीरिया।", act: "कॉपर स्प्रे।", severity: 70 },
      { name: "येलो लीफ कर्ल", type: "disease", sym: "पत्तियों का मुड़ना।", cause: "वायरस।", act: "कीटनाशक साबुन।", severity: 90 },
      { name: "लेट ब्लाइट", type: "disease", sym: "बड़े भूरे धब्बे।", cause: "फाइटोफ्थोरा।", act: "कवकनाशी।", severity: 95 },
      { name: "अर्ली ब्लाइट", type: "disease", sym: "सांद्रिक वलय।", cause: "अल्टरनेरिया।", act: "छंटाई करें।", severity: 60 },
      { name: "लीफ मोल्ड", type: "disease", sym: "पीले धब्बे।", cause: "पासालोरा।", act: "हवा बढ़ाएँ।", severity: 50 }
    ]},
    detect: { title: "डायग्नोस्टिक इंटरफ़ेस", desc: "विश्लेषण के लिए एक स्पष्ट छवि अपलोड करें।", upload: "छवि छोड़ें या ब्राउज़ करें", predict: "विश्लेषण निष्पादित करें", reset: "नया स्कैन", processing: "विश्लेषण कर रहा है...", status: "निदान स्थिति", conf: "नेटवर्क विश्वास", error: "सर्वर से कनेक्शन विफल।", cancel: "रद्द करें", id: "पहचाना गया रोग", notes: "नैदानिक अवलोकन", rec: "अनुशंसित कार्य योजना", prob: "संभाव्यता मैट्रिक्स" },
    about: { title: "AgriVision के बारे में", lead: "कृत्रिम बुद्धिमत्ता और कृषि का अग्रणी प्रतिच्छेदन।", missionTitle: "हमारा मिशन", missionDesc: "किसानों को सशक्त बनाना और विशेषज्ञ स्तर के निदान तक पहुंच प्रदान करना।", v1: "नवाचार", v1d: "एज-कंप्यूटिंग की सीमाएं।", v2: "सटीकता", v2d: "मिशन-महत्वपूर्ण वातावरण के लिए इंजीनियर।", v3: "स्थिरता", v3d: "रासायनिक कचरे को कम करना।", teamTitle: "टीम से मिलें", tech: "कोर इंफ्रास्ट्रक्चर" },
    contact: { title: "हमसे जुड़ें", desc: "हमारी टीम सहायता के लिए तैयार है।", team: "कोर अनुसंधान टीम", dev: "लीड इंजीनियर", guide: "प्रोजेक्ट डायरेक्टर", faqTitle: "सामान्य प्रश्न", uplink: "संदेश भेजें", name: "पूरा नाम", email: "ईमेल पता", msg: "विस्तृत पूछताछ", send: "संदेश प्रेषित करें", success: "सफलतापूर्वक प्रेषित!" },
    faq: { q1: "सटीकता क्या है?", a1: "हम 98.5% सटीकता प्राप्त करते हैं।", q2: "क्या यह मोबाइल फ़ोटो का समर्थन करता है?", a2: "हां, यह स्वचालित रूप से छवियों को सामान्य करता है।", q3: "क्या कोई लागत है?", a3: "वर्तमान में, यह एक मुफ्त उपकरण है।" },
    footer: { text: "कृत्रिम बुद्धिमत्ता और कृषि का अग्रणी प्रतिच्छेदन।", links: "प्लेटफ़ॉर्म", legal: "कानूनी", news: "सिस्टम अपडेट", newsDesc: "नवीनतम जानकारी प्राप्त करें।", sub: "सदस्यता लें", rights: "© 2026 AgriVision AI." }
  },
  ta: {
    nav: { home: "கண்ணோட்டம்", works: "கட்டமைப்பு", info: "நோயியல்", detect: "ஸ்கேன்", about: "பற்றி", contact: "ஆதரவு" },
    hero: { badge: "கணினி v4.0 ஆன்லைன்", title: "பயிர் கண்டறிதல்.", titleSpan: "மறுவடிவமைப்பு.", subtitle: "நவீன AI தொழில்நுட்பத்தை உங்கள் வயல்களில் நேரடியாகப் பயன்படுத்துங்கள். நோய்களை உடனடியாக கண்டறியவும்.", cta: "ஸ்கேனரைத் தொடங்கு", ctaSecondary: "கட்டமைப்பைக் காண்க" },
    bento: { b1Title: "எட்ஜ் பகுப்பாய்வு", b1Desc: "உங்கள் உலாவியிலேயே இயங்கும் உகந்த கட்டமைப்பால் உடனடி கணிப்புகள்.", b2Title: "50,000+", b2Desc: "பயிற்சி மாதிரிகள்", b3Title: "வலுவான கட்டமைப்பு", b3Desc: "பல்வேறு சூழல்களில் துல்லியத்தை உறுதி செய்தல்.", b4Title: "< 1s", b4Desc: "செயலாக்க நேரம்", b5Title: "அதிக துல்லியம்", b5Desc: "சிக்கலான தாவர அமைப்புகளை வேறுபடுத்துவதற்கான தனிப்பயன் CNN." },
    step: { title: "தடையற்ற ஒருங்கிணைப்பு", s1: "படம் பிடி", s1d: "பாதிக்கப்பட்ட தாவரத்தின் தெளிவான புகைப்படத்தை எடுக்கவும்.", s2: "பகுப்பாய்வு", s2d: "உடனடி பட செயலாக்கம்.", s3: "செயல்", s3d: "சிகிச்சை திட்டங்களைப் பெறுங்கள்." },
    cta: { title: "உங்கள் பயிரை பாதுகாக்க தயாரா?", desc: "நவீன விவசாயிகளின் நெட்வொர்க்கில் சேரவும்.", btn: "ஸ்கேன் தொடங்கு" },
    works: { title: "கணினி கட்டமைப்பு", desc: "அதிகபட்ச கண்டறிதல் துல்லியத்திற்கான பைப்லைன்.", s1: "தரவு கையகப்படுத்தல்", s1d: "படங்கள் அளவிடப்பட்டு இயல்பாக்கப்படுகின்றன.", s2: "அம்ச பிரித்தெடுத்தல்", s2d: "CNN அடுக்குகள் விளிம்புகளைக் கண்டறிகின்றன.", s3: "செயல்படுத்தல்", s3d: "ReLU செயல்பாடுகள் சிக்கலான வடிவங்களைக் கற்றுக்கொள்ள அனுமதிக்கின்றன.", s4: "வகைப்பாடு", s4d: "Softmax துல்லியமான நிகழ்தகவுகளை வெளியிடுகிறது." },
    info: { title: "நோய் தரவுத்தளம்", desc: "பொதுவான தக்காளி நோய்களுக்கான குறிப்பு அட்டவணை.", sev: "ஆபத்து காரணி", diseases: [
      { name: "ஆரோக்கியமான இலை", type: "healthy", sym: "பச்சை நிறம், புள்ளிகள் இல்லை.", cause: "சிறந்த ஊட்டச்சத்து.", act: "வழக்கமான கவனிப்பு.", severity: 0 },
      { name: "பாக்டீரியா புள்ளி", type: "disease", sym: "சிறிய இருண்ட புள்ளிகள்.", cause: "பாக்டீரியா.", act: "தாமிர ஸ்ப்ரே.", severity: 70 },
      { name: "மஞ்சள் இலை சுருட்டு", type: "disease", sym: "இலைகள் மேல்நோக்கி சுருளுதல்.", cause: "வைரஸ்.", act: "பூச்சிக்கொல்லி.", severity: 90 },
      { name: "தாமத கருகல்", type: "disease", sym: "பெரிய பழுப்பு திட்டுகள்.", cause: "பைட்டோபதோரா.", act: "பூஞ்சைக்கொல்லி.", severity: 95 },
      { name: "ஆரம்ப கருகல்", type: "disease", sym: "வளைய புள்ளிகள்.", cause: "ஆல்டர்நேரியா.", act: "கத்தரிக்கவும்.", severity: 60 },
      { name: "இலை பூஞ்சை", type: "disease", sym: "மஞ்சள் புள்ளிகள்.", cause: "பாசலோரா.", act: "காற்றோட்டம்.", severity: 50 }
    ]},
    detect: { title: "கண்டறியும் இடைமுகம்", desc: "பகுப்பாய்விற்கு ஒரு தெளிவான படத்தை பதிவேற்றவும்.", upload: "படத்தை பதிவேற்றவும்", predict: "பகுப்பாய்வை இயக்கு", reset: "புதிய ஸ்கேன்", processing: "செயலாக்குகிறது...", status: "நிலை", conf: "நம்பிக்கை", error: "சர்வர் இணைப்பு தோல்வி.", cancel: "ரத்து", id: "கண்டறியப்பட்ட நோய்", notes: "மருத்துவ குறிப்பு", rec: "பரிந்துரைக்கப்படும் செயல்", prob: "நிகழ்தகவு மேட்ரிக்ஸ்" },
    about: { title: "AgriVision பற்றி", lead: "செயற்கை நுண்ணறிவு மற்றும் விவசாயத்தின் முன்னோடி.", missionTitle: "எங்கள் பணி", missionDesc: "உலகளாவிய உணவுப் பாதுகாப்பை உறுதி செய்தல் மற்றும் விவசாயிகளை மேம்படுத்துதல்.", v1: "கண்டுபிடிப்பு", v1d: "எட்ஜ்-கணினியின் எல்லைகள்.", v2: "துல்லியம்", v2d: "முக்கியமான சூழல்களுக்காக வடிவமைக்கப்பட்டது.", v3: "நிலைத்தன்மை", v3d: "இரசாயன கழிவுகளை குறைத்தல்.", teamTitle: "குழு", tech: "முக்கிய கட்டமைப்பு" },
    contact: { title: "எங்களை தொடர்பு கொள்ள", desc: "எங்கள் குழு உதவ தயாராக உள்ளது.", team: "ஆராய்ச்சி குழு", dev: "தலைமை பொறியாளர்", guide: "திட்ட இயக்குனர்", faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்", uplink: "செய்தி அனுப்பு", name: "முழு பெயர்", email: "மின்னஞ்சல்", msg: "செய்தி", send: "அனுப்பு", success: "வெற்றிகரமாக அனுப்பப்பட்டது!" },
    faq: { q1: "துல்லியம் என்ன?", a1: "நாங்கள் 98.5% துல்லியத்தை அடைகிறோம்.", q2: "மொபைல் படங்களை ஆதரிக்கிறதா?", a2: "ஆம், இது தானாகவே படங்களை இயல்பாக்குகிறது.", q3: "செலவு உள்ளதா?", a3: "தற்போது, இது ஒரு இலவச ஆராய்ச்சி கருவி." },
    footer: { text: "செயற்கை நுண்ணறிவு மற்றும் விவசாயத்தின் முன்னோடி.", links: "தளம்", legal: "சட்டபூர்வமானவை", news: "புதுப்பிப்புகள்", newsDesc: "சமீபத்திய தகவல்களைப் பெறுங்கள்.", sub: "பதிவு செய்", rights: "© 2026 AgriVision AI." }
  },
  te: {
    nav: { home: "అవలోకనం", works: "ఆర్కిటెక్చర్", info: "పాథాలజీ", detect: "స్కాన్ ఆకు", about: "గురించి", contact: "మద్దతు" },
    hero: { badge: "సిస్టమ్ v4.0 ఆన్‌లైన్", title: "పంట నిర్ధారణ.", titleSpan: "పునరాలోచించబడింది.", subtitle: "మీ పొలాల్లో నేరుగా అధునాతన AIని అమలు చేయండి.", cta: "స్కానర్ ప్రారంభించండి", ctaSecondary: "ఆర్కిటెక్చర్ చూడండి" },
    bento: { b1Title: "ఎడ్జ్ ఇన్ఫరెన్స్", b1Desc: "మీ బ్రౌజర్‌లోనే నడుస్తున్న ఆప్టిమైజ్ చేయబడిన ఆర్కిటెక్చర్ ద్వారా తక్షణ అంచనాలు.", b2Title: "50,000+", b2Desc: "శిక్షణ నమూనాలు", b3Title: "బలమైన పనితీరు", b3Desc: "వివిధ వాతావరణాలలో ఖచ్చితత్వాన్ని నిర్ధారించడం.", b4Title: "< 1s", b4Desc: "ప్రాసెసింగ్ సమయం", b5Title: "అధిక ఖచ్చితత్వం", b5Desc: "వృక్షశాస్త్ర ఆకృతులను వేరు చేయడానికి కస్టమ్ CNN." },
    step: { title: "సులభమైన అనుసంధానం", s1: "క్యాప్చర్", s1d: "స్పష్టమైన ఫోటో తీయండి.", s2: "విశ్లేషించండి", s2d: "తక్షణ చిత్ర ప్రాసెసింగ్.", s3: "చర్య", s3d: "చికిత్స ప్రణాళికలను పొందండి." },
    cta: { title: "మీ పంటను రక్షించడానికి సిద్ధంగా ఉన్నారా?", desc: "ఆధునిక రైతుల నెట్‌వర్క్‌లో చేరండి.", btn: "స్కాన్ ప్రారంభించండి" },
    works: { title: "సిస్టమ్ ఆర్కిటెక్చర్", desc: "గరిష్ట ఖచ్చితత్వం కోసం ఇంజనీరింగ్ పైప్‌లైన్.", s1: "డేటా సేకరణ", s1d: "చిత్రాలు 256x256 కు మార్చబడతాయి.", s2: "ఫీచర్ వెలికితీత", s2d: "CNN పొరలు అంచులను గుర్తిస్తాయి.", s3: "యాక్టివేషన్", s3d: "ReLU విధులు క్లిష్టమైన నమూనాలను నేర్చుకోవడానికి అనుమతిస్తాయి.", s4: "వర్గీకరణ", s4d: "Softmax ఖచ్చితమైన సంభావ్యతలను ఇస్తుంది." },
    info: { title: "వ్యాధి డేటాబేస్", desc: "సాధారణ టొమాటో వ్యాధులకు సూచిక.", sev: "ప్రమాదం", diseases: [
      { name: "ఆరోగ్యకరమైన ఆకు", type: "healthy", sym: "ఆకుపచ్చ రంగు, మచ్చలు లేవు.", cause: "సరైన పోషణ.", act: "సాధారణ సంరక్షణ.", severity: 0 },
      { name: "బ్యాక్టీరియల్ స్పాట్", type: "disease", sym: "నల్లటి మచ్చలు.", cause: "బ్యాక్టీరియా.", act: "కాపర్ స్ప్రే.", severity: 70 },
      { name: "ఎల్లో లీఫ్ కర్ల్", type: "disease", sym: "ఆకులు ముడుచుకోవడం.", cause: "వైరస్.", act: "పురుగుల మందు.", severity: 90 },
      { name: "లేట్ బ్లైట్", type: "disease", sym: "పెద్ద మచ్చలు.", cause: "ఫైటోఫ్తోరా.", act: "ఫంగిసైడ్.", severity: 95 },
      { name: "ఎర్లీ బ్లైట్", type: "disease", sym: "వలయాలు.", cause: "ఆల్టర్నేరియా.", act: "కత్తిరించండి.", severity: 60 },
      { name: "లీఫ్ మోల్ಡ್", type: "disease", sym: "పసుపు మచ్చలు.", cause: "పాసలోరా.", act: "గాలి ప్రసరణ.", severity: 50 }
    ]},
    detect: { title: "డయాగ్నోస్టిక్ ఇంటర్‌ఫేస్", desc: "విశ్లేషణ కోసం స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయండి.", upload: "చిత్రాన్ని అప్‌లోడ్ చేయండి", predict: "విశ్లేషణ అమలు చేయండి", reset: "కొత్త స్కాన్", processing: "ప్రాసెస్ చేస్తోంది...", status: "స్థితి", conf: "నమ్మకం", error: "సర్వర్ కనెక్షన్ విఫలమైంది.", cancel: "రద్దు", id: "గుర్తించిన వ్యాధి", notes: "క్లినికల్ గమనిక", rec: "సిఫార్సు చేసిన చర్య", prob: "సంభావ్యత మ్యాట్రిక్స్" },
    about: { title: "AgriVision గురించి", lead: "కృత్రిమ మేధస్సు మరియు వ్యవసాయం యొక్క కలయిక.", missionTitle: "మా లక్ష్యం", missionDesc: "రైతులకు నిపుణుల స్థాయి రోగ నిర్ధారణను అందించడం.", v1: "ఆవిష్కరణ", v1d: "ఎడ్జ్-కంప్యూటింగ్.", v2: "ఖచ్చితత్వం", v2d: "క్లిష్టమైన వాతావరణాలకు ఇంజనీరింగ్.", v3: "స్థిరత్వం", v3d: "రసాయన వ్యర్థాలను తగ్గించడం.", teamTitle: "బృందం", tech: "కోర్ టెక్నాలజీ" },
    contact: { title: "మమ్మల్ని సంప్రదించండి", desc: "మా బృందం సహాయం చేయడానికి సిద్ధంగా ఉంది.", team: "పరిశోధన బృందం", dev: "లీడ్ ఇంజనీర్", guide: "ప్రాజెక్ట్ డైరెక్టర్", faqTitle: "తరచుగా అడిగే ప్రశ్నలు", uplink: "సందేశం పంపండి", name: "పూర్తి పేరు", email: "ఇమెయిల్", msg: "సందేశం", send: "పంపండి", success: "విజయవంతంగా పంపబడింది!" },
    faq: { q1: "ఖచ్చితత్వం ఏమిటి?", a1: "మేము 98.5% ఖచ్చితత్వాన్ని సాధిస్తాము.", q2: "మొబైల్ ఫోటోలకు మద్దతు ఇస్తుందా?", a2: "అవును, ఇది స్వయంచాలకంగా చిత్రాలను సాధారణీకరిస్తుంది.", q3: "దీనికి ఖర్చు ఉందా?", a3: "ప్రస్తుతం, ఇది ఉచిత సాధనం." },
    footer: { text: "కృత్రిమ మేధస్సు మరియు వ్యవసాయం యొక్క కలయిక.", links: "ప్లాట్‌ఫారమ్", legal: "చట్టపరమైన", news: "అప్‌డేట్‌లు", newsDesc: "తాజా సమాచారాన్ని పొందండి.", sub: "సబ్‌స్క్రైబ్", rights: "© 2026 AgriVision AI." }
  },
  kn: {
    nav: { home: "ಅವಲೋಕನ", works: "ಆರ್ಕಿಟೆಕ್ಚರ್", info: "ಪ್ಯಾಥಾಲಜಿ", detect: "ಸ್ಕ್ಯಾನ್ ಎಲೆ", about: "ಬಗ್ಗೆ", contact: "ಬೆಂಬಲ" },
    hero: { badge: "ಸಿಸ್ಟಮ್ v4.0 ಆನ್‌ಲೈನ್", title: "ಬೆಳೆ ರೋಗನಿರ್ಣಯ.", titleSpan: "ಮರುರೂಪಿಸಲಾಗಿದೆ.", subtitle: "ನಿಮ್ಮ ಜಮೀನುಗಳಲ್ಲಿ ನೇರವಾಗಿ ಸುಧಾರಿತ AI ಅನ್ನು ನಿಯೋಜಿಸಿ.", cta: "ಸ್ಕ್ಯಾನರ್ ಪ್ರಾರಂಭಿಸಿ", ctaSecondary: "ಆರ್ಕಿಟೆಕ್ಚರ್ ವೀಕ್ಷಿಸಿ" },
    bento: { b1Title: "ಎಡ್ಜ್ ಇನ್ಫರೆನ್ಸ್", b1Desc: "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿಯೇ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಆಪ್ಟಿಮೈಸ್ಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಮೂಲಕ ತ್ವರಿತ ಮುನ್ಸೂಚನೆಗಳು.", b2Title: "50,000+", b2Desc: "ತರಬೇತಿ ಮಾದರಿಗಳು", b3Title: "ಬಲವಾದ ಕಾರ್ಯಕ್ಷಮತೆ", b3Desc: "ವಿವಿಧ ಪರಿಸರಗಳಲ್ಲಿ ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವುದು.", b4Title: "< 1s", b4Desc: "ಸಂಸ್ಕರಣಾ ಸಮಯ", b5Title: "ಹೆಚ್ಚಿನ ನಿಖರತೆ", b5Desc: "ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ರಚನೆಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಲು ಕಸ್ಟಮ್ CNN." },
    step: { title: "ತಡೆರಹಿತ ಏಕೀಕರಣ", s1: "ಸೆರೆಹಿಡಿಯಿರಿ", s1d: "ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ.", s2: "ವಿಶ್ಲೇಷಿಸಿ", s2d: "ತ್ವರಿತ ಚಿತ್ರ ಸಂಸ್ಕರಣೆ.", s3: "ಕ್ರಿಯೆ", s3d: "ಚಿಕಿತ್ಸಾ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಿರಿ." },
    cta: { title: "ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?", desc: "ಆಧುನಿಕ ರೈತರ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿ.", btn: "ಸ್ಕ್ಯಾನ್ ಪ್ರಾರಂಭಿಸಿ" },
    works: { title: "ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್", desc: "ಗರಿಷ್ಠ ನಿಖರತೆಗಾಗಿ ಪೈಪ್‌ಲೈನ್.", s1: "ಡೇಟಾ ಸ್ವಾಧೀನ", s1d: "ಚಿತ್ರಗಳನ್ನು 256x256 ಗೆ ಬದಲಾಯಿಸಲಾಗುತ್ತದೆ.", s2: "ವೈಶಿಷ್ಟ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ", s2d: "CNN ಪದರಗಳು ಅಂಚುಗಳನ್ನು ಗುರುತಿಸುತ್ತವೆ.", s3: "ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ", s3d: "ReLU ಕಾರ್ಯಗಳು ಸಂಕೀರ್ಣ ಮಾದರಿಗಳನ್ನು ಕಲಿಯಲು ಅನುವು ಮಾಡಿಕೊಡುತ್ತದೆ.", s4: "ವರ್ಗೀಕರಣ", s4d: "Softmax ನಿಖರವಾದ ಸಂಭವನೀಯತೆಗಳನ್ನು ನೀಡುತ್ತದೆ." },
    info: { title: "ರೋಗ ಡೇಟಾಬೇಸ್", desc: "ಸಾಮಾನ್ಯ ಟೊಮೆಟೊ ರೋಗಗಳಿಗೆ ಸೂಚ್ಯಂಕ.", sev: "ಅಪಾಯ", diseases: [
      { name: "ಆರೋಗ್ಯಕರ ಎಲೆ", type: "healthy", sym: "ಹಸಿರು ಬಣ್ಣ, ಕಲೆಗಳಿಲ್ಲ.", cause: "ಉತ್ತಮ ಪೋಷಣೆ.", act: "ಸಾಮಾನ್ಯ ಆರೈಕೆ.", severity: 0 },
      { name: "ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಸ್ಪಾಟ್", type: "disease", sym: "ಕಪ್ಪು ಕಲೆಗಳು.", cause: "ಬ್ಯಾಕ್ಟೀರಿಯಾ.", act: "ತಾಮ್ರದ ಸ್ಪ್ರೇ.", severity: 70 },
      { name: "ಎಲ್ಲೋ ಲೀಫ್ ಕರ್ಲ್", type: "disease", sym: "ಎಲೆಗಳು ಮುದುಡುವುದು.", cause: "ವೈರಸ್.", act: "ಕೀಟನಾಶಕ.", severity: 90 },
      { name: "ಲೇಟ್ ಬ್ಲೈಟ್", type: "disease", sym: "ದೊಡ್ಡ ಕಲೆಗಳು.", cause: "ಫೈಟೊಫ್ಥೊರಾ.", act: "ಶಿಲೀಂಧ್ರನಾಶಕ.", severity: 95 },
      { name: "ಅರ್ಲಿ ಬ್ಲೈಟ್", type: "disease", sym: "ಉಂಗುರಗಳು.", cause: "ಆಲ್ಟರ್ನೇರಿಯಾ.", act: "ಕತ್ತರಿಸಿ.", severity: 60 },
      { name: "ಲೀಫ್ ಮೋಲ್ಡ್", type: "disease", sym: "ಹಳದಿ ಕಲೆಗಳು.", cause: "ಪಾಸಲೋರಾ.", act: "ಗಾಳಿಯಾಡುವಿಕೆ.", severity: 50 }
    ]},
    detect: { title: "ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಇಂಟರ್ಫೇಸ್", desc: "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಸ್ಪಷ್ಟ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.", upload: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", predict: "ವಿಶ್ಲೇಷಣೆ ಚಲಾಯಿಸಿ", reset: "ಹೊಸ ಸ್ಕ್ಯಾನ್", processing: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...", status: "ಸ್ಥಿತಿ", conf: "ವಿಶ್ವಾಸ", error: "ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ.", cancel: "ರದ್ದು", id: "ಪತ್ತೆಯಾದ ರೋಗ", notes: "ಕ್ಲಿನಿಕಲ್ ಟಿಪ್ಪಣಿ", rec: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಿಯೆ", prob: "ಸಂಭವನೀಯತೆ ಮ್ಯಾಟ್ರಿಕ್ಸ್" },
    about: { title: "AgriVision ಬಗ್ಗೆ", lead: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಕೃಷಿಯ ಛೇದನ.", missionTitle: "ನಮ್ಮ ಉದ್ದೇಶ", missionDesc: "ರೈತರಿಗೆ ತಜ್ಞರ ಮಟ್ಟದ ರೋಗನಿರ್ಣಯವನ್ನು ಒದಗಿಸುವುದು.", v1: "ನಾವೀನ್ಯತೆ", v1d: "ಎಡ್ಜ್-ಕಂಪ್ಯೂಟಿಂಗ್.", v2: "ನಿಖರತೆ", v2d: "ನಿರ್ಣಾಯಕ ಪರಿಸರಗಳಿಗಾಗಿ.", v3: "ಸುಸ್ಥಿರತೆ", v3d: "ರಾಸಾಯನಿಕ ತ್ಯಾಜ್ಯವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು.", teamTitle: "ತಂಡ", tech: "ಕೋರ್ ತಂತ್ರಜ್ಞಾನ" },
    contact: { title: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ", desc: "ನಮ್ಮ ತಂಡ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ.", team: "ಸಂಶೋಧನಾ ತಂಡ", dev: "ಲೀಡ್ ಇಂಜಿನಿಯರ್", guide: "ಪ್ರಾಜೆಕ್ಟ್ ಡೈರೆಕ್ಟರ್", faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು", uplink: "ಸಂದೇಶ ಕಳುಹಿಸಿ", name: "ಪೂರ್ಣ ಹೆಸರು", email: "ಇಮೇಲ್", msg: "ಸಂದೇಶ", send: "ಕಳುಹಿಸಿ", success: "ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!" },
    faq: { q1: "ನಿಖರತೆ ಏನು?", a1: "ನಾವು 98.5% ನಿಖರತೆಯನ್ನು ಸಾಧಿಸುತ್ತೇವೆ.", q2: "ಮೊಬೈಲ್ ಫೋಟೋಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆಯೇ?", a2: "ಹೌದು, ಇದು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಚಿತ್ರಗಳನ್ನು ಸಾಮಾನ್ಯಗೊಳಿಸುತ್ತದೆ.", q3: "ಇದಕ್ಕೆ ವೆಚ್ಚವಿದೆಯೇ?", a3: "ಪ್ರಸ್ತುತ, ಇದು ಉಚಿತ ಸಾಧನವಾಗಿದೆ." },
    footer: { text: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಕೃಷಿಯ ಛೇದನ.", links: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್", legal: "ಕಾನೂನು", news: "ಅಪ್‌ಡೇಟ್‌ಗಳು", newsDesc: "ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಿರಿ.", sub: "ಚಂದಾದಾರರಾಗಿ", rights: "© 2026 AgriVision AI." }
  }
};

const LanguageContext = createContext();

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-q"><span>{question}</span><ChevronDown size={20} style={{ transition: 'transform 0.3s ease' }} /></div>
      <div className="faq-a"><p>{answer}</p></div>
    </div>
  );
};

const Layout = () => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-layout">
      <div className="bg-effects"></div>
      <div className="bg-grid"></div>
      
      <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="brand-logo">
          <Leaf className="text-primary" size={24} /> AgriVision
        </div>
        
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-item">{t.nav?.home}</NavLink>
          <NavLink to="/how-it-works" className="nav-item">{t.nav?.works}</NavLink>
          <NavLink to="/info" className="nav-item">{t.nav?.info}</NavLink>
          <NavLink to="/about" className="nav-item">{t.nav?.about}</NavLink>
          <NavLink to="/contact" className="nav-item">{t.nav?.contact}</NavLink>
          <NavLink to="/detect" className="nav-item accent">{t.nav?.detect}</NavLink>
          
          <div className="locale-select">
            <Globe size={16} className="text-muted" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">ENG</option>
              <option value="hi">HIN</option>
              <option value="ta">TAM</option>
              <option value="te">TEL</option>
              <option value="kn">KAN</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="main-view">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="foot-grid">
          <div>
            <div className="brand-logo" style={{marginBottom: '1rem'}}><Leaf size={20} className="text-primary"/> AgriVision</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6'}}>{t.footer?.text}</p>
            <div className="foot-soc">
              <a href="#" className="foot-soc-icon"><Mail size={16}/></a>
              <a href="#" className="foot-soc-icon"><Phone size={16}/></a>
              <a href="#" className="foot-soc-icon"><MapPin size={16}/></a>
            </div>
          </div>
          <div>
            <h4 className="foot-title">{t.footer?.links}</h4>
            <div className="foot-links">
              <NavLink to="/how-it-works">{t.nav?.works}</NavLink>
              <NavLink to="/info">{t.nav?.info}</NavLink>
              <NavLink to="/detect">{t.nav?.detect}</NavLink>
              <NavLink to="/about">{t.nav?.about}</NavLink>
            </div>
          </div>
          <div>
            <h4 className="foot-title">{t.footer?.legal}</h4>
            <div className="foot-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Data Security</a>
            </div>
          </div>
          <div>
            <h4 className="foot-title">{t.footer?.news}</h4>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem'}}>{t.footer?.newsDesc}</p>
            <form className="news-input" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
              <input type="email" placeholder="Email Address" required />
              <button type="submit">{t.footer?.sub}</button>
            </form>
          </div>
        </div>
        <div className="foot-bot">{t.footer?.rights}</div>
      </footer>
    </div>
  );
};

const Home = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <div className="anim-fade">
      <section className="hero-section">
        <div className="hero-glow-orb"></div>
        <div className="hero-pill anim-fade dl-1"><div className="indicator"></div> {t.hero?.badge}</div>
        <h1 className="hero-headline anim-fade dl-2">{t.hero?.title} <span className="text-gradient">{t.hero?.titleSpan}</span></h1>
        <p className="hero-sub anim-fade dl-3">{t.hero?.subtitle}</p>
        <div className="hero-buttons anim-fade dl-4">
          <button className="btn-primary btn-glow" onClick={() => navigate('/detect')}>{t.hero?.cta} <ArrowRight size={18} /></button>
          <button className="btn-secondary" onClick={() => navigate('/how-it-works')}><BrainCircuit size={18} /> {t.hero?.ctaSecondary}</button>
        </div>
      </section>

      <section className="bento-layout">
        <div className="glass-card bento-large anim-fade dl-1">
          <div className="bento-icon-wrapper"><Zap size={24}/></div>
          <h3 className="bento-title">{t.bento?.b1Title}</h3>
          <p className="bento-desc max-w-md">{t.bento?.b1Desc}</p>
        </div>
        
        <div className="glass-card anim-fade dl-2" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div>
            <div className="bento-stat">{t.bento?.b2Title}</div>
            <p className="bento-desc font-display" style={{textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600}}>{t.bento?.b2Desc}</p>
          </div>
        </div>

        <div className="glass-card bento-tall anim-fade dl-3">
          <div className="bento-icon-wrapper"><ShieldCheck size={24}/></div>
          <h3 className="bento-title">{t.bento?.b3Title}</h3>
          <p className="bento-desc">{t.bento?.b3Desc}</p>
        </div>

        <div className="glass-card anim-fade dl-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div>
            <div className="bento-stat" style={{color: 'var(--primary)'}}>{t.bento?.b4Title}</div>
            <p className="bento-desc font-display" style={{textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600}}>{t.bento?.b4Desc}</p>
          </div>
        </div>

        <div className="glass-card anim-fade dl-1">
          <div className="bento-icon-wrapper"><Eye size={24}/></div>
          <h3 className="bento-title">{t.bento?.b5Title}</h3>
          <p className="bento-desc">{t.bento?.b5Desc}</p>
        </div>
      </section>

      <section className="teaser-section anim-fade d-2">
        <div className="header-clean" style={{marginBottom: '3rem'}}>
          <h2>{t.step?.title}</h2>
        </div>
        <div className="teaser-grid">
          <div className="teaser-card">
            <div className="teaser-step">STEP 01</div>
            <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '0.5rem'}}>{t.step?.s1}</h3>
            <p className="text-muted">{t.step?.s1d}</p>
          </div>
          <div className="teaser-card" style={{borderTopColor: 'var(--accent)'}}>
            <div className="teaser-step" style={{color: 'var(--accent)'}}>STEP 02</div>
            <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '0.5rem'}}>{t.step?.s2}</h3>
            <p className="text-muted">{t.step?.s2d}</p>
          </div>
          <div className="teaser-card" style={{borderTopColor: 'var(--warning)'}}>
            <div className="teaser-step" style={{color: 'var(--warning)'}}>STEP 03</div>
            <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '0.5rem'}}>{t.step?.s3}</h3>
            <p className="text-muted">{t.step?.s3d}</p>
          </div>
        </div>
      </section>

      <section className="bottom-cta anim-fade d-3">
        <h2 className="font-display" style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>{t.cta?.title}</h2>
        <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '2.5rem'}}>{t.cta?.desc}</p>
        <button className="btn-primary btn-glow" onClick={() => navigate('/detect')}>{t.cta?.btn}</button>
      </section>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="anim-fade">
      <div className="header-clean">
        <h2>{t.works?.title}</h2>
        <p>{t.works?.desc}</p>
      </div>
      
      <div className="arch-grid">
        <div className="arch-col anim-fade dl-1">
          <div className="arch-line"></div>
          <div className="arch-number">01</div>
          <div className="arch-card">
            <UploadCloud size={24} className="text-primary" style={{marginBottom: '1.5rem'}} />
            <h3>{t.works?.s1}</h3>
            <p>{t.works?.s1d}</p>
          </div>
        </div>
        <div className="arch-col anim-fade dl-2">
          <div className="arch-line"></div>
          <div className="arch-number">02</div>
          <div className="arch-card">
            <Layers size={24} className="text-muted" style={{marginBottom: '1.5rem'}} />
            <h3>{t.works?.s2}</h3>
            <p>{t.works?.s2d}</p>
          </div>
        </div>
        <div className="arch-col anim-fade dl-3">
          <div className="arch-line"></div>
          <div className="arch-number">03</div>
          <div className="arch-card">
            <Cpu size={24} className="text-primary" style={{marginBottom: '1.5rem'}} />
            <h3>{t.works?.s3}</h3>
            <p>{t.works?.s3d}</p>
          </div>
        </div>
        <div className="arch-col anim-fade dl-4">
          <div className="arch-number">04</div>
          <div className="arch-card">
            <Activity size={24} className="text-muted" style={{marginBottom: '1.5rem'}} />
            <h3>{t.works?.s4}</h3>
            <p>{t.works?.s4d}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiseaseInfo = () => {
  const { t } = useContext(LanguageContext);
  const getIcon = (type) => type === 'healthy' ? <ShieldCheck size={20}/> : <Bug size={20}/>;

  return (
    <div className="anim-fade">
      <div className="header-clean">
        <h2>{t.info?.title}</h2>
        <p>{t.info?.desc}</p>
      </div>

      <div className="path-grid">
        {t.info?.diseases?.map((d, i) => (
          <div key={i} className={`glass-card path-item anim-fade dl-${(i%4)+1}`}>
            <div className="path-head">
              <h3 className="font-display" style={{fontSize: '1.3rem', margin: 0}}>{d.name}</h3>
              <div className={`path-icon ${d.type === 'healthy' ? 'icon-healthy' : 'icon-danger'}`}>
                {getIcon(d.type)}
              </div>
            </div>
            <div className="path-body">
              <div className="path-block">
                <span className="path-block-label">Symptoms</span>
                <p>{d.sym}</p>
              </div>
              <div className="path-block">
                <span className="path-block-label">Vector / Cause</span>
                <p>{d.cause}</p>
              </div>
              <div className="path-block" style={{margin: 0}}>
                <span className="path-block-label">Protocol</span>
                <p style={{color: 'var(--text-main)', fontWeight: 500}}>{d.act}</p>
              </div>
              <div className="sev-container">
                <span className="font-display" style={{fontSize: '0.85rem', fontWeight: 600, width: '30px'}}>{d.severity}%</span>
                <div className="sev-bar">
                  <div className="sev-fill" style={{ width: `${d.severity}%`, backgroundColor: d.severity > 80 ? 'var(--danger)' : d.severity > 40 ? 'var(--warning)' : 'var(--safe)' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetectDisease = () => {
  const { t } = useContext(LanguageContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(null); setError(null); }
  };

  const handleDetect = async () => {
    if (!image) return;
    setLoading(true); setError(null);
    try {
      const fd = new FormData(); fd.append("file", image);
      const res = await fetch("https://tomato-disease-backend-07ui.onrender.com/predict", { method: "POST", body: fd });
      const data = await res.json();

      if (!data.is_tomato_leaf) { setError(`${data.message}\n\n${data.suggestion}`); setLoading(false); return; }
      if (!data.success) throw new Error(data.error || "Failed");

      const map = {
        "Healthy": { sym: t.info?.diseases[0]?.sym, act: t.info?.diseases[0]?.act },
        "Bacterial Spot": { sym: t.info?.diseases[1]?.sym, act: t.info?.diseases[1]?.act },
        "Yellow Leaf Curl": { sym: t.info?.diseases[2]?.sym, act: t.info?.diseases[2]?.act },
        "Late Blight": { sym: t.info?.diseases[3]?.sym, act: t.info?.diseases[3]?.act },
      };
      const info = map[data.disease] || { sym: "Consult agricultural expert.", act: "Monitor plant closely." };

      setResult({ disease: data.disease, conf: `${data.confidence}%`, status: data.disease === "Healthy" ? "Healthy" : "Diseased", desc: info.sym, act: info.act, scores: data.all_scores });
    } catch (err) {
      setError(err.message.includes("fetch") ? "Connection to inference server refused. Ensure python backend is running." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setPreview(null); setResult(null); setImage(null); setError(null); };

  return (
    <div className="anim-fade">
      <div className="scan-layout">
        <div className="header-clean">
          <h2>{t.detect?.title}</h2>
          <p>{t.detect?.desc}</p>
        </div>

        {!preview ? (
          <div className="upload-box" onClick={() => inputRef.current.click()}>
            <div className="upload-icon-circle"><ScanLine size={32} /></div>
            <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '0.5rem'}}>{t.detect?.upload}</h3>
            <p style={{color: 'var(--text-muted)'}}>JPG, PNG up to 10MB</p>
            <input type="file" accept="image/*" ref={inputRef} onChange={handleImage} hidden />
          </div>
        ) : (
          <div className="glass-card anim-fade">
            <img src={preview} className="scan-img" alt="Sample" />
            
            {!result && !loading && !error && (
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button className="btn-primary" onClick={handleDetect}><BrainCircuit size={18} /> {t.detect?.predict}</button>
                <button className="btn-secondary" onClick={reset}>{t.detect?.cancel}</button>
              </div>
            )}

            {loading && (
              <div className="loader-box">
                <div className="spin-loader"></div>
                <h3 className="font-display">{t.detect?.processing}</h3>
              </div>
            )}

            {error && (
              <div style={{background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center'}}>
                <ShieldAlert size={48} className="text-danger" style={{margin: '0 auto 1rem'}} />
                <h3 className="font-display text-danger" style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>Analysis Rejected</h3>
                <p style={{fontSize: '1.1rem'}}>{error.split('\n\n')[0]}</p>
                <p className="text-muted mt-2">{error.split('\n\n')[1] || "Please upload a clear photo of a target leaf."}</p>
                <button className="btn-secondary" style={{marginTop: '2rem'}} onClick={reset}>Try Again</button>
              </div>
            )}

            {result && (
              <div className="anim-fade" style={{marginTop: '1rem'}}>
                <div className={`status-pill ${result.status.toLowerCase()}`}>
                  {result.status === "Healthy" ? <ShieldCheck size={24}/> : <Bug size={24}/>} {result.status}
                </div>

                <div className="res-grid">
                  <div className="res-box">
                    <span className="path-block-label">{t.detect?.id}</span>
                    <span className="font-display" style={{fontSize: '1.4rem', fontWeight: 600}}>{result.disease}</span>
                  </div>
                  <div className="res-box">
                    <span className="path-block-label">{t.detect?.conf}</span>
                    <span className="font-display" style={{fontSize: '1.4rem', fontWeight: 600}}>{result.conf}</span>
                  </div>
                  <div className="res-box full">
                    <span className="path-block-label">{t.detect?.notes}</span>
                    <p style={{fontSize: '1.1rem'}}>{result.desc}</p>
                  </div>
                  <div className="res-box full" style={{padding: 0, overflow: 'hidden'}}>
                    <div className="res-action">
                      <span className="path-block-label" style={{color: 'inherit'}}>{t.detect?.rec}</span>
                      <p style={{fontSize: '1.05rem', fontWeight: 500}}>{result.act}</p>
                    </div>
                  </div>
                </div>

                {result.scores && (
                  <div className="matrix-wrap">
                    <h4 className="path-block-label" style={{marginBottom: '1.5rem'}}>{t.detect?.prob}</h4>
                    <div>
                      {Object.entries(result.scores).sort((a,b)=>b[1]-a[1]).map(([name, score]) => {
                        const top = name === result.disease;
                        const color = score > 60 ? 'var(--danger)' : score > 20 ? 'var(--warning)' : 'var(--safe)';
                        return (
                          <div key={name} className={`m-row ${top?'top':''}`}>
                            <div className="m-label">{name}</div>
                            <div className="m-track"><div className="m-fill" style={{width:`${score}%`, backgroundColor:color}}/></div>
                            <div className="m-val" style={{color, width: '45px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 600}}>{score.toFixed(1)}%</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <button className="btn-secondary" style={{width: '100%', marginTop: '3rem'}} onClick={reset}>{t.detect?.reset}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  const { t } = useContext(LanguageContext);
  return(
    <div className="anim-fade">
      <div className="about-hero">
        <h1>{t.about?.title}</h1>
        <p>{t.about?.lead}</p>
      </div>

      <div className="mission-box anim-fade d-1">
        <Target size={48} className="text-primary" style={{margin: '0 auto 1.5rem'}} />
        <h2 className="font-display" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{t.about?.missionTitle}</h2>
        <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto'}}>{t.about?.missionDesc}</p>
      </div>
      
      <div className="values-grid">
        <div className="val-card anim-fade d-2">
          <div className="val-icon"><Lightbulb size={24}/></div>
          <h3>{t.about?.v1}</h3>
          <p>{t.about?.v1d}</p>
        </div>
        <div className="val-card anim-fade d-3">
          <div className="val-icon"><Microscope size={24}/></div>
          <h3>{t.about?.v2}</h3>
          <p>{t.about?.v2d}</p>
        </div>
        <div className="val-card anim-fade d-4">
          <div className="val-icon"><Leaf size={24}/></div>
          <h3>{t.about?.v3}</h3>
          <p>{t.about?.v3d}</p>
        </div>
      </div>

      <div className="header-clean anim-fade d-2" style={{marginBottom: '3rem'}}>
        <h2>{t.about?.teamTitle}</h2>
      </div>
      <div className="team-grid anim-fade d-3">
        <div className="team-member">
          <div className="team-av"><Users size={32}/></div>
          <h3>Manikkam</h3>
          <p>Research & Engineering</p>
        </div>
        <div className="team-member">
          <div className="team-av"><Users size={32}/></div>
          <h3>Karl Arvindraj</h3>
          <p>Lead Developer</p>
        </div>
        <div className="team-member">
          <div className="team-av"><Users size={32}/></div>
          <h3>Roshan</h3>
          <p>System Architect</p>
        </div>
        <div className="team-member">
          <div className="team-av"><Users size={32}/></div>
          <h3>Radheshyam</h3>
          <p>Project Guide</p>
        </div>
      </div>

      <div className="tech-stack anim-fade d-4">
        <h3>{t.about?.tech}</h3>
        <div className="tech-row">
          <div className="tech-badge"><Code size={18} className="text-primary"/> React UI</div>
          <div className="tech-badge"><Cpu size={18} className="text-accent"/> TensorFlow</div>
          <div className="tech-badge"><Database size={18} className="text-primary"/> Keras Models</div>
          <div className="tech-badge"><Server size={18} className="text-accent"/> Flask API</div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const { t } = useContext(LanguageContext);
  const [success, setSuccess] = useState(false);

  const submit = (e) => {
    e.preventDefault(); setSuccess(true);
    setTimeout(() => { setSuccess(false); e.target.reset(); }, 3000);
  };

  return(
    <div className="anim-fade">
      <div className="header-clean">
        <h2>{t.contact?.title}</h2>
        <p>{t.contact?.desc}</p>
      </div>

      <div className="contact-flex">
        <div className="contact-left anim-fade d-1">
          <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '1.5rem'}}>{t.contact?.team}</h3>
          <div className="glass-card" style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1rem'}}>
            <div className="team-av" style={{width: '48px', height: '48px', margin: 0}}><Users size={20} className="text-primary"/></div>
            <div>
              <div className="path-block-label">{t.contact?.dev}</div>
              <div className="font-display" style={{fontSize: '1.1rem', fontWeight: 600}}>Manikkam, Karl Arvindraj</div>
            </div>
          </div>
          <div className="glass-card" style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem'}}>
            <div className="team-av" style={{width: '48px', height: '48px', margin: 0}}><Settings size={20} className="text-muted"/></div>
            <div>
              <div className="path-block-label">{t.contact?.guide}</div>
              <div className="font-display" style={{fontSize: '1.1rem', fontWeight: 600}}>Roshan, Radheshyam</div>
            </div>
          </div>

          <div className="faq-sec">
            <h3 className="font-display" style={{fontSize: '1.4rem', marginBottom: '1rem'}}>{t.contact?.faqTitle}</h3>
            <div className="glass-card" style={{padding: '0 1.5rem'}}>
              <FAQItem question={t.faq?.q1} answer={t.faq?.a1} />
              <FAQItem question={t.faq?.q2} answer={t.faq?.a2} />
              <FAQItem question={t.faq?.q3} answer={t.faq?.a3} />
            </div>
          </div>
        </div>

        <div className="contact-right anim-fade d-2">
          <div className="glass-card">
            <h3 className="font-display" style={{fontSize: '1.6rem', marginBottom: '2rem'}}>{t.contact?.uplink}</h3>
            <form onSubmit={submit}>
              <div className="input-fld">
                <input type="text" placeholder=" " required />
                <label>{t.contact?.name}</label>
              </div>
              <div className="input-fld">
                <input type="email" placeholder=" " required />
                <label>{t.contact?.email}</label>
              </div>
              <div className="input-fld">
                <textarea rows="5" placeholder=" " required></textarea>
                <label>{t.contact?.msg}</label>
              </div>
              <button className="btn-primary" style={{width: '100%', background: success ? 'var(--text-main)' : ''}}>
                {success ? <><CheckCircle size={18}/> {t.contact?.success}</> : <><Mail size={18}/> {t.contact?.send}</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="info" element={<DiseaseInfo />} />
            <Route path="detect" element={<DetectDisease />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}
