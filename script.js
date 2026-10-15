/**
 * ==============================================================================
 * EventBuddy – Smart Event Volunteer Coordinator Chatbot
 * Vanilla JavaScript (ES6+) Implementation
 * 
 * Features:
 * 1. Rule-Based Chatbot Engine & Conversational Registration State Machine
 * 2. Volunteer Registration & Validation (Duplicate checks, Format checks)
 * 3. Coordinator Dashboard with Real-time Metrics & Role Distribution
 * 4. Full CRUD for Events, Volunteers, and Task Allocations
 * 5. Self-Service Volunteer Duty Slip Lookup & Printable Pass
 * 6. HTML5 localStorage Client-Side Persistence & Reset Demo Data
 * ==============================================================================
 */

// Global App State & Storage Keys
const STORAGE_KEYS = {
  EVENTS: 'eventbuddy_events_v1',
  VOLUNTEERS: 'eventbuddy_volunteers_v1',
  TASKS: 'eventbuddy_tasks_v1',
  CHAT: 'eventbuddy_chat_v1'
};

// Initial Realistic Demo Data for College Event Showcase
const SEED_DATA = {
  events: [
    {
      id: 'EV-101',
      title: 'InnovateX 2026: National Tech Symposium',
      date: '2026-11-12',
      time: '09:00 AM - 05:00 PM',
      venue: 'Main Auditorium & Tech Lab 3',
      description: 'Flagship annual technological symposium featuring project exhibitions, a 24-hr coding hackathon, and keynote addresses from AI industry leaders.',
      roles: ['Registration Desk', 'Technical Support', 'Event Management', 'Hospitality'],
      targetVolunteers: 20
    },
    {
      id: 'EV-102',
      title: 'CulturalFest: Tarang 2026',
      date: '2026-11-20',
      time: '10:00 AM - 08:30 PM',
      venue: 'Open Air Theatre & Campus Amphitheatre',
      description: 'Grand inter-collegiate cultural festival hosting music battles, classical and western dance performances, drama acts, and campus fashion walk.',
      roles: ['Event Management', 'Decoration', 'Publicity', 'Hospitality'],
      targetVolunteers: 25
    },
    {
      id: 'EV-103',
      title: 'HackSphere: 24-Hour National Hackathon',
      date: '2026-12-05',
      time: '08:00 AM - 08:00 AM (Next Day)',
      venue: 'Central Computer Center (Lab 1 to 4)',
      description: 'High-intensity overnight software buildathon tackling real-world challenges in Smart Campuses, Healthcare, and Sustainable Tech.',
      roles: ['Technical Support', 'Registration Desk', 'Hospitality'],
      targetVolunteers: 15
    },
    {
      id: 'EV-104',
      title: 'Annual Sports Meet: Olympia 2026',
      date: '2026-12-18',
      time: '07:30 AM - 06:00 PM',
      venue: 'College Sports Pavilion & Athletic Grounds',
      description: 'Inter-department athletic games covering 100m sprint, football, basketball championships, relay races, and faculty exhibition cricket.',
      roles: ['Event Management', 'Registration Desk', 'Publicity'],
      targetVolunteers: 18
    }
  ],
  volunteers: [
    {
      id: 'EB-2026-1001',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      department: 'Computer Engineering',
      year: 'TE (Third Year)',
      preferredRole: 'Registration Desk',
      shift: 'Morning Shift (8:00 AM - 1:00 PM)',
      status: 'Assigned',
      registeredAt: '2026-10-10T10:15:00'
    },
    {
      id: 'EB-2026-1002',
      fullName: 'Priya Deshmukh',
      email: 'priya.d@college.edu',
      department: 'Information Technology',
      year: 'SE (Second Year)',
      preferredRole: 'Technical Support',
      shift: 'Full Day (8:30 AM - 5:30 PM)',
      status: 'Assigned',
      registeredAt: '2026-10-11T11:30:00'
    },
    {
      id: 'EB-2026-1003',
      fullName: 'Aman Verma',
      email: 'aman.verma@college.edu',
      department: 'Artificial Intelligence & Data Science',
      year: 'TE (Third Year)',
      preferredRole: 'Event Management',
      shift: 'Afternoon Shift (12:30 PM - 5:30 PM)',
      status: 'Pending',
      registeredAt: '2026-10-12T09:45:00'
    },
    {
      id: 'EB-2026-1004',
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@college.edu',
      department: 'Electronics & Telecommunication',
      year: 'FE (First Year)',
      preferredRole: 'Decoration',
      shift: 'Morning Shift (8:00 AM - 1:00 PM)',
      status: 'Assigned',
      registeredAt: '2026-10-12T14:20:00'
    },
    {
      id: 'EB-2026-1005',
      fullName: 'Rohan Kulkarni',
      email: 'rohan.k@college.edu',
      department: 'Mechanical Engineering',
      year: 'BE (Final Year)',
      preferredRole: 'Hospitality',
      shift: 'Full Day (8:30 AM - 5:30 PM)',
      status: 'Pending',
      registeredAt: '2026-10-13T16:00:00'
    },
    {
      id: 'EB-2026-1006',
      fullName: 'Sneha Patil',
      email: 'sneha.patil@college.edu',
      department: 'Computer Engineering',
      year: 'SE (Second Year)',
      preferredRole: 'Publicity',
      shift: 'Afternoon Shift (12:30 PM - 5:30 PM)',
      status: 'Completed',
      registeredAt: '2026-10-09T08:50:00'
    }
  ],
  tasks: [
    {
      id: 'TSK-101',
      eventId: 'EV-101',
      eventTitle: 'InnovateX 2026: National Tech Symposium',
      volunteerId: 'EB-2026-1001',
      volunteerName: 'Rahul Sharma',
      role: 'Registration Desk',
      shift: 'Morning Shift (8:00 AM - 1:00 PM)',
      reportingTime: '08:15 AM Sharp',
      location: 'Auditorium Entrance Desk 1',
      dutyDescription: 'Verify attendee college identity cards, issue barcode-enabled delegate passes and participant welcome stationery kits.',
      status: 'In Progress'
    },
    {
      id: 'TSK-102',
      eventId: 'EV-103',
      eventTitle: 'HackSphere: 24-Hour National Hackathon',
      volunteerId: 'EB-2026-1002',
      volunteerName: 'Priya Deshmukh',
      role: 'Technical Support',
      shift: 'Full Day (8:30 AM - 5:30 PM)',
      reportingTime: '08:00 AM Sharp',
      location: 'Central Computer Center Lab 2',
      dutyDescription: 'Inspect LAN gigabit switches, verify hackathon Wi-Fi credentials distribution, and assist teams with multi-plug power extension cords.',
      status: 'Pending'
    },
    {
      id: 'TSK-103',
      eventId: 'EV-102',
      eventTitle: 'CulturalFest: Tarang 2026',
      volunteerId: 'EB-2026-1004',
      volunteerName: 'Ananya Iyer',
      role: 'Decoration',
      shift: 'Morning Shift (8:00 AM - 1:00 PM)',
      reportingTime: '08:00 AM',
      location: 'Amphitheatre Stage Backstage',
      dutyDescription: 'Coordinate floral stage rangoli, main entrance arch banners, and lighting checklist ahead of the VIP inaugural ceremony.',
      status: 'In Progress'
    },
    {
      id: 'TSK-104',
      eventId: 'EV-101',
      eventTitle: 'InnovateX 2026: National Tech Symposium',
      volunteerId: 'EB-2026-1006',
      volunteerName: 'Sneha Patil',
      role: 'Publicity',
      shift: 'Afternoon Shift (12:30 PM - 5:30 PM)',
      reportingTime: '12:15 PM',
      location: 'Media Booth & Seminar Hall B',
      dutyDescription: 'Live photography, update college social media handles, record winner reactions, and escort press journalists.',
      status: 'Completed'
    }
  ]
};

// ==============================================================================
// 1. DATA ACCESS LAYER (localStorage API)
// ==============================================================================
const Storage = {
  getEvents() {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      this.setEvents(SEED_DATA.events);
      return SEED_DATA.events;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing events storage', e);
      return SEED_DATA.events;
    }
  },
  setEvents(events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getVolunteers() {
    const raw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    if (!raw) {
      this.setVolunteers(SEED_DATA.volunteers);
      return SEED_DATA.volunteers;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing volunteers storage', e);
      return SEED_DATA.volunteers;
    }
  },
  setVolunteers(volunteers) {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(volunteers));
  },

  getTasks() {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      this.setTasks(SEED_DATA.tasks);
      return SEED_DATA.tasks;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing tasks storage', e);
      return SEED_DATA.tasks;
    }
  },
  setTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getChatHistory() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },
  setChatHistory(history) {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(history));
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_DATA.events));
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(SEED_DATA.volunteers));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_DATA.tasks));
    localStorage.removeItem(STORAGE_KEYS.CHAT);
  }
};

