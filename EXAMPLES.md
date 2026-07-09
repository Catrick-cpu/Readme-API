# API Usage Examples

This document provides real-world examples for using the GitHub README Preview API.

## Quick Reference

Base URL: `https://your-project.vercel.app/api/render`

## HTML Examples

### Example 1: Simple Heading

```markdown
![Hello World](https://your-project.vercel.app/api/render?type=html&content=%3Ch1%3EHello%20World%3C%2Fh1%3E)
```

**Decoded content**: `<h1>Hello World</h1>`

### Example 2: Card Component

```markdown
![Card](https://your-project.vercel.app/api/render?type=html&content=%3Cdiv%20class%3D%22card%22%3E%3Ch2%3EFeature%3C%2Fh2%3E%3Cp%3EDescription%3C%2Fp%3E%3C%2Fdiv%3E&css=.card%7Bborder%3A1px%20solid%20%23ddd%3Bborder-radius%3A8px%3Bpadding%3A20px%3B%7D)
```

**HTML content**:
```html
<div class="card">
  <h2>Feature</h2>
  <p>Description</p>
</div>
```

**CSS**:
```css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}
```

### Example 3: Responsive Layout with Dark Theme

```markdown
![Dark Layout](https://your-project.vercel.app/api/render?type=html&width=800&height=600&theme=dark&content=%3Csection%3E%3Ch1%3EDark%20Mode%3C%2Fh1%3E%3Cp%3EThis%20renders%20with%20dark%20theme%3C%2Fp%3E%3C%2Fsection%3E)
```

## Markdown Examples

### Example 1: Document

```markdown
![Markdown Doc](https://your-project.vercel.app/api/render?type=markdown&content=%23%20Getting%20Started%0A%0A%23%23%20Installation%0A%0A%60%60%60bash%0Anpm%20install%0A%60%60%60%0A%0A%23%23%20Usage%0A%0ASee%20the%20[docs](https%3A%2F%2Fexample.com))
```

**Markdown content**:
```markdown
# Getting Started

## Installation

```bash
npm install
```

## Usage

See the [docs](https://example.com)
```

### Example 2: Table

```markdown
![Markdown Table](https://your-project.vercel.app/api/render?type=markdown&content=%7C%20Name%20%7C%20Age%20%7C%0A%7C%20--%20%7C%20--%20%7C%0A%7C%20Alice%20%7C%2025%20%7C%0A%7C%20Bob%20%7C%2030%20%7C)
```

**Markdown table**:
```markdown
| Name  | Age |
| ----- | --- |
| Alice | 25  |
| Bob   | 30  |
```

## Code Examples

### Example 1: Python

```markdown
![Python](https://your-project.vercel.app/api/render?type=code&language=python&content=def%20fibonacci%28n%29%3A%0A%20%20%20%20if%20n%20%3C%3D%201%3A%0A%20%20%20%20%20%20%20%20return%20n%0A%20%20%20%20return%20fibonacci%28n-1%29%20%2B%20fibonacci%28n-2%29)
```

**Code content**:
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

### Example 2: JavaScript

```markdown
![JavaScript](https://your-project.vercel.app/api/render?type=code&language=javascript&content=const%20greet%20%3D%20%28name%29%20%3D%3E%20%7B%0A%20%20console.log%28%60Hello%2C%20%24%7Bname%7D%21%60%29%3B%0A%7D%3B%0A%0Agreet%28%22World%22%29%3B)
```

**Code content**:
```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

greet("World");
```

### Example 3: HTML

```markdown
![HTML](https://your-project.vercel.app/api/render?type=code&language=html&content=%3C%21DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%3Chead%3E%0A%20%20%20%20%3Ctitle%3EExample%3C%2Ftitle%3E%0A%20%20%3C%2Fhead%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Ch1%3EHello%3C%2Fh1%3E%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E)
```

### Example 4: All Supported Languages

The API supports 13+ languages:

```markdown
![TypeScript](https://your-project.vercel.app/api/render?type=code&language=typescript&content=interface%20User%20%7B%0A%20%20id%3A%20number%3B%0A%20%20name%3A%20string%3B%0A%7D)

![C++](https://your-project.vercel.app/api/render?type=code&language=cpp&content=%23include%20%3Ciostream%3E%0Aint%20main%28%29%20%7B%0A%20%20std%3A%3Acout%20%3C%3C%20%22Hello%22%3B%0A%7D)

![Rust](https://your-project.vercel.app/api/render?type=code&language=rust&content=fn%20main%28%29%20%7B%0A%20%20println%21%28%22Hello%22%29%3B%0A%7D)
```

