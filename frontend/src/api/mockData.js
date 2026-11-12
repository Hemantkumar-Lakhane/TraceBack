// Realistic campus mock data for TraceBack - VIT Pune Edition
import { CAMPUS_CONFIG } from '../config/campusConfig.js';

export const DEMO_USERS = {
  student: {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@vit.edu",
    role: "STUDENT",
    studentId: "12110104",
    prn: "12110104",
    department: "Computer Engineering",
    phone: "+91 98201 23456",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  rohan: {
    id: 2,
    name: "Rohan Verma",
    email: "rohan.verma@vit.edu",
    role: "STUDENT",
    studentId: "12110208",
    prn: "12110208",
    department: "Mechanical Engineering",
    phone: "+91 98334 11223",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  ananya: {
    id: 9,
    name: "Ananya Iyer",
    email: "ananya.iyer@vit.edu",
    role: "STUDENT",
    studentId: "12110305",
    prn: "12110305",
    department: "Information Technology",
    phone: "+91 98112 33445",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  security: {
    id: 3,
    name: "Inspector Rajesh Kumar",
    email: "rajesh.kumar@vit.edu",
    role: "SECURITY",
    badgeNumber: "SEC-409",
    studentId: "SEC-409",
    station: "Central Security Office - Building 1 (Main Gate)",
    phone: "+91 (020) 2420-2180",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  admin: {
    id: 4,
    name: "Prof. Priya Nair",
    email: "priya.nair@vit.edu",
    role: "ADMIN",
    studentId: "ADM-101",
    department: "Dean of Student Affairs - VIT Pune",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
};

export const CAMPUS_LOCATIONS = CAMPUS_CONFIG.locations;

export const CATEGORIES = [
  { id: "ELECTRONICS", label: "Electronics & Gadgets", icon: "Laptop" },
  { id: "WALLETS_CARDS", label: "Wallets, Purses & IDs", icon: "CreditCard" },
  { id: "KEYS", label: "Keys & Keychains", icon: "Key" },
  { id: "BAGS_BACKPACKS", label: "Bags & Backpacks", icon: "Briefcase" },
  { id: "CLOTHING_ACCESSORIES", label: "Clothing & Wearables", icon: "Shirt" },
  { id: "BOOKS_STATIONERY", label: "Books & Study Material", icon: "BookOpen" },
  { id: "OTHER", label: "Other Valuables", icon: "HelpCircle" }
];

export const MOCK_REPORTS = [
  {
    id: 101,
    type: "LOST",
    status: "MATCHED",
    date: "2026-09-24T14:30:00Z",
    location: "Central Library - Reading Hall (Building 1, 3rd Floor)",
    item: {
      name: "Space Gray MacBook Air M2",
      category: "ELECTRONICS",
      brand: "Apple",
      color: "Space Gray",
      description: "Has a GitHub Octocat sticker on top lid and minor scratch near the USB-C port.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 1, name: "Aarav Sharma", email: "aarav.sharma@vit.edu" }
  },
  {
    id: 102,
    type: "FOUND",
    status: "MATCHED",
    date: "2026-09-24T16:00:00Z",
    location: "Central Library - Reading Hall (Building 1, 3rd Floor)",
    item: {
      name: "Apple MacBook Air in Dark Case",
      category: "ELECTRONICS",
      brand: "Apple",
      color: "Space Gray",
      description: "Found left on desk #14 near window. Has stickers on back lid.",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 2, name: "Rohan Verma (Student)", email: "rohan.verma@vit.edu" },
    storageLocation: "Central Security Office Locker A-12"
  },
  {
    id: 103,
    type: "LOST",
    status: "OPEN",
    date: "2026-09-25T09:15:00Z",
    location: "Sharad Arena - Central Canteen Quadrangle",
    item: {
      name: "Brown Leather Titan Wallet",
      category: "WALLETS_CARDS",
      brand: "Titan",
      color: "Brown",
      description: "Contains campus ID with PRN 12110104 and cafeteria smart card.",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 1, name: "Aarav Sharma", email: "aarav.sharma@vit.edu" }
  },
  {
    id: 104,
    type: "FOUND",
    status: "VERIFYING",
    date: "2026-09-25T11:00:00Z",
    location: "Computer Dept - Software Lab 4201 (Building 4)",
    item: {
      name: "Sony WH-1000XM4 Headphones",
      category: "ELECTRONICS",
      brand: "Sony",
      color: "Black",
      description: "Black wireless noise-canceling headphones in black zip case.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 3, name: "Inspector Rajesh Kumar", email: "rajesh.kumar@vit.edu" },
    storageLocation: "Central Security Office Shelf 4"
  },
  {
    id: 105,
    type: "FOUND",
    status: "RETURNED",
    date: "2026-09-22T13:00:00Z",
    location: "Boat Club / Campus Sports Ground",
    item: {
      name: "Milton Thermosteel 1L Water Bottle",
      category: "OTHER",
      brand: "Milton",
      color: "Silver",
      description: "Silver steel bottle with VIT robotics club sticker.",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 9, name: "Ananya Iyer", email: "ananya.iyer@vit.edu" },
    storageLocation: "Handed over to owner"
  },
  {
    id: 106,
    type: "LOST",
    status: "OPEN",
    date: "2026-09-26T08:00:00Z",
    location: "Sharad Arena - Central Canteen Quadrangle",
    item: {
      name: "Keychain with Navy Lanyard & Brass Keys",
      category: "KEYS",
      brand: "Campus Hostel Authority",
      color: "Blue / Brass",
      description: "3 brass keys and an RFID door tag on a navy blue lanyard.",
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80"
    },
    user: { id: 1, name: "Aarav Sharma", email: "aarav.sharma@vit.edu" }
  }
];

export const MOCK_MATCHES = [
  {
    id: 1,
    matchScore: 92,
    breakdown: {
      categoryScore: 40,
      locationScore: 28,
      timelineScore: 24
    },
    status: "ACTIVE",
    createdAt: "2026-09-24T16:05:00Z",
    lostReport: MOCK_REPORTS[0],
    foundReport: MOCK_REPORTS[1]
  }
];

export const MOCK_CLAIMS = [
  {
    id: 501,
    matchId: 1,
    claimant: {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav.sharma@vit.edu",
      studentId: "12110104",
      prn: "12110104",
      phone: "+91 98201 23456"
    },
    item: {
      name: "Space Gray MacBook Air M2",
      category: "ELECTRONICS",
      brand: "Apple",
      color: "Space Gray",
      storageLocation: "Central Security Office Locker A-12"
    },
    matchScore: 92,
    verificationAnswers: {
      secretMarks: "There is a small circular silver sticker of the React logo on the bottom right corner underneath the laptop chassis.",
      serialNumber: "FVFX9082MD6R",
      lockScreenHint: "Wallpaper is the Western Ghats at sunrise with user profile named 'Aarav S.'",
      pickupDate: "2026-09-27",
      pickupTime: "14:00"
    },
    proofFile: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
    status: "PENDING",
    submittedAt: "2026-09-25T10:30:00Z",
    reviewedAt: null,
    reviewedBy: null
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    matchId: 1,
    itemName: "Space Gray MacBook Air M2",
    otherParticipant: {
      id: 2,
      name: "Rohan Verma",
      role: "STUDENT (Finder)",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },
    lastMessage: "I deposited it at Central Security Desk Locker A-12 for safe custody!",
    lastMessageTime: "2026-09-24T16:45:00Z",
    unreadCount: 1,
    messages: [
      {
        id: 1,
        senderId: 2,
        senderName: "Rohan Verma",
        text: "Namaste Aarav! I found a MacBook Air on desk #14 in the 3rd floor Central Library reading hall.",
        timestamp: "2026-09-24T16:10:00Z",
        isMe: false
      },
      {
        id: 2,
        senderId: 1,
        senderName: "Aarav Sharma",
        text: "Hello Rohan! Oh thank you so much! Does it have a GitHub sticker on the top shell?",
        timestamp: "2026-09-24T16:15:00Z",
        isMe: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: "Rohan Verma",
        text: "Yes, exactly! It has the black and white Octocat sticker.",
        timestamp: "2026-09-24T16:18:00Z",
        isMe: false
      },
      {
        id: 4,
        senderId: 1,
        senderName: "Aarav Sharma",
        text: "That is 100% mine! Should we meet up or did you hand it over to campus security?",
        timestamp: "2026-09-24T16:22:00Z",
        isMe: true
      },
      {
        id: 5,
        senderId: 2,
        senderName: "Rohan Verma",
        text: "I deposited it at VIT Pune Central Security Office Locker A-12 for safe custody! You can submit a verification claim right through TraceBack.",
        timestamp: "2026-09-24T16:45:00Z",
        isMe: false
      }
    ]
  },
  {
    id: 2,
    matchId: 2,
    itemName: "Milton Thermosteel Water Bottle 1L",
    itemCategory: "OTHER",
    otherParticipant: {
      id: 9,
      name: "Ananya Iyer",
      role: "STUDENT (Finder)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    lastMessage: "Hi Aarav! I turned in your silver Milton bottle to the IoT lab staff desk.",
    lastMessageTime: "2026-11-12T10:59:00Z",
    unreadCount: 0,
    messages: [
      {
        id: 201,
        senderId: 9,
        senderName: "Ananya Iyer",
        text: "Hi Aarav! I found your Milton Thermosteel Water Bottle 1L in Mechanical Workshop & IoT Arena and handed it to the attendant.",
        timestamp: "2026-11-12T10:59:00Z",
        isMe: false
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Match Detected (92% Correlation)",
    message: "A found report matching your 'MacBook Air M2' was submitted by Rohan Verma.",
    type: "MATCH",
    link: "/matches/1",
    timestamp: "2026-09-24T16:05:00Z",
    read: false
  },
  {
    id: 2,
    title: "New Verification Message",
    message: "Rohan Verma sent a message regarding MacBook Air M2.",
    type: "CHAT",
    link: "/chat/1",
    timestamp: "2026-09-24T16:45:00Z",
    read: false
  },
  {
    id: 3,
    title: "Claim Submitted Successfully",
    message: "Your ownership claim #501 is currently queued for Security review.",
    type: "CLAIM",
    link: "/claims/501",
    timestamp: "2026-09-25T10:30:00Z",
    read: true
  }
];

export const MOCK_ADMIN_DATA = {
  stats: {
    totalUsers: 1482,
    totalLost: 432,
    totalFound: 389,
    totalMatches: 298,
    claimsVerified: 245,
    returnRate: "82.2%",
    avgTurnaroundHours: "14.5 hrs"
  },
  users: [
    { id: 1, name: "Aarav Sharma", email: "aarav.sharma@vit.edu", prn: "12110104", role: "STUDENT", status: "ACTIVE", joined: "2026-08-15" },
    { id: 2, name: "Rohan Verma", email: "rohan.verma@vit.edu", prn: "12110208", role: "STUDENT", status: "ACTIVE", joined: "2026-09-01" },
    { id: 3, name: "Inspector Rajesh Kumar", email: "rajesh.kumar@vit.edu", prn: "SEC-409", role: "SECURITY", status: "ACTIVE", joined: "2026-07-01" },
    { id: 4, name: "Prof. Priya Nair", email: "priya.nair@vit.edu", prn: "ADM-101", role: "ADMIN", status: "ACTIVE", joined: "2026-06-10" },
    { id: 9, name: "Ananya Iyer", email: "ananya.iyer@vit.edu", prn: "12110305", role: "STUDENT", status: "ACTIVE", joined: "2026-09-05" }
  ],
  moderationQueue: [
    {
      id: 901,
      reportId: 108,
      title: "Commercial promotional flyers left on desk",
      reason: "Spam / Advertising - Not a legitimate lost/found item",
      flaggedBy: "Inspector Rajesh Kumar",
      dateFlagged: "2026-09-25T12:00:00Z",
      status: "PENDING_REVIEW"
    }
  ]
};