// ==============================================================================
// 2. CHATBOT STATE MACHINE & RULE-BASED MATCHING ENGINE
// ==============================================================================
const Chatbot = {
  // Conversational registration finite state machine
  regState: {
    active: false,
    step: 0,
    tempData: {}
  },

  // Steps in registration wizard
  STEPS: [
    'NAME',
    'EMAIL',
    'DEPT',
    'YEAR',
    'ROLE',
    'SHIFT'
  ],

  // Knowledge Base for FAQs & Inquiries
  knowledge: {
    roles: [
      { name: 'Registration Desk', desc: 'Verify attendees, hand out name badges, collect forms & distribute conference kits.' },
      { name: 'Technical Support', desc: 'Audio/Visual setup, projector maintenance, lab computer configuration & Wi-Fi support.' },
      { name: 'Event Management', desc: 'Auditorium seating, stage queue coordinator, timeline keeping & guest welcoming.' },
      { name: 'Decoration', desc: 'Campus entrance banners, stage floral/rangoli styling, selfie booths & photo zones.' },
      { name: 'Publicity', desc: 'Photography, videography, real-time social media stories & media coverage.' },
      { name: 'Hospitality', desc: 'Escorting external VIP speakers, arranging refreshments, and coordinating judge evaluations.' }
    ],
    faqs: {
      dates: 'InnovateX 2026 is scheduled for Nov 12, Tarang CulturalFest is on Nov 20, HackSphere Hackathon is on Dec 5-6, and Annual Sports Meet is on Dec 18.',
      venues: 'Events are hosted at the Main Auditorium, Campus Amphitheatre, Central Computer Lab, and College Sports Pavilion.',
      eligibility: 'All students currently enrolled in First Year (FE), Second Year (SE), Third Year (TE), or Final Year (BE) across all engineering departments are eligible to volunteer.',
      perks: 'Every registered volunteer who completes their duty slot receives an Official Certificate of Volunteerism, duty attendance concession, and 15 Activity Credit Hours toward extra-curricular requirements!',
      contact: 'For emergency coordinator inquiries, please contact Prof. K. Sharma (Faculty Convener, ext 402) or Student General Secretary at coordinator@college.edu or +91 98765 43210.'
    }
  },

  init() {
    this.bindEvents();
    const history = Storage.getChatHistory();
    if (history.length === 0) {
      this.sendWelcomeMessage();
    } else {
      this.renderHistory(history);
    }
  },

  bindEvents() {
    const form = document.getElementById('chatInputForm');
    const input = document.getElementById('chatInputText');
    const clearBtn = document.getElementById('btnClearChat');
    const registerFlowBtn = document.getElementById('btnRestartChatRegistration');
    const quickRepliesBox = document.getElementById('quickRepliesBox');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        this.handleUserInput(text);
        input.value = '';
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear current chat conversation?')) {
          Storage.setChatHistory([]);
          this.regState = { active: false, step: 0, tempData: {} };
          const container = document.getElementById('chatMessages');
          container.innerHTML = '';
          this.sendWelcomeMessage();
          Toast.show('Conversation cleared', 'info');
        }
      });
    }

    if (registerFlowBtn) {
      registerFlowBtn.addEventListener('click', () => {
        this.startRegistrationWizard();
      });
    }

    if (quickRepliesBox) {
      quickRepliesBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-chip');
        if (btn) {
          const query = btn.dataset.query;
          this.handleUserInput(query);
        }
      });
    }
  },

  sendWelcomeMessage() {
    const welcomeHtml = `
      <p>👋 Hello! I am <strong>EventBuddy Assistant</strong>, your smart college volunteer coordinator chatbot.</p>
      <p class="mt-2">I can answer inquiries on college events, duty slots, venues, and guide you through volunteer registration!</p>
      <div class="chat-rich-card">
        <h5>⚡ Instant Capabilities:</h5>
        <div class="chat-rich-card-item"><span>📅 College Events & Dates</span><strong>Live</strong></div>
        <div class="chat-rich-card-item"><span>📝 Guided Volunteer Registration</span><strong>Interactive</strong></div>
        <div class="chat-rich-card-item"><span>📋 Duty Pass Verification</span><strong>Self-Service</strong></div>
        <div class="chat-rich-card-item"><span>🏆 Volunteer Certificates & Credits</span><strong>15 Hours</strong></div>
      </div>
      <p class="mt-2">Try tapping a quick reply below or ask me anything!</p>
    `;
    this.addBotMessage(welcomeHtml);
  },

  renderHistory(history) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    history.forEach(item => {
      this.renderMessageElement(item.sender, item.html, item.timestamp);
    });
    this.scrollToBottom();
  },

  addUserMessage(text) {
    const time = this.getCurrentTime();
    this.renderMessageElement('user', this.escapeHtml(text), time);
    this.saveMessage('user', this.escapeHtml(text), time);
    this.scrollToBottom();
  },

  addBotMessage(html) {
    const time = this.getCurrentTime();
    this.renderMessageElement('bot', html, time);
    this.saveMessage('bot', html, time);
    this.scrollToBottom();
  },

  saveMessage(sender, html, timestamp) {
    const history = Storage.getChatHistory();
    history.push({ sender, html, timestamp });
    Storage.setChatHistory(history);
  },

  renderMessageElement(sender, html, timestamp) {
    const container = document.getElementById('chatMessages');
    const row = document.createElement('div');
    row.className = `message-row ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = sender === 'bot' ? '🤖' : '🎓';

    const bubbleBox = document.createElement('div');
    bubbleBox.className = 'msg-bubble-container';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = html;

    const timeElem = document.createElement('div');
    timeElem.className = 'msg-time';
    timeElem.textContent = timestamp;

    bubbleBox.appendChild(bubble);
    bubbleBox.appendChild(timeElem);

    row.appendChild(avatar);
    row.appendChild(bubbleBox);
    container.appendChild(row);
  },

  showTyping(show = true) {
    const el = document.getElementById('typingIndicator');
    if (el) {
      el.style.display = show ? 'flex' : 'none';
      if (show) this.scrollToBottom();
    }
  },

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ----------------------------------------------------------------------------
  // INPUT PROCESSING & RULE-BASED NLP MATCHING
  // ----------------------------------------------------------------------------
  handleUserInput(text) {
    this.addUserMessage(text);
    this.showTyping(true);

    setTimeout(() => {
      this.showTyping(false);
      this.processInput(text);
    }, 450);
  },

  processInput(rawText) {
    const text = rawText.toLowerCase().trim();

    // 1. If currently inside Registration Wizard State Machine
    if (this.regState.active) {
      this.advanceRegistrationWizard(rawText);
      return;
    }

    // 2. Cancellation / Restart Keywords
    if (text === 'cancel' || text === 'stop' || text === 'restart' || text === 'reset') {
      this.regState = { active: false, step: 0, tempData: {} };
      this.addBotMessage('Current flow has been stopped. How can I assist you now? You can explore events, volunteer roles, or register!');
      return;
    }

    // 3. Rule matching: Intent Classification via Regex & Keyword Rules
    // Intent: Register
    if (/^(register|signup|sign up|join|enroll|apply|volunteer registration|i want to volunteer|register as volunteer)$/i.test(text) || text.includes('register as volunteer') || text.includes('how to register')) {
      this.startRegistrationWizard();
      return;
    }

    // Intent: View Events
    if (/^(view events|events|event|schedule|what events|list events|upcoming events)$/i.test(text) || text.includes('event') || text.includes('fests') || text.includes('symposium')) {
      this.respondEventsList();
      return;
    }

    // Intent: Volunteer Roles
    if (/^(volunteer roles|roles|role|positions|duties|what roles)$/i.test(text) || text.includes('role') || text.includes('duty') || text.includes('duties')) {
      this.respondRolesList();
      return;
    }

    // Intent: My Tasks / Duty Slip Lookup
    if (/^(my tasks|my task|check task|duty slip|my duties|check duties|assigned task)$/i.test(text) || text.includes('my task') || text.includes('duty slip')) {
      this.respondMyTasksPrompt();
      return;
    }

    // Intent: Checking ID directly (e.g. EB-2026-1001 or email)
    if (/^eb-\d{4}-\d{3,5}$/i.test(text) || text.includes('@')) {
      this.lookupAndRespondTask(text);
      return;
    }

    // Intent: Venue & Locations
    if (text.includes('venue') || text.includes('where') || text.includes('location') || text.includes('auditorium')) {
      this.addBotMessage(`
        <p>📍 <strong>College Event Venues:</strong></p>
        <p class="mt-2">${this.knowledge.faqs.venues}</p>
        <p class="mt-2 text-sm text-muted">Reporting desks are set up at each entrance 30 minutes before event kick-off.</p>
      `);
      return;
    }

    // Intent: Dates & Schedule
    if (text.includes('date') || text.includes('time') || text.includes('when') || text.includes('schedule')) {
      this.addBotMessage(`
        <p>⏰ <strong>Event Schedules & Dates:</strong></p>
        <p class="mt-2">${this.knowledge.faqs.dates}</p>
        <div class="chat-action-btn-row">
          <button class="btn btn-primary btn-sm" onclick="App.navigateToTab('events')">Browse All Events</button>
        </div>
      `);
      return;
    }

    // Intent: Eligibility & Requirements
    if (text.includes('eligible') || text.includes('eligibility') || text.includes('who can') || text.includes('qualification')) {
      this.addBotMessage(`
        <p>🎓 <strong>Volunteer Eligibility:</strong></p>
        <p class="mt-2">${this.knowledge.faqs.eligibility}</p>
        <p class="mt-2">No prior experience required; student coordinators will provide pre-event briefing.</p>
      `);
      return;
    }

    // Intent: Certificate & Credit Hours
    if (text.includes('certificate') || text.includes('credit') || text.includes('perk') || text.includes('attendance') || text.includes('benefit')) {
      this.addBotMessage(`
        <p>🏆 <strong>Volunteer Benefits & Recognition:</strong></p>
        <p class="mt-2">${this.knowledge.faqs.perks}</p>
      `);
      return;
    }

    // Intent: Contact Coordinator
    if (text.includes('contact') || text.includes('phone') || text.includes('call') || text.includes('coordinator') || text.includes('faculty') || text.includes('help')) {
      this.addBotMessage(`
        <p>📞 <strong>Official Coordinator Contact:</strong></p>
        <p class="mt-2">${this.knowledge.faqs.contact}</p>
        <div class="chat-rich-card mt-2">
          <div><strong>Event Desk:</strong> Room 204, Student Affairs Wing</div>
          <div><strong>Office Hours:</strong> 10:00 AM – 5:00 PM (Mon to Sat)</div>
        </div>
      `);
      return;
    }

    // Intent: Greetings
    if (/^(hi|hello|hey|hola|good morning|good afternoon|good evening|yo)$/i.test(text)) {
      this.addBotMessage(`
        <p>👋 Hello there! How can I assist you with your college event volunteering today?</p>
        <p class="mt-2 text-sm text-muted">You can register as a volunteer, browse upcoming events, or check your duty assignment!</p>
      `);
      return;
    }

    // Intent: Thanks
    if (text.includes('thank') || text.includes('thx') || text.includes('appreciate')) {
      this.addBotMessage(`
        <p>🎉 You're very welcome! Feel free to ask if you have any more questions. See you at the events!</p>
      `);
      return;
    }

    // Fallback Response
    this.respondFallback(rawText);
  },

  // Fallback with Helpful Action Buttons
  respondFallback(userText) {
    const html = `
      <p>🤔 I'm not quite sure how to answer: <em>"${this.escapeHtml(userText)}"</em>.</p>
      <p class="mt-2">As a <strong>rule-based coordinator assistant</strong>, I can help you with these specific topics:</p>
      <div class="chat-action-btn-row">
        <button class="quick-chip" onclick="Chatbot.handleUserInput('Register as Volunteer')">📝 Register as Volunteer</button>
        <button class="quick-chip" onclick="Chatbot.handleUserInput('View Events')">📅 View Events</button>
        <button class="quick-chip" onclick="Chatbot.handleUserInput('Volunteer Roles')">👥 Volunteer Roles</button>
        <button class="quick-chip" onclick="Chatbot.handleUserInput('My Tasks')">📋 My Tasks</button>
        <button class="quick-chip" onclick="Chatbot.handleUserInput('Contact Coordinator')">📞 Contact Coordinator</button>
      </div>
    `;
    this.addBotMessage(html);
  },

  // Respond with dynamic events list
  respondEventsList() {
    const events = Storage.getEvents();
    if (events.length === 0) {
      this.addBotMessage('<p>No college events are currently scheduled in the system.</p>');
      return;
    }

    let itemsHtml = events.map(ev => `
      <div class="chat-rich-card">
        <h5>${this.escapeHtml(ev.title)}</h5>
        <div class="chat-rich-card-item"><span>📅 Date & Time:</span><strong>${ev.date} (${ev.time})</strong></div>
        <div class="chat-rich-card-item"><span>📍 Venue:</span><strong>${this.escapeHtml(ev.venue)}</strong></div>
        <div class="chat-rich-card-item"><span>👥 Target Volunteers:</span><strong>${ev.targetVolunteers} Slots</strong></div>
        <p class="mt-2 text-xs text-muted">${this.escapeHtml(ev.description)}</p>
      </div>
    `).join('');

    const html = `
      <p>📅 <strong>Here are the upcoming College Events:</strong></p>
      ${itemsHtml}
      <div class="chat-action-btn-row mt-2">
        <button class="btn btn-primary btn-sm" onclick="Chatbot.startRegistrationWizard()">Register to Volunteer</button>
        <button class="btn btn-secondary btn-sm" onclick="App.navigateToTab('events')">Full Event Dashboard</button>
      </div>
    `;
    this.addBotMessage(html);
  },

  // Respond with volunteer roles
  respondRolesList() {
    let rolesHtml = this.knowledge.roles.map(r => `
      <div class="chat-rich-card-item">
        <span><strong>${r.name}:</strong></span>
        <span>${r.desc}</span>
      </div>
    `).join('');

    const html = `
      <p>👥 <strong>Approved College Volunteer Roles:</strong></p>
      <div class="chat-rich-card mt-2">
        ${rolesHtml}
      </div>
      <p class="mt-2 text-sm">Would you like to register for one of these roles now?</p>
      <div class="chat-action-btn-row">
        <button class="btn btn-primary btn-sm" onclick="Chatbot.startRegistrationWizard()">Yes, Register Me!</button>
      </div>
    `;
    this.addBotMessage(html);
  },

  // Prompt for Duty Slip verification
  respondMyTasksPrompt() {
    const html = `
      <p>📋 <strong>Volunteer Duty Verification:</strong></p>
      <p class="mt-2">Please enter your <strong>Registration ID</strong> (e.g., <code>EB-2026-1001</code>) or your registered <strong>College Email</strong>:</p>
      <div class="chat-action-btn-row">
        <button class="quick-chip" onclick="Chatbot.lookupAndRespondTask('EB-2026-1001')">Try Demo ID: EB-2026-1001</button>
        <button class="quick-chip" onclick="Chatbot.lookupAndRespondTask('EB-2026-1002')">Try Demo ID: EB-2026-1002</button>
      </div>
    `;
    this.addBotMessage(html);
  },

  // Lookup task and display inside chat
  lookupAndRespondTask(identifier) {
    const volunteers = Storage.getVolunteers();
    const tasks = Storage.getTasks();
    const cleanId = identifier.trim().toLowerCase();

    const volunteer = volunteers.find(v => 
      v.id.toLowerCase() === cleanId || 
      v.email.toLowerCase() === cleanId
    );

    if (!volunteer) {
      this.addBotMessage(`
        <p>❌ No registered volunteer found for <code>${this.escapeHtml(identifier)}</code>.</p>
        <p class="mt-2 text-sm text-muted">Please check your ID or email. If you haven't registered yet, tap below to enroll!</p>
        <div class="chat-action-btn-row">
          <button class="btn btn-primary btn-sm" onclick="Chatbot.startRegistrationWizard()">Register as Volunteer</button>
        </div>
      `);
      return;
    }

    const assignedTasks = tasks.filter(t => t.volunteerId === volunteer.id);

    if (assignedTasks.length === 0) {
      this.addBotMessage(`
        <p>👋 Hello, <strong>${this.escapeHtml(volunteer.fullName)}</strong> (ID: <code>${volunteer.id}</code>)!</p>
        <div class="chat-rich-card mt-2">
          <h5>Duty Status: <span class="badge badge-amber">Pending Allocation</span></h5>
          <p class="text-sm mt-1">You are successfully registered for <strong>${this.escapeHtml(volunteer.preferredRole)}</strong> (${volunteer.department}, ${volunteer.year}).</p>
          <p class="text-xs text-muted mt-2">The event coordinator has not assigned your specific desk duty yet. Please check back shortly or visit the Coordinator Desk.</p>
        </div>
      `);
      return;
    }

    let taskCards = assignedTasks.map(t => `
      <div class="chat-rich-card">
        <h5>🎉 Assigned Duty: ${this.escapeHtml(t.role)}</h5>
        <div class="chat-rich-card-item"><span>🏆 Event:</span><strong>${this.escapeHtml(t.eventTitle)}</strong></div>
        <div class="chat-rich-card-item"><span>⏰ Reporting Time:</span><strong>${this.escapeHtml(t.reportingTime)}</strong></div>
        <div class="chat-rich-card-item"><span>⏱️ Shift:</span><strong>${this.escapeHtml(t.shift)}</strong></div>
        <div class="chat-rich-card-item"><span>📍 Location:</span><strong>${this.escapeHtml(t.location)}</strong></div>
        <div class="chat-rich-card-item"><span>📌 Status:</span><span class="badge ${t.status === 'Completed' ? 'badge-green' : 'badge-blue'}">${t.status}</span></div>
        <p class="text-xs text-muted mt-2"><strong>Instructions:</strong> ${this.escapeHtml(t.dutyDescription)}</p>
      </div>
    `).join('');

    this.addBotMessage(`
      <p>✅ <strong>Official Duty Record for ${this.escapeHtml(volunteer.fullName)}:</strong></p>
      ${taskCards}
      <div class="chat-action-btn-row mt-2">
        <button class="btn btn-primary btn-sm" onclick="App.openVolunteerDetailsModal('${volunteer.id}')">Print Official Pass</button>
      </div>
    `);
  },

  // ----------------------------------------------------------------------------
  // CONVERSATIONAL REGISTRATION WIZARD (STATE MACHINE)
  // ----------------------------------------------------------------------------
  startRegistrationWizard() {
    this.regState = {
      active: true,
      step: 0,
      tempData: {}
    };

    const html = `
      <p>📝 <strong>College Volunteer Registration Wizard</strong></p>
      <p class="mt-2">Welcome! I will guide you step-by-step. You can cancel anytime by typing <code>cancel</code>.</p>
      <p class="mt-2"><strong>Step 1 of 6:</strong> What is your <strong>Full Name</strong>?</p>
    `;
    this.addBotMessage(html);
  },

  advanceRegistrationWizard(userInput) {
    const stepName = this.STEPS[this.regState.step];
    const input = userInput.trim();

    if (input.toLowerCase() === 'cancel') {
      this.regState = { active: false, step: 0, tempData: {} };
      this.addBotMessage('Registration has been cancelled. How else may I assist you?');
      return;
    }

    switch (stepName) {
      case 'NAME':
        if (input.length < 3) {
          this.addBotMessage('⚠️ Please enter a valid full name with at least 3 letters.');
          return;
        }
        this.regState.tempData.fullName = input;
        this.regState.step++;
        this.addBotMessage(`
          <p>Nice to meet you, <strong>${this.escapeHtml(input)}</strong>!</p>
          <p class="mt-2"><strong>Step 2 of 6:</strong> What is your official <strong>College Email</strong> address?</p>
          <p class="text-xs text-muted">Example: <code>yourname@college.edu</code></p>
        `);
        break;

      case 'EMAIL':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          this.addBotMessage('⚠️ That does not look like a valid email address. Please enter a valid email format (e.g. <code>student@college.edu</code>):');
          return;
        }
        // Duplicate Email Check
        const existingVol = Storage.getVolunteers().find(v => v.email.toLowerCase() === input.toLowerCase());
        if (existingVol) {
          this.addBotMessage(`
            <p>⚠️ A volunteer is already registered with this email!</p>
            <div class="chat-rich-card mt-2">
              <div><strong>Name:</strong> ${this.escapeHtml(existingVol.fullName)}</div>
              <div><strong>Registration ID:</strong> <code>${existingVol.id}</code></div>
              <div><strong>Assigned Status:</strong> ${existingVol.status}</div>
            </div>
            <p class="mt-2">You can use your Registration ID to lookup duties, or provide another email to continue registration:</p>
          `);
          return;
        }

        this.regState.tempData.email = input;
        this.regState.step++;
        this.addBotMessage(`
          <p>Email recorded: <code>${this.escapeHtml(input)}</code></p>
          <p class="mt-2"><strong>Step 3 of 6:</strong> Which <strong>Engineering Department</strong> do you study in?</p>
          <div class="chat-action-btn-row mt-2">
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Computer Engineering')">Computer Engineering</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Information Technology')">Information Technology</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('AI & Data Science')">AI & Data Science</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Electronics & Telecom')">Electronics & Telecom</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Mechanical Engineering')">Mechanical Engineering</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Civil Engineering')">Civil Engineering</button>
          </div>
        `);
        break;

      case 'DEPT':
        if (input.length < 2) {
          this.addBotMessage('⚠️ Please enter your department name.');
          return;
        }
        this.regState.tempData.department = input;
        this.regState.step++;
        this.addBotMessage(`
          <p>Department: <strong>${this.escapeHtml(input)}</strong></p>
          <p class="mt-2"><strong>Step 4 of 6:</strong> What is your <strong>Year of Study</strong>?</p>
          <div class="chat-action-btn-row mt-2">
            <button class="quick-chip" onclick="Chatbot.handleUserInput('FE (First Year)')">FE (First Year)</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('SE (Second Year)')">SE (Second Year)</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('TE (Third Year)')">TE (Third Year)</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('BE (Final Year)')">BE (Final Year)</button>
          </div>
        `);
        break;

      case 'YEAR':
        this.regState.tempData.year = input;
        this.regState.step++;
        this.addBotMessage(`
          <p>Year: <strong>${this.escapeHtml(input)}</strong></p>
          <p class="mt-2"><strong>Step 5 of 6:</strong> Which <strong>Volunteer Role</strong> would you prefer?</p>
          <div class="chat-action-btn-row mt-2">
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Registration Desk')">Registration Desk</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Technical Support')">Technical Support</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Event Management')">Event Management</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Decoration')">Decoration</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Publicity')">Publicity</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Hospitality')">Hospitality</button>
          </div>
        `);
        break;

      case 'ROLE':
        this.regState.tempData.preferredRole = input;
        this.regState.step++;
        this.addBotMessage(`
          <p>Preferred Role: <strong>${this.escapeHtml(input)}</strong></p>
          <p class="mt-2"><strong>Step 6 of 6 (Final):</strong> What is your <strong>Availability or Preferred Shift</strong>?</p>
          <div class="chat-action-btn-row mt-2">
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Morning Shift (8:00 AM - 1:00 PM)')">Morning Shift (8:00 AM - 1:00 PM)</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Afternoon Shift (12:30 PM - 5:30 PM)')">Afternoon Shift (12:30 PM - 5:30 PM)</button>
            <button class="quick-chip" onclick="Chatbot.handleUserInput('Full Day (8:30 AM - 5:30 PM)')">Full Day (8:30 AM - 5:30 PM)</button>
          </div>
        `);
        break;

      case 'SHIFT':
        this.regState.tempData.shift = input;
        this.completeConversationalRegistration();
        break;
    }
  },

  completeConversationalRegistration() {
    const data = this.regState.tempData;
    const newId = `EB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVolunteer = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      department: data.department,
      year: data.year,
      preferredRole: data.preferredRole,
      shift: data.shift,
      status: 'Pending',
      registeredAt: new Date().toISOString()
    };

    // Save to storage
    const volunteers = Storage.getVolunteers();
    volunteers.unshift(newVolunteer);
    Storage.setVolunteers(volunteers);

    // Reset wizard
    this.regState = { active: false, step: 0, tempData: {} };

    // Update UI components across tabs
    App.refreshAll();

    const successHtml = `
      <div class="chat-rich-card" style="border-color: #10B981; background: #ECFDF5;">
        <h5 style="color: #065F46;">🎉 Registration Successful!</h5>
        <div class="chat-rich-card-item"><span>Assigned ID:</span><strong style="color: #6C5CE7; font-size: 1.1rem;">${newId}</strong></div>
        <div class="chat-rich-card-item"><span>Full Name:</span><strong>${this.escapeHtml(newVolunteer.fullName)}</strong></div>
        <div class="chat-rich-card-item"><span>Email:</span><strong>${this.escapeHtml(newVolunteer.email)}</strong></div>
        <div class="chat-rich-card-item"><span>Dept & Year:</span><strong>${this.escapeHtml(newVolunteer.department)} (${this.escapeHtml(newVolunteer.year)})</strong></div>
        <div class="chat-rich-card-item"><span>Role:</span><strong>${this.escapeHtml(newVolunteer.preferredRole)}</strong></div>
        <div class="chat-rich-card-item"><span>Shift:</span><strong>${this.escapeHtml(newVolunteer.shift)}</strong></div>
        <div class="chat-rich-card-item"><span>Status:</span><span class="badge badge-amber">Pending Duty Assignment</span></div>
      </div>
      <p class="mt-2">Your registration is now visible on the <strong>Coordinator Dashboard</strong>. Keep your Registration ID safe to verify your duty pass later!</p>
      <div class="chat-action-btn-row mt-2">
        <button class="btn btn-primary btn-sm" onclick="App.navigateToTab('dashboard')">View in Coordinator Dashboard</button>
        <button class="btn btn-secondary btn-sm" onclick="App.openVolunteerDetailsModal('${newId}')">View Duty Pass</button>
      </div>
    `;
    this.addBotMessage(successHtml);
    Toast.show(`Volunteer ${newVolunteer.fullName} successfully registered! (ID: ${newId})`, 'success');
  }
};

