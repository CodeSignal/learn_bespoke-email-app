const SAMPLE_EMAILS = [
  {
    id: 1,
    folder: 'inbox',
    from: 'Alice Johnson <alice@example.com>',
    to: 'me@example.com',
    subject: 'Q1 Marketing Strategy Review',
    body: `Hi,

I wanted to follow up on our discussion from last week about the Q1 marketing strategy. I've put together a detailed plan that covers social media campaigns, content marketing, and paid advertising.

Key highlights:
- 30% budget increase for social media
- New content series launching in February
- Partnership with three new influencers

Could we schedule a meeting this Thursday to go over the details? I'd love to get your feedback before we finalize everything.

Best regards,
Alice`,
    date: '2026-02-23T09:15:00',
    read: false,
    starred: true,
  },
  {
    id: 2,
    folder: 'inbox',
    from: 'Bob Smith <bob@example.com>',
    to: 'me@example.com',
    subject: 'Project Alpha - Sprint Update',
    body: `Team,

Here's the sprint update for Project Alpha:

Completed:
- User authentication module
- Database migration scripts
- API documentation

In Progress:
- Dashboard UI redesign
- Performance optimization

Blockers:
- Waiting on design assets from the UX team

Please review and let me know if anything needs to be adjusted.

Thanks,
Bob`,
    date: '2026-02-23T08:30:00',
    read: false,
    starred: false,
  },
  {
    id: 3,
    folder: 'inbox',
    from: 'Carol Davis <carol@example.com>',
    to: 'me@example.com',
    subject: 'Lunch plans for Friday?',
    body: `Hey!

A few of us are planning to go to that new Italian place downtown for lunch on Friday. Would you like to join?

They have amazing pasta and the reviews are great. We're thinking around 12:30 PM.

Let me know!
Carol`,
    date: '2026-02-22T16:45:00',
    read: true,
    starred: false,
  },
  {
    id: 4,
    folder: 'inbox',
    from: 'David Lee <david@example.com>',
    to: 'me@example.com',
    subject: 'Invoice #2847 - February Services',
    body: `Dear Customer,

Please find attached the invoice for services rendered in February 2026.

Invoice Number: #2847
Amount Due: $4,250.00
Due Date: March 15, 2026

Payment can be made via bank transfer or credit card through our payment portal.

If you have any questions regarding this invoice, please don't hesitate to reach out.

Regards,
David Lee
Accounts Receivable`,
    date: '2026-02-22T14:20:00',
    read: true,
    starred: false,
  },
  {
    id: 5,
    folder: 'inbox',
    from: 'Emma Wilson <emma@example.com>',
    to: 'me@example.com',
    subject: 'Re: Conference Tickets',
    body: `Great news! I managed to secure early-bird tickets for the TechSummit 2026 conference.

Details:
- Date: April 15-17, 2026
- Location: San Francisco Convention Center
- Tickets: 2x Full Access Pass

I'll forward the confirmation emails once they arrive. Let me know if you need anything else.

Cheers,
Emma`,
    date: '2026-02-21T11:00:00',
    read: true,
    starred: true,
  },
  {
    id: 6,
    folder: 'sent',
    from: 'me@example.com',
    to: 'alice@example.com',
    subject: 'Re: Q1 Marketing Strategy Review',
    body: `Hi Alice,

Thanks for putting this together! The plan looks solid. Thursday works for me — how about 2 PM?

I have a few thoughts on the influencer partnerships I'd like to discuss as well.

Best,
Me`,
    date: '2026-02-22T10:30:00',
    read: true,
    starred: false,
  },
  {
    id: 7,
    folder: 'sent',
    from: 'me@example.com',
    to: 'team@example.com',
    subject: 'Team Standup Notes - Feb 21',
    body: `Hi everyone,

Here are the standup notes from today's meeting:

- Feature release is on track for next Monday
- QA found 3 minor bugs, all assigned to developers
- Design review pushed to Wednesday

Action items:
1. Complete code reviews by EOD Friday
2. Update staging environment
3. Prepare release notes

Let me know if I missed anything.

Thanks!`,
    date: '2026-02-21T09:00:00',
    read: true,
    starred: false,
  },
  {
    id: 8,
    folder: 'drafts',
    from: 'me@example.com',
    to: 'hr@example.com',
    subject: 'Vacation Request - March',
    body: `Hi HR Team,

I would like to request time off from March 10-14, 2026.

I have ensured that my current projects will be covered during my absence and have briefed my team lead.

Please let me know if you need any additional information.

Thank you,`,
    date: '2026-02-20T15:00:00',
    read: true,
    starred: false,
  },
  {
    id: 9,
    folder: 'inbox',
    from: 'GitHub <notifications@github.com>',
    to: 'me@example.com',
    subject: '[repo/project] Pull Request #142 merged',
    body: `Pull Request #142 has been merged into main.

Title: Fix pagination bug in user list
Author: @developer123
Reviewers: @me, @teammate

3 files changed, 47 insertions(+), 12 deletions(-)

View on GitHub: https://github.com/repo/project/pull/142`,
    date: '2026-02-21T20:15:00',
    read: true,
    starred: false,
  },
  {
    id: 10,
    folder: 'inbox',
    from: 'Sophia Martinez <sophia@example.com>',
    to: 'me@example.com',
    subject: 'Book recommendation',
    body: `Hey!

I just finished reading "Designing Data-Intensive Applications" by Martin Kleppmann and I think you'd really enjoy it. It covers distributed systems, databases, and data processing in a very accessible way.

Highly recommend it if you're looking for your next tech read!

Talk soon,
Sophia`,
    date: '2026-02-20T13:30:00',
    read: true,
    starred: false,
  },
];

