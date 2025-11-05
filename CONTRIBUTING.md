# 🤝 CONTRIBUTING TO DOUBTSTACK

Thank you for your interest in contributing to DoubtStack! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Feature Requests](#feature-requests)
- [Bug Reports](#bug-reports)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Other unprofessional conduct

---

## 🎯 How Can I Contribute?

### 1. Reporting Bugs

Found a bug? Help us improve!

**Before submitting:**
- Check existing issues
- Verify it's reproducible
- Gather relevant information

**Include in bug report:**
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

### 2. Suggesting Enhancements

Have an idea? We'd love to hear it!

**Enhancement proposal should include:**
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

### 3. Code Contributions

Ready to code? Awesome!

**Types of contributions:**
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- UI/UX enhancements
- Test coverage

---

## 🛠️ Development Setup

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Setup Steps

1. **Fork the Repository**
```bash
# Click "Fork" on GitHub
```

2. **Clone Your Fork**
```bash
git clone https://github.com/YOUR_USERNAME/Qoder-DoubtStack.git
cd Qoder-DoubtStack
```

3. **Add Upstream Remote**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/Qoder-DoubtStack.git
```

4. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

5. **Configure Environment**
```bash
cp backend/.env.example backend/.env
# Edit .env with your settings
```

6. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

7. **Start Development**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📝 Coding Standards

### JavaScript/React

**Style Guide:**
- Use ES6+ features
- Functional components preferred
- Meaningful variable names
- Comments for complex logic
- No console.logs in production

**Example:**
```javascript
// Good
const calculateReputation = (action) => {
  const points = REPUTATION_POINTS[action] || 0;
  return Math.max(0, currentReputation + points);
};

// Bad
function calc(a) {
  var x = points[a];
  return x;
}
```

### File Naming

- **Components:** PascalCase (e.g., `DoubtCard.jsx`)
- **Utilities:** camelCase (e.g., `formatDate.js`)
- **Styles:** Same as component (e.g., `DoubtCard.css`)
- **Routes:** kebab-case (e.g., `doubt.routes.js`)

### Code Organization

**Backend:**
```
- Controllers: Business logic
- Routes: Endpoint definitions
- Models: Database schemas
- Middleware: Reusable functions
- Utils: Helper functions
```

**Frontend:**
```
- components/: Reusable UI components
- pages/: Route components
- services/: API calls
- store/: State management
- utils/: Helper functions
```

### Error Handling

**Always handle errors gracefully:**

```javascript
// Backend
try {
  const result = await someOperation();
  res.status(200).json({ status: 'success', data: result });
} catch (error) {
  res.status(500).json({ 
    status: 'error', 
    message: error.message 
  });
}

// Frontend
try {
  const response = await api.getData();
  setData(response.data);
} catch (error) {
  toast.error(error.response?.data?.message || 'Operation failed');
}
```

---

## 💬 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(doubt): resolve voting bug on mobile"
git commit -m "docs(api): update authentication endpoints"

# Bad commits
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "asdfasdf"
```

### Commit Best Practices

- One logical change per commit
- Write clear, descriptive messages
- Reference issues when applicable
- Keep commits focused and atomic

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update from upstream**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests** (if available)
```bash
npm test
```

3. **Check for errors**
```bash
npm run lint
```

4. **Test locally**
- Verify your changes work
- Test on different browsers
- Check mobile responsiveness

### Submitting PR

1. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request on GitHub**

3. **Fill out PR template**

**PR Title Format:**
```
[Type] Brief description

Examples:
[Feature] Add dark mode toggle
[Fix] Resolve login redirect issue
[Docs] Update API documentation
```

**PR Description should include:**
- What changes were made
- Why the changes are needed
- How to test the changes
- Screenshots (for UI changes)
- Related issues (if any)

### PR Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, it will be merged
4. Your contribution will be credited!

### After Merge

1. **Delete your branch**
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

2. **Update your fork**
```bash
git checkout main
git pull upstream main
git push origin main
```

---

## 🎨 UI/UX Guidelines

### Design Principles

- **Consistency:** Use existing patterns
- **Simplicity:** Keep it clean and minimal
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsiveness:** Mobile-first approach

### CSS Guidelines

```css
/* Use CSS variables */
.component {
  color: var(--text-primary);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
}

/* Meaningful class names */
.doubt-card { }        /* Good */
.dc { }                /* Bad */

/* Avoid inline styles */
/* Use CSS classes instead */
```

### Component Structure

```jsx
// Import order
import { useState } from 'react';          // React
import { useNavigate } from 'react-router'; // Third-party
import { useAuthStore } from '../store';    // Local
import './Component.css';                   // Styles

const Component = () => {
  // 1. State
  const [data, setData] = useState(null);
  
  // 2. Hooks
  const navigate = useNavigate();
  
  // 3. Handlers
  const handleClick = () => { };
  
  // 4. Render
  return <div>...</div>;
};

export default Component;
```

---

## 🧪 Testing

### Writing Tests (Future)

```javascript
// Unit test example
describe('calculateReputation', () => {
  it('should add points for upvote', () => {
    expect(calculateReputation('upvote', 10)).toBe(15);
  });
  
  it('should not go below zero', () => {
    expect(calculateReputation('downvote', 0)).toBe(0);
  });
});
```

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Works in different browsers
- [ ] Handles edge cases
- [ ] Error states display correctly
- [ ] Loading states work

---

## 📚 Documentation

### Code Comments

```javascript
// Good: Explain WHY, not WHAT
// Calculate reputation using exponential decay to prevent inflation
const reputation = baseScore * Math.pow(0.9, daysSince);

// Bad: State the obvious
// Add 5 to score
const newScore = score + 5;
```

### Documentation Updates

When adding features, update:
- [ ] README.md (if applicable)
- [ ] API_DOCUMENTATION.md (for API changes)
- [ ] SETUP_GUIDE.md (for setup changes)
- [ ] Code comments
- [ ] JSDoc (if applicable)

---

## 🐛 Debugging Tips

### Backend Issues

```bash
# Enable debug mode
DEBUG=* npm run dev

# Check MongoDB connection
mongo
show dbs
use doubtstack
db.users.find()
```

### Frontend Issues

```javascript
// Add debug logs (remove before committing)
console.log('State:', data);
console.log('Props:', props);

// Use React DevTools
// Check Network tab for API calls
```

---

## 🎯 Priority Areas for Contribution

### High Priority
1. Writing tests
2. Improving documentation
3. Bug fixes
4. Performance optimization
5. Accessibility improvements

### Medium Priority
1. UI/UX enhancements
2. New features from roadmap
3. Code refactoring
4. Error handling

### Low Priority
1. Nice-to-have features
2. Experimental ideas
3. Third-party integrations

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits
- Appreciated in the community!

---

## 📞 Getting Help

### Questions?

- **GitHub Issues:** For bugs and features
- **Discussions:** For general questions
- **Email:** For private matters

### Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make DoubtStack better!

**Happy Contributing! 🚀**

---

**Last Updated:** 2025-10-21