// ==============================================================================
// 3. APPLICATION CONTROLLER & UI MANAGER
// ==============================================================================
const App = {
  currentTab: 'chatbot',

  init() {
    this.bindNavigation();
    this.bindModals();
    this.bindForms();
    this.bindSearchAndFilters();
    this.refreshAll();
  },

  // ----------------------------------------------------------------------------
  // NAVIGATION CONTROLLER
  // ----------------------------------------------------------------------------
  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const tab = link.dataset.tab;
        this.navigateToTab(tab);
      });
    });

    // Mobile Sidebar Drawer Toggle
    const mobileToggle = document.getElementById('mobileSidebarToggleBtn');
    const mobileClose = document.getElementById('mobileSidebarCloseBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
      });
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
      });
    }

    // Topbar Quick Actions
    const topRegBtn = document.getElementById('topbarRegisterVolunteerBtn');
    if (topRegBtn) {
      topRegBtn.addEventListener('click', () => {
        this.openVolunteerModal();
      });
    }

    const topEventBtn = document.getElementById('topbarAddEventBtn');
    if (topEventBtn) {
      topEventBtn.addEventListener('click', () => {
        this.openEventModal();
      });
    }

    // Dashboard Action Tiles
    const dashAddVol = document.getElementById('dashActionAddVolunteer');
    if (dashAddVol) {
      dashAddVol.addEventListener('click', () => this.openVolunteerModal());
    }

    const dashAssignTask = document.getElementById('dashActionAssignTask');
    if (dashAssignTask) {
      dashAssignTask.addEventListener('click', () => this.openTaskModal());
    }

    const dashCreateEvent = document.getElementById('dashActionCreateEvent');
    if (dashCreateEvent) {
      dashCreateEvent.addEventListener('click', () => this.openEventModal());
    }

    const dashLaunchBot = document.getElementById('dashActionLaunchBot');
    if (dashLaunchBot) {
      dashLaunchBot.addEventListener('click', () => {
        this.navigateToTab('chatbot');
        Chatbot.startRegistrationWizard();
      });
    }

    const dashViewAllEvents = document.getElementById('dashViewAllEventsBtn');
    if (dashViewAllEvents) {
      dashViewAllEvents.addEventListener('click', () => this.navigateToTab('events'));
    }

    const dashGoToTasks = document.getElementById('dashGoToTasksBtn');
    if (dashGoToTasks) {
      dashGoToTasks.addEventListener('click', () => this.navigateToTab('tasks'));
    }

    // Reset Demo Data Trigger
    const resetBtn = document.getElementById('btnResetDemoData');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.openModal('confirmResetModal');
      });
    }

    const confirmResetAction = document.getElementById('btnConfirmResetAction');
    if (confirmResetAction) {
      confirmResetAction.addEventListener('click', () => {
        Storage.resetAll();
        this.closeModal('confirmResetModal');
        this.refreshAll();
        Chatbot.init();
        Toast.show('Demo data has been reset to default state.', 'success');
      });
    }
  },

  navigateToTab(tabId) {
    this.currentTab = tabId;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabId);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`pane-${tabId}`);
    if (activePane) {
      activePane.classList.add('active');
    }

    // Update Topbar Title & Subtitle
    const titleEl = document.getElementById('pageTitle');
    const subtitleEl = document.getElementById('pageSubtitle');

    const meta = {
      'chatbot': { title: 'EventBuddy Assistant', sub: 'Rule-based chatbot for college volunteer inquiries & registration' },
      'dashboard': { title: 'Coordinator Dashboard', sub: 'Real-time volunteer coverage, event metrics & rapid actions' },
      'events': { title: 'College Events Management', sub: 'Schedule symposiums, hackathons, and monitor volunteer quotas' },
      'volunteers': { title: 'Volunteers Directory', sub: 'Comprehensive database of registered student coordinators & assistants' },
      'tasks': { title: 'Task & Duty Allocations', sub: 'Assign volunteers to event shifts, desks, and track duty progress' },
      'my-tasks': { title: 'Volunteer Self-Service Portal', sub: 'Verify your assigned duties and download printable official pass' },
      'project-info': { title: 'College Project Guide & Viva Prep', sub: 'System specifications, rule-based architecture & viva Q&A' }
    };

    if (meta[tabId]) {
      titleEl.textContent = meta[tabId].title;
      subtitleEl.textContent = meta[tabId].sub;
    }

    // Close mobile drawer if opened
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ----------------------------------------------------------------------------
  // MODAL CONTROLLERS
  // ----------------------------------------------------------------------------
  bindModals() {
    // Generic close modal button listener
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = btn.dataset.closeModal;
        this.closeModal(modalId);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.style.display = 'none';
        }
      });
    });

    // Print Duty Slip trigger
    const printBtn = document.getElementById('btnPrintDutySlip');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Empty state quick triggers
    const emptyCreateEvent = document.getElementById('btnEmptyCreateEvent');
    if (emptyCreateEvent) emptyCreateEvent.addEventListener('click', () => this.openEventModal());

    const emptyAddVol = document.getElementById('btnEmptyAddVolunteer');
    if (emptyAddVol) emptyAddVol.addEventListener('click', () => this.openVolunteerModal());

    const emptyCreateTask = document.getElementById('btnEmptyCreateTask');
    if (emptyCreateTask) emptyCreateTask.addEventListener('click', () => this.openTaskModal());

    // Main Section Action Buttons
    const btnAddEvent = document.getElementById('btnAddNewEvent');
    if (btnAddEvent) btnAddEvent.addEventListener('click', () => this.openEventModal());

    const btnAddVol = document.getElementById('btnAddNewVolunteerModal');
    if (btnAddVol) btnAddVol.addEventListener('click', () => this.openVolunteerModal());

    const btnCreateTask = document.getElementById('btnCreateTaskModal');
    if (btnCreateTask) btnCreateTask.addEventListener('click', () => this.openTaskModal());

    const exportCsvBtn = document.getElementById('btnExportVolunteersCsv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportVolunteersToCsv());
    }
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  },

  // ----------------------------------------------------------------------------
  // FORM BINDINGS (CRUD Operations)
  // ----------------------------------------------------------------------------
  bindForms() {
    // 1. Event Form Submit
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
      eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveEvent();
      });
    }

    // 2. Volunteer Form Submit
    const volForm = document.getElementById('volunteerForm');
    if (volForm) {
      volForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveVolunteer();
      });
    }

    // 3. Task Allocation Form Submit
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveTask();
      });
    }

    // 4. Volunteer Self-Service Lookup Form
    const lookupForm = document.getElementById('volunteerLookupForm');
    if (lookupForm) {
      lookupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('lookupIdentifier').value.trim();
        this.renderLookupResult(input);
      });
    }
  },

  // Search & Filter Listeners
  bindSearchAndFilters() {
    // Events Search
    const eventSearch = document.getElementById('eventSearchInput');
    if (eventSearch) {
      eventSearch.addEventListener('input', () => this.renderEvents());
    }

    // Volunteers Search & Filters
    const volSearch = document.getElementById('volunteerSearchInput');
    const volFilterRole = document.getElementById('volunteerFilterRole');
    const volFilterStatus = document.getElementById('volunteerFilterStatus');

    if (volSearch) volSearch.addEventListener('input', () => this.renderVolunteers());
    if (volFilterRole) volFilterRole.addEventListener('change', () => this.renderVolunteers());
    if (volFilterStatus) volFilterStatus.addEventListener('change', () => this.renderVolunteers());

    // Task Search & Filter
    const taskSearch = document.getElementById('taskSearchInput');
    const taskFilterStatus = document.getElementById('taskFilterStatus');

    if (taskSearch) taskSearch.addEventListener('input', () => this.renderTasks());
    if (taskFilterStatus) taskFilterStatus.addEventListener('change', () => this.renderTasks());
  },

  // ----------------------------------------------------------------------------
  // REFRESH & SYNCHRONIZE DATA
  // ----------------------------------------------------------------------------
  refreshAll() {
    this.renderDashboardStats();
    this.renderEvents();
    this.renderVolunteers();
    this.renderTasks();
    this.updateCounters();
  },

  updateCounters() {
    const events = Storage.getEvents();
    const volunteers = Storage.getVolunteers();
    const tasks = Storage.getTasks();

    const elEvents = document.getElementById('sidebarEventsCount');
    const elVols = document.getElementById('sidebarVolunteersCount');
    const elTasks = document.getElementById('sidebarTasksCount');
    const quickVols = document.getElementById('quickStatsVolunteers');
    const botEvents = document.getElementById('botTotalEventsStat');
    const botVols = document.getElementById('botTotalVolunteersStat');

    if (elEvents) elEvents.textContent = events.length;
    if (elVols) elVols.textContent = volunteers.length;
    if (elTasks) elTasks.textContent = tasks.length;
    if (quickVols) quickVols.textContent = `${volunteers.length} Volunteers Enrolled`;
    if (botEvents) botEvents.textContent = events.length;
    if (botVols) botVols.textContent = volunteers.length;
  },

  // ----------------------------------------------------------------------------
  // DASHBOARD METRICS & WIDGETS
  // ----------------------------------------------------------------------------
  renderDashboardStats() {
    const events = Storage.getEvents();
    const volunteers = Storage.getVolunteers();
    const tasks = Storage.getTasks();

    const assignedCount = volunteers.filter(v => v.status === 'Assigned' || v.status === 'Completed').length;
    const pendingCount = volunteers.filter(v => v.status === 'Pending').length;

    // Stat Cards
    const elTotalVols = document.getElementById('dashTotalVolunteers');
    const elTotalEvents = document.getElementById('dashTotalEvents');
    const elAssignedVols = document.getElementById('dashAssignedVolunteers');
    const elPendingVols = document.getElementById('dashPendingVolunteers');
    const elCoverage = document.getElementById('dashAssignedPercent');

    if (elTotalVols) elTotalVols.textContent = volunteers.length;
    if (elTotalEvents) elTotalEvents.textContent = events.length;
    if (elAssignedVols) elAssignedVols.textContent = assignedCount;
    if (elPendingVols) elPendingVols.textContent = pendingCount;

    if (elCoverage) {
      const pct = volunteers.length > 0 ? Math.round((assignedCount / volunteers.length) * 100) : 0;
      elCoverage.textContent = `${pct}% duty coverage`;
    }

    // Role Distribution Bars
    const roleBarsContainer = document.getElementById('dashRoleBars');
    if (roleBarsContainer) {
      const rolesList = ['Registration Desk', 'Technical Support', 'Event Management', 'Decoration', 'Publicity', 'Hospitality'];
      const counts = {};
      rolesList.forEach(r => counts[r] = 0);
      volunteers.forEach(v => {
        if (counts[v.preferredRole] !== undefined) counts[v.preferredRole]++;
      });

      const max = Math.max(...Object.values(counts), 1);

      roleBarsContainer.innerHTML = rolesList.map(role => {
        const count = counts[role] || 0;
        const widthPct = Math.round((count / max) * 100);
        return `
          <div class="role-bar-item">
            <div class="role-bar-label-row">
              <span>${role}</span>
              <strong>${count} volunteers</strong>
            </div>
            <div class="role-progress-track">
              <div class="role-progress-fill" style="width: ${widthPct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Recent Events Mini-List on Dashboard
    const recentEventsContainer = document.getElementById('dashRecentEventsList');
    if (recentEventsContainer) {
      if (events.length === 0) {
        recentEventsContainer.innerHTML = '<p class="p-3 text-muted text-sm text-center">No college events scheduled.</p>';
      } else {
        recentEventsContainer.innerHTML = events.slice(0, 3).map(ev => {
          const d = new Date(ev.date);
          const monthStr = isNaN(d) ? 'NOV' : d.toLocaleDateString('en-US', { month: 'short' });
          const dayStr = isNaN(d) ? '15' : d.getDate();

          return `
            <div class="dash-event-item">
              <div class="dash-event-date-box">
                <span class="month">${monthStr}</span>
                <span class="day">${dayStr}</span>
              </div>
              <div class="dash-event-info">
                <h4>${this.escapeHtml(ev.title)}</h4>
                <p>📍 ${this.escapeHtml(ev.venue)} • ⏰ ${this.escapeHtml(ev.time)}</p>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Pending Volunteers Preview Table on Dashboard
    const pendingTable = document.getElementById('dashPendingVolunteersTable');
    if (pendingTable) {
      const pendingVols = volunteers.filter(v => v.status === 'Pending');
      if (pendingVols.length === 0) {
        pendingTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted" style="padding: 24px;">
              🎉 All enrolled volunteers have been assigned duty tasks!
            </td>
          </tr>
        `;
      } else {
        pendingTable.innerHTML = pendingVols.slice(0, 5).map(v => `
          <tr>
            <td><code>${v.id}</code></td>
            <td><strong>${this.escapeHtml(v.fullName)}</strong></td>
            <td>${this.escapeHtml(v.department)} (${this.escapeHtml(v.year)})</td>
            <td><span class="role-tag ${this.getRoleTagClass(v.preferredRole)}">${this.escapeHtml(v.preferredRole)}</span></td>
            <td>${this.escapeHtml(v.shift)}</td>
            <td>
              <button class="btn btn-outline-primary btn-sm" onclick="App.openTaskModal('${v.id}')">
                Assign Duty
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  // ----------------------------------------------------------------------------
  // EVENTS MANAGEMENT (FEATURE 5)
  // ----------------------------------------------------------------------------
  renderEvents() {
    const container = document.getElementById('eventsContainer');
    const emptyState = document.getElementById('eventsEmptyState');
    const searchInput = document.getElementById('eventSearchInput');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let events = Storage.getEvents();

    if (query) {
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) || 
        e.venue.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    if (events.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = events.map(ev => {
      const rolesPills = ev.roles.map(r => `
        <span class="role-tag ${this.getRoleTagClass(r)}">${this.escapeHtml(r)}</span>
      `).join('');

      return `
        <div class="event-card">
          <div class="event-card-header">
            <span class="badge badge-purple">College Event</span>
            <div class="table-actions">
              <button class="action-icon-btn" title="Edit Event" onclick="App.editEvent('${ev.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-icon-btn delete" title="Delete Event" onclick="App.deleteEvent('${ev.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <div class="event-card-body">
            <h3 class="event-title">${this.escapeHtml(ev.title)}</h3>
            <div class="event-meta-row">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>${ev.date} • ${this.escapeHtml(ev.time)}</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${this.escapeHtml(ev.venue)}</span>
              </div>
            </div>
            <p class="event-desc">${this.escapeHtml(ev.description)}</p>
            <div class="event-roles-needed">
              ${rolesPills}
            </div>
          </div>
          <div class="event-card-footer">
            <span class="text-xs text-muted"><strong>${ev.targetVolunteers}</strong> volunteer slots</span>
            <button class="btn btn-primary btn-sm" onclick="App.openTaskModal('', '${ev.id}')">
              Assign Volunteer
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  openEventModal(editEventId = null) {
    const form = document.getElementById('eventForm');
    form.reset();
    document.getElementById('eventFormId').value = '';
    document.getElementById('eventModalTitle').textContent = 'Create College Event';

    // Reset checkboxes to default
    document.querySelectorAll('#eventRolesCheckboxGroup input').forEach(cb => {
      cb.checked = ['Registration Desk', 'Technical Support', 'Event Management', 'Hospitality'].includes(cb.value);
    });

    if (editEventId) {
      const event = Storage.getEvents().find(e => e.id === editEventId);
      if (event) {
        document.getElementById('eventModalTitle').textContent = 'Edit College Event';
        document.getElementById('eventFormId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventVenue').value = event.venue;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventTargetVolunteers').value = event.targetVolunteers;

        document.querySelectorAll('#eventRolesCheckboxGroup input').forEach(cb => {
          cb.checked = event.roles.includes(cb.value);
        });
      }
    }

    this.openModal('eventModal');
  },

  editEvent(id) {
    this.openEventModal(id);
  },

  saveEvent() {
    const id = document.getElementById('eventFormId').value;
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value.trim();
    const venue = document.getElementById('eventVenue').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const targetVolunteers = parseInt(document.getElementById('eventTargetVolunteers').value, 10) || 15;

    const checkedRoles = [];
    document.querySelectorAll('#eventRolesCheckboxGroup input:checked').forEach(cb => {
      checkedRoles.push(cb.value);
    });

    if (checkedRoles.length === 0) {
      alert('Please select at least one volunteer role for this event.');
      return;
    }

    const events = Storage.getEvents();

    if (id) {
      // Update
      const index = events.findIndex(e => e.id === id);
      if (index !== -1) {
        events[index] = { ...events[index], title, date, time, venue, description, targetVolunteers, roles: checkedRoles };
        Toast.show(`Event "${title}" updated successfully!`, 'success');
      }
    } else {
      // Create new
      const newEvent = {
        id: `EV-${Date.now().toString().slice(-4)}`,
        title,
        date,
        time,
        venue,
        description,
        targetVolunteers,
        roles: checkedRoles
      };
      events.push(newEvent);
      Toast.show(`College Event "${title}" created!`, 'success');
    }

    Storage.setEvents(events);
    this.closeModal('eventModal');
    this.refreshAll();
  },

  deleteEvent(id) {
    const event = Storage.getEvents().find(e => e.id === id);
    if (!event) return;

    if (confirm(`Are you sure you want to delete "${event.title}"? Associated tasks will also be detached.`)) {
      let events = Storage.getEvents();
      events = events.filter(e => e.id !== id);
      Storage.setEvents(events);

      // Remove tasks linked to this event
      let tasks = Storage.getTasks();
      tasks = tasks.filter(t => t.eventId !== id);
      Storage.setTasks(tasks);

      Toast.show(`Event "${event.title}" deleted.`, 'danger');
      this.refreshAll();
    }
  },

  // ----------------------------------------------------------------------------
  // VOLUNTEER DIRECTORY & CRUD (FEATURE 2 & FEATURE 3)
  // ----------------------------------------------------------------------------
  renderVolunteers() {
    const tbody = document.getElementById('volunteersTableBody');
    const emptyState = document.getElementById('volunteersEmptyState');
    const searchInput = document.getElementById('volunteerSearchInput');
    const filterRole = document.getElementById('volunteerFilterRole').value;
    const filterStatus = document.getElementById('volunteerFilterStatus').value;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let volunteers = Storage.getVolunteers();
    const tasks = Storage.getTasks();

    if (query) {
      volunteers = volunteers.filter(v => 
        v.fullName.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.id.toLowerCase().includes(query) ||
        v.department.toLowerCase().includes(query)
      );
    }

    if (filterRole !== 'ALL') {
      volunteers = volunteers.filter(v => v.preferredRole === filterRole);
    }

    if (filterStatus !== 'ALL') {
      volunteers = volunteers.filter(v => v.status === filterStatus);
    }

    if (volunteers.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    tbody.innerHTML = volunteers.map(v => {
      // Find assigned task if any
      const task = tasks.find(t => t.volunteerId === v.id);
      const taskDisplay = task 
        ? `<span class="badge ${task.status === 'Completed' ? 'badge-completed' : 'badge-green'}">${this.escapeHtml(task.eventTitle.split(':')[0])} (${this.escapeHtml(task.role)})</span>` 
        : '<span class="text-xs text-muted">No task assigned</span>';

      return `
        <tr>
          <td><code>${v.id}</code></td>
          <td>
            <span class="user-cell-title">${this.escapeHtml(v.fullName)}</span>
            <span class="user-cell-sub">${this.escapeHtml(v.email)}</span>
          </td>
          <td>
            <span class="user-cell-title">${this.escapeHtml(v.department)}</span>
            <span class="user-cell-sub">${this.escapeHtml(v.year)}</span>
          </td>
          <td>
            <span class="role-tag ${this.getRoleTagClass(v.preferredRole)}">${this.escapeHtml(v.preferredRole)}</span>
          </td>
          <td>${this.escapeHtml(v.shift)}</td>
          <td>
            <span class="badge ${v.status === 'Assigned' ? 'status-assigned' : (v.status === 'Completed' ? 'badge-completed' : 'status-pending')}">
              ${v.status}
            </span>
          </td>
          <td>${taskDisplay}</td>
          <td>
            <div class="table-actions">
              <button class="action-icon-btn" title="View Duty Pass" onclick="App.openVolunteerDetailsModal('${v.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </button>
              <button class="action-icon-btn" title="Edit Volunteer" onclick="App.editVolunteer('${v.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-icon-btn delete" title="Delete Volunteer" onclick="App.deleteVolunteer('${v.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openVolunteerModal(editId = null) {
    const form = document.getElementById('volunteerForm');
    form.reset();
    document.getElementById('volunteerFormId').value = '';
    document.getElementById('volunteerModalTitle').textContent = 'Register New Volunteer';
    document.getElementById('volStatusGroup').style.display = 'none';

    if (editId) {
      const vol = Storage.getVolunteers().find(v => v.id === editId);
      if (vol) {
        document.getElementById('volunteerModalTitle').textContent = 'Edit Volunteer Details';
        document.getElementById('volunteerFormId').value = vol.id;
        document.getElementById('volFullName').value = vol.fullName;
        document.getElementById('volEmail').value = vol.email;
        document.getElementById('volDepartment').value = vol.department;
        document.getElementById('volYear').value = vol.year;
        document.getElementById('volPreferredRole').value = vol.preferredRole;
        document.getElementById('volShift').value = vol.shift;
        document.getElementById('volStatus').value = vol.status;
        document.getElementById('volStatusGroup').style.display = 'block';
      }
    }

    this.openModal('volunteerModal');
  },

  editVolunteer(id) {
    this.openVolunteerModal(id);
  },

  saveVolunteer() {
    const id = document.getElementById('volunteerFormId').value;
    const fullName = document.getElementById('volFullName').value.trim();
    const email = document.getElementById('volEmail').value.trim().toLowerCase();
    const department = document.getElementById('volDepartment').value;
    const year = document.getElementById('volYear').value;
    const preferredRole = document.getElementById('volPreferredRole').value;
    const shift = document.getElementById('volShift').value;

    const volunteers = Storage.getVolunteers();

    // Check duplicate email
    const duplicate = volunteers.find(v => v.email.toLowerCase() === email && v.id !== id);
    if (duplicate) {
      alert(`A volunteer is already registered with email: ${email} (ID: ${duplicate.id})`);
      return;
    }

    if (id) {
      // Edit
      const status = document.getElementById('volStatus').value;
      const index = volunteers.findIndex(v => v.id === id);
      if (index !== -1) {
        volunteers[index] = { ...volunteers[index], fullName, email, department, year, preferredRole, shift, status };
        Toast.show(`Volunteer record for ${fullName} updated!`, 'success');
      }
    } else {
      // Add
      const newId = `EB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newVolunteer = {
        id: newId,
        fullName,
        email,
        department,
        year,
        preferredRole,
        shift,
        status: 'Pending',
        registeredAt: new Date().toISOString()
      };
      volunteers.unshift(newVolunteer);
      Toast.show(`Volunteer ${fullName} enrolled with ID: ${newId}`, 'success');
    }

    Storage.setVolunteers(volunteers);
    this.closeModal('volunteerModal');
    this.refreshAll();
  },

  deleteVolunteer(id) {
    const vol = Storage.getVolunteers().find(v => v.id === id);
    if (!vol) return;

    if (confirm(`Are you sure you want to delete volunteer "${vol.fullName}" (${vol.id})? Any task allocated will also be cleared.`)) {
      let volunteers = Storage.getVolunteers();
      volunteers = volunteers.filter(v => v.id !== id);
      Storage.setVolunteers(volunteers);

      // Remove tasks linked
      let tasks = Storage.getTasks();
      tasks = tasks.filter(t => t.volunteerId !== id);
      Storage.setTasks(tasks);

      Toast.show(`Volunteer ${vol.fullName} deleted.`, 'danger');
      this.refreshAll();
    }
  },

  // Export volunteer list to CSV file
  exportVolunteersToCsv() {
    const volunteers = Storage.getVolunteers();
    if (volunteers.length === 0) {
      Toast.show('No volunteer records to export.', 'warning');
      return;
    }

    const headers = ['Volunteer ID', 'Full Name', 'College Email', 'Department', 'Year of Study', 'Preferred Role', 'Shift', 'Assignment Status', 'Registration Date'];
    const rows = volunteers.map(v => [
      `"${v.id}"`,
      `"${v.fullName}"`,
      `"${v.email}"`,
      `"${v.department}"`,
      `"${v.year}"`,
      `"${v.preferredRole}"`,
      `"${v.shift}"`,
      `"${v.status}"`,
      `"${v.registeredAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventBuddy_Volunteers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Toast.show('Volunteers directory exported to CSV!', 'info');
  },

  // ----------------------------------------------------------------------------
  // TASK MANAGEMENT & ALLOCATIONS (FEATURE 4)
  // ----------------------------------------------------------------------------
  renderTasks() {
    const tbody = document.getElementById('tasksTableBody');
    const emptyState = document.getElementById('tasksEmptyState');
    const searchInput = document.getElementById('taskSearchInput');
    const filterStatus = document.getElementById('taskFilterStatus').value;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let tasks = Storage.getTasks();

    if (query) {
      tasks = tasks.filter(t => 
        t.volunteerName.toLowerCase().includes(query) ||
        t.eventTitle.toLowerCase().includes(query) ||
        t.role.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== 'ALL') {
      tasks = tasks.filter(t => t.status === filterStatus);
    }

    if (tasks.length === 0) {
      tbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    tbody.innerHTML = tasks.map(t => `
      <tr>
        <td><code>${t.id}</code></td>
        <td>
          <span class="user-cell-title">${this.escapeHtml(t.eventTitle)}</span>
        </td>
        <td>
          <span class="user-cell-title">${this.escapeHtml(t.volunteerName)}</span>
          <span class="user-cell-sub"><code>${t.volunteerId}</code></span>
        </td>
        <td>
          <span class="role-tag ${this.getRoleTagClass(t.role)}">${this.escapeHtml(t.role)}</span>
          <div class="text-xs text-muted mt-1" style="max-width: 200px;">${this.escapeHtml(t.dutyDescription)}</div>
        </td>
        <td>
          <span class="user-cell-title">${this.escapeHtml(t.shift)}</span>
          <span class="user-cell-sub">Reporting: ${this.escapeHtml(t.reportingTime)}</span>
        </td>
        <td>${this.escapeHtml(t.location)}</td>
        <td>
          <select class="select-filter" style="padding: 4px 8px; font-size: 0.78rem;" onchange="App.updateTaskStatus('${t.id}', this.value)">
            <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-icon-btn" title="Edit Task" onclick="App.editTask('${t.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="action-icon-btn delete" title="Delete Task" onclick="App.deleteTask('${t.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openTaskModal(preSelectedVolunteerId = null, preSelectedEventId = null, editTaskId = null) {
    const form = document.getElementById('taskForm');
    form.reset();
    document.getElementById('taskFormId').value = '';
    document.getElementById('taskModalTitle').textContent = 'Assign Duty Task to Volunteer';

    const volSelect = document.getElementById('taskVolunteerSelect');
    const eventSelect = document.getElementById('taskEventSelect');

    const volunteers = Storage.getVolunteers();
    const events = Storage.getEvents();

    // Populate Volunteers Dropdown
    volSelect.innerHTML = '<option value="">-- Choose Registered Volunteer --</option>' +
      volunteers.map(v => `
        <option value="${v.id}" data-name="${v.fullName}" data-role="${v.preferredRole}" data-shift="${v.shift}">
          ${v.fullName} (${v.id} - ${v.preferredRole} - ${v.status})
        </option>
      `).join('');

    // Populate Events Dropdown
    eventSelect.innerHTML = '<option value="">-- Choose College Event --</option>' +
      events.map(e => `
        <option value="${e.id}" data-title="${e.title}">
          ${e.title} (${e.date})
        </option>
      `).join('');

    // Auto-select if pre-specified
    if (preSelectedVolunteerId) {
      volSelect.value = preSelectedVolunteerId;
      const v = volunteers.find(vol => vol.id === preSelectedVolunteerId);
      if (v) {
        document.getElementById('taskRoleSelect').value = v.preferredRole;
        document.getElementById('taskShiftSelect').value = v.shift;
      }
    }

    if (preSelectedEventId) {
      eventSelect.value = preSelectedEventId;
    }

    // Default values
    document.getElementById('taskReportingTime').value = '08:30 AM Sharp';
    document.getElementById('taskLocation').value = 'Main Auditorium Entrance Desk';
    document.getElementById('taskDutyDescription').value = 'Verify attendee badges, manage queue flow, and guide guests to assigned hall seats.';

    // If Editing
    if (editTaskId) {
      const task = Storage.getTasks().find(t => t.id === editTaskId);
      if (task) {
        document.getElementById('taskModalTitle').textContent = 'Edit Task Duty Allocation';
        document.getElementById('taskFormId').value = task.id;
        volSelect.value = task.volunteerId;
        eventSelect.value = task.eventId;
        document.getElementById('taskRoleSelect').value = task.role;
        document.getElementById('taskReportingTime').value = task.reportingTime;
        document.getElementById('taskShiftSelect').value = task.shift;
        document.getElementById('taskLocation').value = task.location;
        document.getElementById('taskDutyDescription').value = task.dutyDescription;
        document.getElementById('taskStatusSelect').value = task.status;
      }
    }

    this.openModal('taskModal');
  },

  editTask(id) {
    this.openTaskModal(null, null, id);
  },

  saveTask() {
    const id = document.getElementById('taskFormId').value;
    const volSelect = document.getElementById('taskVolunteerSelect');
    const eventSelect = document.getElementById('taskEventSelect');

    const volunteerId = volSelect.value;
    const eventId = eventSelect.value;

    if (!volunteerId || !eventId) {
      alert('Please select both a volunteer and an event.');
      return;
    }

    const volunteerName = volSelect.options[volSelect.selectedIndex].getAttribute('data-name');
    const eventTitle = eventSelect.options[eventSelect.selectedIndex].getAttribute('data-title');
    const role = document.getElementById('taskRoleSelect').value;
    const reportingTime = document.getElementById('taskReportingTime').value.trim();
    const shift = document.getElementById('taskShiftSelect').value;
    const location = document.getElementById('taskLocation').value.trim();
    const dutyDescription = document.getElementById('taskDutyDescription').value.trim();
    const status = document.getElementById('taskStatusSelect').value;

    const tasks = Storage.getTasks();

    if (id) {
      // Edit
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], volunteerId, volunteerName, eventId, eventTitle, role, reportingTime, shift, location, dutyDescription, status };
        Toast.show('Duty task allocation updated!', 'success');
      }
    } else {
      // New Task
      const newTask = {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        volunteerId,
        volunteerName,
        eventId,
        eventTitle,
        role,
        reportingTime,
        shift,
        location,
        dutyDescription,
        status
      };
      tasks.push(newTask);
      Toast.show(`Duty task assigned to ${volunteerName}!`, 'success');
    }

    Storage.setTasks(tasks);

    // Update volunteer status to Assigned
    const volunteers = Storage.getVolunteers();
    const vol = volunteers.find(v => v.id === volunteerId);
    if (vol && vol.status === 'Pending') {
      vol.status = 'Assigned';
      Storage.setVolunteers(volunteers);
    }

    this.closeModal('taskModal');
    this.refreshAll();
  },

  updateTaskStatus(taskId, newStatus) {
    const tasks = Storage.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      Storage.setTasks(tasks);

      // If completed, update volunteer status as well
      const volunteers = Storage.getVolunteers();
      const vol = volunteers.find(v => v.id === task.volunteerId);
      if (vol) {
        if (newStatus === 'Completed') {
          vol.status = 'Completed';
        } else {
          vol.status = 'Assigned';
        }
        Storage.setVolunteers(volunteers);
      }

      Toast.show(`Task status updated to "${newStatus}"`, 'info');
      this.refreshAll();
    }
  },

  deleteTask(id) {
    const task = Storage.getTasks().find(t => t.id === id);
    if (!task) return;

    if (confirm(`Remove this task allocation for "${task.volunteerName}"?`)) {
      let tasks = Storage.getTasks();
      tasks = tasks.filter(t => t.id !== id);
      Storage.setTasks(tasks);

      // Check if volunteer has any other tasks, if not, set to Pending
      const remainingTasks = tasks.filter(t => t.volunteerId === task.volunteerId);
      if (remainingTasks.length === 0) {
        const volunteers = Storage.getVolunteers();
        const vol = volunteers.find(v => v.id === task.volunteerId);
        if (vol) {
          vol.status = 'Pending';
          Storage.setVolunteers(volunteers);
        }
      }

      Toast.show('Task allocation removed.', 'danger');
      this.refreshAll();
    }
  },

  // ----------------------------------------------------------------------------
  // VOLUNTEER DETAILS & PRINTABLE DUTY SLIP MODAL (FEATURE 4 & 6)
  // ----------------------------------------------------------------------------
  openVolunteerDetailsModal(volunteerId) {
    const volunteer = Storage.getVolunteers().find(v => v.id === volunteerId);
    if (!volunteer) return;

    const tasks = Storage.getTasks().filter(t => t.volunteerId === volunteer.id);
    const modalContent = document.getElementById('detailsModalContent');

    let tasksHtml = '';
    if (tasks.length === 0) {
      tasksHtml = `
        <div class="empty-state-card" style="padding: 20px;">
          <p class="text-muted">No specific duty task has been assigned yet. Please report to the Coordinator Desk on event day morning.</p>
        </div>
      `;
    } else {
      tasksHtml = tasks.map(t => `
        <div class="duty-pass-container mt-3">
          <div class="duty-pass-header">
            <div class="pass-college-title">
              <h3>${this.escapeHtml(t.eventTitle)}</h3>
              <p>Official Event Volunteer Duty Assignment</p>
            </div>
            <div class="pass-id-badge">${t.status}</div>
          </div>

          <div class="duty-pass-grid">
            <div class="pass-field">
              <label>Assigned Duty Role</label>
              <span>${this.escapeHtml(t.role)}</span>
            </div>
            <div class="pass-field">
              <label>Reporting Time</label>
              <span>${this.escapeHtml(t.reportingTime)}</span>
            </div>
            <div class="pass-field">
              <label>Assigned Shift</label>
              <span>${this.escapeHtml(t.shift)}</span>
            </div>
            <div class="pass-field">
              <label>Assigned Location / Desk</label>
              <span>${this.escapeHtml(t.location)}</span>
            </div>
          </div>

          <div class="pass-instructions-box">
            <strong>Coordinator Instructions:</strong>
            <p class="mt-1">${this.escapeHtml(t.dutyDescription)}</p>
          </div>
        </div>
      `).join('');
    }

    modalContent.innerHTML = `
      <div class="duty-pass-container">
        <div class="duty-pass-header">
          <div class="pass-college-title">
            <h3>EventBuddy Volunteer Identity Pass</h3>
            <p>Annual College Symposium & Cultural Summit 2026</p>
          </div>
          <div class="pass-id-badge">${volunteer.id}</div>
        </div>

        <div class="duty-pass-grid">
          <div class="pass-field">
            <label>Volunteer Full Name</label>
            <span>${this.escapeHtml(volunteer.fullName)}</span>
          </div>
          <div class="pass-field">
            <label>College Email</label>
            <span>${this.escapeHtml(volunteer.email)}</span>
          </div>
          <div class="pass-field">
            <label>Department & Year</label>
            <span>${this.escapeHtml(volunteer.department)} (${this.escapeHtml(volunteer.year)})</span>
          </div>
          <div class="pass-field">
            <label>Preferred Role</label>
            <span>${this.escapeHtml(volunteer.preferredRole)}</span>
          </div>
          <div class="pass-field">
            <label>Availability / Shift</label>
            <span>${this.escapeHtml(volunteer.shift)}</span>
          </div>
          <div class="pass-field">
            <label>Registration Status</label>
            <span class="badge ${volunteer.status === 'Assigned' ? 'badge-green' : 'badge-amber'}">${volunteer.status}</span>
          </div>
        </div>
      </div>

      <h4 class="mt-3">Assigned Duties & Tasks:</h4>
      ${tasksHtml}

      <div class="mt-3 text-xs text-muted text-center">
        * Please present this pass or your Registration ID (<code>${volunteer.id}</code>) to collect your official Volunteer Identity Badge and food coupon.
      </div>
    `;

    this.openModal('detailsModal');
  },

  // ----------------------------------------------------------------------------
  // VOLUNTEER SELF-SERVICE PORTAL LOOKUP (TAB 6)
  // ----------------------------------------------------------------------------
  renderLookupResult(identifier) {
    const resultBox = document.getElementById('lookupResultArea');
    const clean = identifier.toLowerCase().trim();

    const volunteers = Storage.getVolunteers();
    const volunteer = volunteers.find(v => v.id.toLowerCase() === clean || v.email.toLowerCase() === clean);

    if (!volunteer) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div class="empty-state-card" style="border-color: #FECACA; background: #FEF2F2;">
          <div class="empty-icon">❌</div>
          <h3 style="color: #991B1B;">No Registration Found</h3>
          <p>No volunteer profile matches "<strong>${this.escapeHtml(identifier)}</strong>". Verify your Registration ID or register as a new volunteer.</p>
          <button class="btn btn-primary mt-3" onclick="App.openVolunteerModal()">Register Volunteer Now</button>
        </div>
      `;
      return;
    }

    const tasks = Storage.getTasks().filter(t => t.volunteerId === volunteer.id);

    let tasksHtml = '';
    if (tasks.length === 0) {
      tasksHtml = `
        <div class="empty-state-card" style="padding: 24px; margin-top: 14px;">
          <div class="empty-icon">⏳</div>
          <h3>Duty Assignment Pending</h3>
          <p>Your volunteer enrollment is confirmed, but the coordinator has not yet assigned a specific shift desk. Please check back before event day.</p>
        </div>
      `;
    } else {
      tasksHtml = tasks.map(t => `
        <div class="duty-pass-container mt-3">
          <div class="duty-pass-header">
            <div class="pass-college-title">
              <h3>${this.escapeHtml(t.eventTitle)}</h3>
              <p>Official Shift Allocation</p>
            </div>
            <div class="pass-id-badge">${t.status}</div>
          </div>

          <div class="duty-pass-grid">
            <div class="pass-field">
              <label>Duty Role</label>
              <span>${this.escapeHtml(t.role)}</span>
            </div>
            <div class="pass-field">
              <label>Reporting Time</label>
              <span>${this.escapeHtml(t.reportingTime)}</span>
            </div>
            <div class="pass-field">
              <label>Shift Schedule</label>
              <span>${this.escapeHtml(t.shift)}</span>
            </div>
            <div class="pass-field">
              <label>Reporting Desk</label>
              <span>${this.escapeHtml(t.location)}</span>
            </div>
          </div>

          <div class="pass-instructions-box">
            <strong>Coordinator Instructions:</strong>
            <p class="mt-1">${this.escapeHtml(t.dutyDescription)}</p>
          </div>
        </div>
      `).join('');
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div class="duty-pass-container">
        <div class="duty-pass-header">
          <div class="pass-college-title">
            <h3>EventBuddy Official Volunteer Duty Slip</h3>
            <p>Verification Passed • Student Volunteer Identity</p>
          </div>
          <div class="pass-id-badge">${volunteer.id}</div>
        </div>

        <div class="duty-pass-grid">
          <div class="pass-field">
            <label>Volunteer Name</label>
            <span>${this.escapeHtml(volunteer.fullName)}</span>
          </div>
          <div class="pass-field">
            <label>College Email</label>
            <span>${this.escapeHtml(volunteer.email)}</span>
          </div>
          <div class="pass-field">
            <label>Department & Year</label>
            <span>${this.escapeHtml(volunteer.department)} (${this.escapeHtml(volunteer.year)})</span>
          </div>
          <div class="pass-field">
            <label>Preferred Role</label>
            <span>${this.escapeHtml(volunteer.preferredRole)}</span>
          </div>
          <div class="pass-field">
            <label>Assigned Shift</label>
            <span>${this.escapeHtml(volunteer.shift)}</span>
          </div>
          <div class="pass-field">
            <label>Overall Status</label>
            <span class="badge ${volunteer.status === 'Assigned' ? 'badge-green' : (volunteer.status === 'Completed' ? 'badge-completed' : 'badge-amber')}">${volunteer.status}</span>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4>Assigned Duty Tasks:</h4>
        ${tasksHtml}
      </div>

      <div class="mt-4 text-center">
        <button class="btn btn-primary" onclick="App.openVolunteerDetailsModal('${volunteer.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print Duty Slip
        </button>
      </div>
    `;

    Toast.show(`Verified profile for ${volunteer.fullName}`, 'success');
  },

  // Helper: CSS role tag styling
  getRoleTagClass(role) {
    switch (role) {
      case 'Registration Desk': return 'role-reg';
      case 'Technical Support': return 'role-tech';
      case 'Event Management': return 'role-mgmt';
      case 'Decoration': return 'role-deco';
      case 'Publicity': return 'role-pub';
      case 'Hospitality': return 'role-hosp';
      default: return 'role-reg';
    }
  },

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ==============================================================================
// 4. TOAST NOTIFICATION SYSTEM
// ==============================================================================
const Toast = {
  show(message, type = 'info', duration = 3800) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'danger') icon = '⚠️';
    if (type === 'warning') icon = '🔔';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ==============================================================================
// 5. APPLICATION BOOTSTRAPPER
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Ensure default storage seeded
  Storage.getEvents();
  Storage.getVolunteers();
  Storage.getTasks();

  // Initialize Modules
  App.init();
  Chatbot.init();

  console.log('EventBuddy Initialized Successfully. Storage Mode: localStorage');
});