let emails = [];
let currentFolder = 'inbox';
let selectedEmailId = null;
let nextId = 100;
let _abortController = null;
let _context = {};

function loadEmails() {
  try {
    const saved = localStorage.getItem('email-app-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      emails = parsed.emails || [];
      nextId = parsed.nextId || 100;
    } else {
      emails = JSON.parse(JSON.stringify(SAMPLE_EMAILS));
    }
  } catch (err) {
    console.error('Failed to load emails from localStorage:', err);
    emails = JSON.parse(JSON.stringify(SAMPLE_EMAILS));
  }
}

function saveEmails() {
  try {
    localStorage.setItem('email-app-data', JSON.stringify({ emails, nextId }));
  } catch (err) {
    console.error('Failed to save emails:', err);
  }
}

function getEmailsForFolder(folder) {
  if (folder === 'starred') {
    return emails.filter(e => e.starred && e.folder !== 'trash');
  }
  return emails.filter(e => e.folder === folder);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function updateFolderCounts() {
  const folders = ['inbox', 'sent', 'drafts', 'trash', 'starred'];
  for (const folder of folders) {
    const count = folder === 'starred'
      ? emails.filter(e => e.starred && e.folder !== 'trash').length
      : emails.filter(e => e.folder === folder).length;

    const el = document.getElementById(`count-${folder}`);
    if (el) {
      if (folder === 'inbox') {
        const unread = emails.filter(e => e.folder === 'inbox' && !e.read).length;
        el.textContent = unread > 0 ? unread : '';
      } else {
        el.textContent = count > 0 ? count : '';
      }
    }
  }
}

function renderEmailList() {
  const listEl = document.getElementById('email-list');
  const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase();

  let folderEmails = getEmailsForFolder(currentFolder);

  if (searchTerm) {
    folderEmails = folderEmails.filter(e =>
      e.subject.toLowerCase().includes(searchTerm) ||
      e.from.toLowerCase().includes(searchTerm) ||
      e.body.toLowerCase().includes(searchTerm)
    );
  }

  folderEmails.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (folderEmails.length === 0) {
    listEl.innerHTML = `<div class="email-list-empty">${searchTerm ? 'No matching emails' : 'No emails in this folder'}</div>`;
    return;
  }

  listEl.innerHTML = folderEmails.map(email => {
    const isActive = email.id === selectedEmailId;
    const preview = email.body.split('\n').filter(l => l.trim()).slice(0, 1).join(' ').substring(0, 80);
    const senderName = email.from.includes('<') ? email.from.split('<')[0].trim() : email.from;

    return `
      <div class="email-item ${isActive ? 'active' : ''} ${!email.read ? 'unread' : ''}" data-id="${email.id}">
        <div class="email-item-row">
          <span class="email-item-sender">${escapeHtml(senderName)}</span>
          <span class="email-item-date">${formatDate(email.date)}</span>
        </div>
        <div class="email-item-subject">${escapeHtml(email.subject)}</div>
        <div class="email-item-preview">${escapeHtml(preview)}</div>
        <button class="email-item-star ${email.starred ? 'starred' : ''}" data-star-id="${email.id}" title="Toggle star">
          ${email.starred ? '&#9733;' : '&#9734;'}
        </button>
      </div>
    `;
  }).join('');
}

function renderEmailDetail() {
  const detailEl = document.getElementById('email-detail');
  const emptyEl = document.getElementById('email-detail-empty');

  if (!selectedEmailId) {
    detailEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  const email = emails.find(e => e.id === selectedEmailId);
  if (!email) {
    detailEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  detailEl.hidden = false;
  emptyEl.hidden = true;

  document.getElementById('detail-subject').textContent = email.subject;
  document.getElementById('detail-from').textContent = email.from;
  document.getElementById('detail-date').textContent = new Date(email.date).toLocaleString();
  document.getElementById('detail-to').textContent = `To: ${email.to}`;
  document.getElementById('detail-body').textContent = email.body;

  const starBtn = document.getElementById('btn-star-detail');
  starBtn.innerHTML = email.starred ? '&#9733;' : '&#9734;';
  starBtn.style.color = email.starred ? '#f5a623' : '';
}

function selectEmail(id) {
  selectedEmailId = id;
  const email = emails.find(e => e.id === id);
  if (email && !email.read) {
    email.read = true;
    saveEmails();
    updateFolderCounts();
  }

  const layout = document.querySelector('.email-layout');
  layout.classList.add('show-detail');

  renderEmailList();
  renderEmailDetail();

  if (email && _context.emit) {
    _context.emit('email:opened', { emailId: email.id, subject: email.subject });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openCompose(defaults = {}) {
  document.getElementById('compose-to').value = defaults.to || '';
  document.getElementById('compose-subject').value = defaults.subject || '';
  document.getElementById('compose-body').value = defaults.body || '';
  document.getElementById('compose-overlay').hidden = false;
}

function closeCompose() {
  document.getElementById('compose-overlay').hidden = true;
  document.getElementById('compose-form').reset();
}

function sendEmail() {
  const to = document.getElementById('compose-to').value.trim();
  const subject = document.getElementById('compose-subject').value.trim() || '(No subject)';
  const body = document.getElementById('compose-body').value.trim();

  if (!to) return;

  const email = {
    id: nextId++,
    folder: 'sent',
    from: 'me@example.com',
    to,
    subject,
    body,
    date: new Date().toISOString(),
    read: true,
    starred: false,
  };

  emails.push(email);
  saveEmails();
  closeCompose();
  updateFolderCounts();
  if (currentFolder === 'sent') renderEmailList();

  if (_context.emit) {
    _context.emit('email:sent', { to, subject, body: body.substring(0, 200) });
  }
}

function saveDraft() {
  const to = document.getElementById('compose-to').value.trim();
  const subject = document.getElementById('compose-subject').value.trim() || '(No subject)';
  const body = document.getElementById('compose-body').value.trim();

  const email = {
    id: nextId++,
    folder: 'drafts',
    from: 'me@example.com',
    to: to || '',
    subject,
    body,
    date: new Date().toISOString(),
    read: true,
    starred: false,
  };

  emails.push(email);
  saveEmails();
  closeCompose();
  updateFolderCounts();
  if (currentFolder === 'drafts') renderEmailList();
}

function deleteEmail(id) {
  const email = emails.find(e => e.id === id);
  if (!email) return;

  if (email.folder === 'trash') {
    emails = emails.filter(e => e.id !== id);
  } else {
    email.folder = 'trash';
  }

  if (selectedEmailId === id) {
    selectedEmailId = null;
    document.querySelector('.email-layout')?.classList.remove('show-detail');
  }

  saveEmails();
  updateFolderCounts();
  renderEmailList();
  renderEmailDetail();
}

function toggleStar(id) {
  const email = emails.find(e => e.id === id);
  if (!email) return;

  email.starred = !email.starred;
  saveEmails();
  updateFolderCounts();
  renderEmailList();
  if (selectedEmailId === id) renderEmailDetail();
}

function switchFolder(folder) {
  currentFolder = folder;
  selectedEmailId = null;

  document.querySelector('.email-layout')?.classList.remove('show-detail');

  document.querySelectorAll('.folder-item').forEach(el => {
    el.classList.toggle('active', el.dataset.folder === folder);
  });

  renderEmailList();
  renderEmailDetail();
}

export function init(context = {}) {
  _context = context;
  _abortController = new AbortController();
  const signal = _abortController.signal;

  loadEmails();
  updateFolderCounts();
  renderEmailList();
  renderEmailDetail();

  document.getElementById('folder-list').addEventListener('click', (e) => {
    const item = e.target.closest('.folder-item');
    if (item) switchFolder(item.dataset.folder);
  }, { signal });

  document.getElementById('email-list').addEventListener('click', (e) => {
    const starBtn = e.target.closest('.email-item-star');
    if (starBtn) {
      e.stopPropagation();
      toggleStar(Number(starBtn.dataset.starId));
      return;
    }
    const item = e.target.closest('.email-item');
    if (item) selectEmail(Number(item.dataset.id));
  }, { signal });

  document.getElementById('btn-compose').addEventListener('click', () => openCompose(), { signal });

  document.getElementById('btn-compose-close').addEventListener('click', closeCompose, { signal });
  document.getElementById('btn-discard').addEventListener('click', closeCompose, { signal });

  document.getElementById('compose-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCompose();
  }, { signal });

  document.getElementById('compose-form').addEventListener('submit', (e) => {
    e.preventDefault();
    sendEmail();
  }, { signal });

  document.getElementById('btn-save-draft').addEventListener('click', saveDraft, { signal });

  document.getElementById('btn-reply').addEventListener('click', () => {
    const email = emails.find(e => e.id === selectedEmailId);
    if (!email) return;
    const replyTo = email.from === 'me@example.com' ? email.to : email.from;
    const replyAddr = replyTo.includes('<')
      ? replyTo.match(/<(.+)>/)?.[1] || replyTo
      : replyTo;
    openCompose({
      to: replyAddr,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\n\n${email.body}`,
    });
  }, { signal });

  document.getElementById('btn-delete-detail').addEventListener('click', () => {
    if (selectedEmailId) deleteEmail(selectedEmailId);
  }, { signal });

  document.getElementById('btn-star-detail').addEventListener('click', () => {
    if (selectedEmailId) toggleStar(selectedEmailId);
  }, { signal });

  document.getElementById('btn-back').addEventListener('click', () => {
    selectedEmailId = null;
    document.querySelector('.email-layout')?.classList.remove('show-detail');
    renderEmailList();
    renderEmailDetail();
  }, { signal });

  document.getElementById('search-input').addEventListener('input', () => {
    renderEmailList();
  }, { signal });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('compose-overlay');
      if (overlay && !overlay.hidden) closeCompose();
    }
  }, { signal });
}

export function destroy() {
  if (_abortController) {
    _abortController.abort();
    _abortController = null;
  }
  emails = [];
  currentFolder = 'inbox';
  selectedEmailId = null;
  nextId = 100;
}

export function onAction(action) {
  if (action.type === 'add-email') {
    const p = action.payload || {};
    const email = {
      id: nextId++,
      folder: p.folder || 'inbox',
      from: p.from || 'unknown@example.com',
      to: p.to || 'me@example.com',
      subject: p.subject || '(No subject)',
      body: p.body || '',
      date: p.date || new Date().toISOString(),
      read: false,
      starred: p.starred || false,
    };
    emails.push(email);
    saveEmails();
    updateFolderCounts();
    if (currentFolder === (p.folder || 'inbox')) renderEmailList();
  } else if (action.type === 'mark-unread') {
    const email = emails.find(e => e.id === action.payload?.emailId);
    if (email) {
      email.read = false;
      saveEmails();
      updateFolderCounts();
      renderEmailList();
    }
  }
}

export function onMessage(message) {
  console.log('Email app received message:', message);
}