## Mermaid Examples

### Example 1: Flowchart

```markdown
![Flowchart](https://your-project.vercel.app/api/render?type=mermaid&content=graph%20TD%0AA%5BStart%5D%0AA%20--%3E%20B%7BDecision%7D%0AB%20--%3E%7CYes%7C%20C%5BSuccess%5D%0AB%20--%3E%7CNo%7C%20D%5BFail%5D%0AC%20--%3E%20E%5BEnd%5D%0AD%20--%3E%20E)
```

**Mermaid content**:
```mermaid
graph TD
  A[Start]
  A --> B{Decision}
  B --> |Yes| C[Success]
  B --> |No| D[Fail]
  C --> E[End]
  D --> E
```

### Example 2: Sequence Diagram

```markdown
![Sequence](https://your-project.vercel.app/api/render?type=mermaid&content=sequenceDiagram%0Aparticipant%20User%0Aparticipant%20API%0AUser-%3E%3EAPI%3A%20Request%0AAPI--%3E%3EUser%3A%20Response)
```

**Mermaid content**:
```mermaid
sequenceDiagram
  participant User
  participant API
  User->>API: Request
  API-->>User: Response
```

### Example 3: Gantt Chart

```markdown
![Gantt](https://your-project.vercel.app/api/render?type=mermaid&content=gantt%0Atitle%20Project%20Timeline%0Asection%20Tasks%0ADesign%20%3Aactive%2Ctask1%2C0%2C30d%0AImplement%20%3Atask2%2C30d%2C40d%0ATest%20%3Atask3%2C40d%2C20d)
```

## Component Examples

### Example 1: Status Badge

```markdown
![Active Badge](https://your-project.vercel.app/api/render?type=component&component=badge&data=%7B%22text%22%3A%22Active%22%2C%22color%22%3A%22%2328a745%22%7D)

![Inactive Badge](https://your-project.vercel.app/api/render?type=component&component=badge&data=%7B%22text%22%3A%22Inactive%22%2C%22color%22%3A%22%23dc3545%22%7D)

![Beta Badge](https://your-project.vercel.app/api/render?type=component&component=badge&data=%7B%22text%22%3A%22Beta%22%2C%22color%22%3A%22%23ffc107%22%7D)
```

### Example 2: Stat Card

```markdown
![Users Stat](https://your-project.vercel.app/api/render?type=component&component=stat-card&data=%7B%22title%22%3A%22Total%20Users%22%2C%22value%22%3A%221%2C234%22%2C%22color%22%3A%22%230366d6%22%7D&width=200&height=120)

![Revenue Stat](https://your-project.vercel.app/api/render?type=component&component=stat-card&data=%7B%22title%22%3A%22Revenue%22%2C%22value%22%3A%22%2485%2C432%22%2C%22color%22%3A%22%2328a745%22%7D&width=200&height=120)
```

### Example 3: Progress Bar

```markdown
![Progress 75%](https://your-project.vercel.app/api/render?type=component&component=progress&data=%7B%22value%22%3A75%2C%22max%22%3A100%2C%22color%22%3A%22%230366d6%22%7D&width=300&height=30)

![Progress 100%](https://your-project.vercel.app/api/render?type=component&component=progress&data=%7B%22value%22%3A100%2C%22max%22%3A100%2C%22color%22%3A%22%2328a745%22%7D&width=300&height=30)
```

### Example 4: Chart

```markdown
![Bar Chart](https://your-project.vercel.app/api/render?type=component&component=chart&data=%7B%22title%22%3A%22Monthly%20Sales%22%2C%22data%22%3A%5B%7B%22label%22%3A%22Jan%22%2C%22value%22%3A100%7D%2C%7B%22label%22%3A%22Feb%22%2C%22value%22%3A150%7D%2C%7B%22label%22%3A%22Mar%22%2C%22value%22%3A120%7D%5D%7D&width=400&height=250)
```

### Example 5: Table

```markdown
![Data Table](https://your-project.vercel.app/api/render?type=component&component=table&data=%7B%22headers%22%3A%5B%22Product%22%2C%22Price%22%2C%22Stock%22%5D%2C%22rows%22%3A%5B%5B%22Laptop%22%2C%22%241200%22%2C%2215%22%5D%2C%5B%22Monitor%22%2C%22%24400%22%2C%2232%22%5D%5D%7D&width=600&height=200)
```

