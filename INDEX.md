# GitHub README Preview System - Complete Project Index

Welcome! This is a production-ready Vercel serverless API for generating SVG previews of HTML, Markdown, code, and diagrams for GitHub READMEs.

## 📚 Documentation Guide

Start here based on what you want to do:

### 🚀 I want to get started quickly (5 minutes)
→ **[QUICKSTART.md](./QUICKSTART.md)**
- Clone, install, and run locally
- Deploy to Vercel
- Test with examples

### 📖 I want to understand the project
→ **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**
- What this project does
- Architecture overview
- Technology stack
- Key features

### 🔧 I want the complete documentation
→ **[README.md](./README.md)**
- Feature list
- Installation
- Deployment instructions
- Usage examples
- Troubleshooting

### 📡 I want API specifications
→ **[API_REFERENCE.md](./API_REFERENCE.md)**
- Complete endpoint documentation
- All parameters
- Response formats
- 50+ code examples

### 💡 I want real-world examples
→ **[EXAMPLES.md](./EXAMPLES.md)**
- HTML, Markdown, Code examples
- Mermaid diagrams
- UI components
- Complete GitHub README examples
- URL encoding helpers

### 🚢 I want to deploy to production
→ **[DEPLOYMENT.md](./DEPLOYMENT.md)**
- Vercel CLI setup
- GitHub integration
- Custom domains
- Monitoring
- Troubleshooting
- CI/CD integration

### 🔒 I want to understand security
→ **[SECURITY.md](./SECURITY.md)**
- Input validation
- HTML sanitization
- XSS prevention
- SVG injection prevention
- Dependency security
- Compliance

## 📁 Project Structure

```
.
├── 📄 QUICKSTART.md           ← Start here! (5 min)
├── 📄 PROJECT_OVERVIEW.md     ← Understanding the project
├── 📄 README.md               ← Full documentation
├── 📄 API_REFERENCE.md        ← API specifications
├── 📄 EXAMPLES.md             ← Real-world examples
├── 📄 DEPLOYMENT.md           ← Deploy to Vercel
├── 📄 SECURITY.md             ← Security details
├── 📄 INDEX.md                ← This file
│
├── 📁 api/                    # Vercel Functions
│   ├── render.ts              # Main /api/render endpoint
│   └── _types.ts              # TypeScript types
│
├── 📁 src/
│   ├── parsers/               # Input parsing
│   │   ├── html.ts
│   │   ├── markdown.ts
│   │   ├── code.ts
│   │   └── mermaid.ts
│   ├── renderers/             # SVG output
│   │   ├── svg.ts
│   │   └── components.ts
│   └── utils/                 # Utilities
│       ├── validation.ts
│       ├── sanitize.ts
│       └── encoding.ts
│
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vercel.json                # Vercel config
└── .gitignore                 # Git ignore rules
```

## 🎯 Quick Links by Task

| I want to... | Read this |
|-------------|-----------|
| **Get started in 5 minutes** | [QUICKSTART.md](./QUICKSTART.md) |
| **Deploy to Vercel** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **See API examples** | [EXAMPLES.md](./EXAMPLES.md) |
| **Read API docs** | [API_REFERENCE.md](./API_REFERENCE.md) |
| **Understand security** | [SECURITY.md](./SECURITY.md) |
| **Full documentation** | [README.md](./README.md) |
| **Project overview** | [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) |

## 🚀 Getting Started (3 Steps)

### Step 1: Clone & Install (1 minute)
```bash
git clone https://github.com/yourusername/github-readme-preview.git
cd github-readme-preview
npm install
```

### Step 2: Run Locally (1 minute)
```bash
npm run dev
```

Visit: `http://localhost:3000/api/render?type=html&content=%3Ch1%3EHello%3C%2Fh1%3E`

### Step 3: Deploy (1 minute)
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 💻 Use in GitHub README

```markdown
# My Project

## Architecture

![Diagram](https://YOUR-PROJECT.vercel.app/api/render?type=mermaid&content=graph%20TD%0AA%5BStart%5D%20--%3E%20B%5BEnd%5D)

## Code Example

![Code](https://YOUR-PROJECT.vercel.app/api/render?type=code&language=python&content=print%28%22Hello%22%29)
```

## 📋 Feature Checklist

- ✅ HTML preview rendering
- ✅ Markdown to SVG conversion
- ✅ Syntax-highlighted code blocks (15+ languages)
- ✅ Mermaid diagram support
- ✅ UI component library (badges, cards, charts)
- ✅ XSS prevention
- ✅ Input sanitization
- ✅ Full validation
- ✅ Vercel deployment
- ✅ CORS enabled
- ✅ Comprehensive documentation

## 📖 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup | Everyone |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Project understanding | Developers |
| [README.md](./README.md) | Full documentation | All users |
| [API_REFERENCE.md](./API_REFERENCE.md) | API specifications | Developers |
| [EXAMPLES.md](./EXAMPLES.md) | Usage examples | Content creators |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment | DevOps/Ops |
| [SECURITY.md](./SECURITY.md) | Security details | Security team |
| [INDEX.md](./INDEX.md) | Navigation guide | All users |

## 🛠️ Tech Stack

- **Runtime:** Node.js 20.x
- **Language:** TypeScript
- **Platform:** Vercel Serverless Functions
- **Parsing:** marked, highlight.js
- **Validation:** Zod
- **Security:** sanitize-html
- **SVG:** Custom builder

## 🔐 Security Features

- ✅ Input validation (Zod)
- ✅ HTML sanitization
- ✅ XSS prevention
- ✅ SVG injection prevention
- ✅ URL validation
- ✅ Content-length limits
- ✅ Language whitelist
- ✅ No code execution

## 📊 Performance

- **Response time:** 30-150ms (typical)
- **Cold start:** ~100-200ms
- **Caching:** 1 hour (immutable)
- **Global:** Vercel edge network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally: `npm run dev`
5. Submit a pull request

## 📞 Support

- **Documentation:** This directory (8 comprehensive guides)
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

## 📝 License

MIT License - See LICENSE file

## ✨ What You Can Do

### Create HTML Previews
```
?type=html&content=<h1>Hello</h1>
```

### Render Markdown
```
?type=markdown&content=%23%20Title%0A...
```

### Highlight Code
```
?type=code&language=python&content=...
```

### Draw Diagrams
```
?type=mermaid&content=graph%20TD%0A...
```

### Create Components
```
?type=component&component=badge&data=...
```

## 🎓 Learning Path

1. **Beginner:** [QUICKSTART.md](./QUICKSTART.md) (5 min)
2. **Understanding:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) (10 min)
3. **Using:** [EXAMPLES.md](./EXAMPLES.md) (15 min)
4. **Deep Dive:** [README.md](./README.md) (20 min)
5. **Reference:** [API_REFERENCE.md](./API_REFERENCE.md) (as needed)
6. **Production:** [DEPLOYMENT.md](./DEPLOYMENT.md) (20 min)

## 🚀 Ready?

**Start with [QUICKSTART.md](./QUICKSTART.md) to deploy in 5 minutes!**

---

Built with ❤️ for GitHub README previews. Last updated: 2026-07-09
