# Quick Start Guide

Get the GitHub README Preview API up and running in 5 minutes.

## 1. Clone & Install (1 minute)

```bash
# Clone the repository
git clone https://github.com/yourusername/github-readme-preview.git
cd github-readme-preview

# Install dependencies
npm install
```

## 2. Run Locally (1 minute)

```bash
npm run dev
```

Output:
```
> Ready on http://localhost:3000
```

## 3. Test the API (1 minute)

Open in your browser:

```
http://localhost:3000/api/render?type=html&content=%3Ch1%3EHello%20World%3C%2Fh1%3E
```

Or via curl:

```bash
curl "http://localhost:3000/api/render?type=html&content=%3Ch1%3ETest%3C%2Fh1%3E"
```

You should see an SVG image!

## 4. Deploy to Vercel (2 minutes)

### Option A: Using Vercel CLI (Easiest)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Using GitHub + Vercel Dashboard

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click **"New Project"**
4. Import your GitHub repository
5. Click **"Deploy"**

## 5. Use in GitHub README (Instant)

Copy and paste into your README.md:

```markdown
# My Project

## Architecture

![System](https://YOUR-PROJECT.vercel.app/api/render?type=mermaid&content=graph%20TD%0AA%5BStart%5D%20--%3E%20B%5BEnd%5D)

## Code Example

![Example](https://YOUR-PROJECT.vercel.app/api/render?type=code&language=python&content=print%28%22Hello%22%29)
```

Replace `YOUR-PROJECT` with your Vercel deployment URL!

---

## Common Examples

### HTML

```markdown
![Card](https://YOUR-PROJECT.vercel.app/api/render?type=html&content=%3Cdiv%3E%3Ch1%3ETitle%3C%2Fh1%3E%3Cp%3EContent%3C%2Fp%3E%3C%2Fdiv%3E)
```

### Markdown

```markdown
![Docs](https://YOUR-PROJECT.vercel.app/api/render?type=markdown&content=%23%20Title%0A%0AContent%20**bold**)
```

### Code

```markdown
![Code](https://YOUR-PROJECT.vercel.app/api/render?type=code&language=javascript&content=const%20x%20%3D%201%3B)
```

### Badge

```markdown
![Badge](https://YOUR-PROJECT.vercel.app/api/render?type=component&component=badge&data=%7B%22text%22%3A%22Active%22%7D)
```

---

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🔒 Check [SECURITY.md](./SECURITY.md) for security info
- 📚 See [EXAMPLES.md](./EXAMPLES.md) for more examples
- 🚀 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced deployment

---

## Troubleshooting

### Port Already in Use?

```bash
# Use different port
vercel dev --port 3001
```

### Dependencies Missing?

```bash
rm -rf node_modules
npm install
npm run dev
```

### Build Failed?

```bash
npm run build
npm run dev
```

---

**Done!** Your API is now running. Embed those previews! 🎉