### Example 6: Dashboard

```markdown
![Dashboard](https://your-project.vercel.app/api/render?type=component&component=dashboard&data=%7B%22title%22%3A%22Analytics%20Dashboard%22%2C%22cards%22%3A%5B%7B%22title%22%3A%22Users%22%2C%22value%22%3A%221%2C234%22%2C%22color%22%3A%22%230366d6%22%7D%2C%7B%22title%22%3A%22Revenue%22%2C%22value%22%3A%22%2485k%22%2C%22color%22%3A%22%2328a745%22%7D%2C%7B%22title%22%3A%22Growth%22%2C%22value%22%3A%2218%25%22%2C%22color%22%3A%22%23ffc107%22%7D%5D%7D&width=800&height=300)
```

## URL Encoding Helper

### Python Script

```python
import urllib.parse

def encode_param(text):
    return urllib.parse.quote(text)

def encode_json(data):
    import json
    return urllib.parse.quote(json.dumps(data))

# Example
html = '<h1>Hello</h1>'
print(f"?type=html&content={encode_param(html)}")

data = {"title": "Users", "value": "1,234", "color": "#0366d6"}
print(f"&data={encode_json(data)}")
```

### JavaScript Helper

```javascript
function encodeParam(text) {
  return encodeURIComponent(text);
}

function encodeJson(data) {
  return encodeURIComponent(JSON.stringify(data));
}

// Example
const html = '<h1>Hello</h1>';
console.log(`?type=html&content=${encodeParam(html)}`);

const data = { title: "Users", value: "1,234", color: "#0366d6" };
console.log(`&data=${encodeJson(data)}`);
```

### Bash Helper

```bash
#!/bin/bash

encode() {
  python3 -c "import urllib.parse; print(urllib.parse.quote('''$1'''))"
}

# Example
html='<h1>Hello</h1>'
encoded=$(encode "$html")
echo "?type=html&content=$encoded"
```

## Complete README Example

```markdown
# My Awesome Project

A production-ready solution for [description].

## Architecture

![System Diagram](https://your-project.vercel.app/api/render?type=mermaid&content=graph%20TD%0AA%5BUser%5D%20--%3E%20B%5BAPI%5D%0AB%20--%3E%20C%5BDatabase%5D%0AC%20--%3E%20B%0AB%20--%3E%20D%5BCache%5D)

## Installation

![Setup Guide](https://your-project.vercel.app/api/render?type=markdown&content=%23%23%20Quick%20Start%0A%0A%60%60%60bash%0Anpm%20install%0Nnpm%20run%20dev%0A%60%60%60)

## Code Example

![JavaScript Example](https://your-project.vercel.app/api/render?type=code&language=javascript&content=const%20app%20%3D%20express%28%29%3B%0Aapp.get%28%27%2F%27%2C%20%28req%2C%20res%29%20%3D%3E%20%7B%0A%20%20res.send%28%27Hello%27%29%3B%0A%7D%29%3B)

## Status

![Production](https://your-project.vercel.app/api/render?type=component&component=badge&data=%7B%22text%22%3A%22Production%20Ready%22%2C%22color%22%3A%22%2328a745%22%7D)
![Coverage](https://your-project.vercel.app/api/render?type=component&component=progress&data=%7B%22value%22%3A95%2C%22max%22%3A100%2C%22color%22%3A%22%230366d6%22%7D)

---

Built with ❤️
```

## Tips & Tricks

### 1. Test URLs in Browser
Paste the full URL directly in your browser to see the SVG output.

### 2. Use Short URLs
For GitHub READMEs, consider using a URL shortener if URLs become too long.

### 3. Version Your Content
Include version numbers in alt text for clarity:
```markdown
![v1.0 Dashboard](https://your-project.vercel.app/api/render?...)
```

### 4. Responsive Sizing
Adjust width/height for different contexts:
```markdown
<!-- Large preview -->
![Full](https://...&width=1000&height=800)

<!-- Small preview -->
![Small](https://...&width=400&height=300)
```

### 5. Consistency
Use the same theme across all previews for a cohesive look:
```markdown
?theme=dark  <!-- All dark -->
?theme=light <!-- All light -->
```

---

For more information, see the main [README.md](./README.md)
