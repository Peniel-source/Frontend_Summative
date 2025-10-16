# 📊 Student Finance Tracker

A responsive, accessible, and modular web application for tracking personal finances. Built with semantic HTML, vanilla JavaScript, and responsive CSS — includes sorting, regex search, currency switching, budget cap alerts, and a jQuery-powered HTML scraper.

---

## 📁 Project Structure

```
├── index.html
├── README.md
├── assets/
│   ├── seed.json
│   └── test.html
├── scripts/
│   ├── ui.js
│   ├── search.js
│   ├── state.js
│   ├── storage.js
│   └── validators.js
└── styles/
    └── main.css
```

---

## 🌐 Live Demo

**GitHub Pages URL**: (https://peniel-source.github.io/Frontend_Summative/) 

---

## 🎨 Chosen Theme

**Minimalist Budgeting** — clean layout, clear typography, and intuitive navigation designed for students managing personal expenses.

---

## 🚀 Features

- Dashboard overview with total records, spending, top category, and budget cap alerts
- Add/edit/delete records with validation
- Sort by description, amount, or date
- Regex-based live search with case toggle
- Currency switching (USD, RWF)
- Budget cap alerts with visual feedback
- 7-day spending chart
- JSON import/export
- Dark mode toggle
- jQuery-powered HTML scraper

---

## 🔍 Regex Catalog

| Pattern | Description | Example |
|--------|-------------|---------|
| `^Food$` | Exact match | Matches only "Food" |
| `Lunch|Dinner` | OR match | Matches "Lunch" or "Dinner" |
| `(?<=\$)\d+` | Lookbehind | Matches numbers after `$` |
| `\d{4}-\d{2}-\d{2}` | Date format | Matches `2025-10-17` |
| `\w+@\w+\.\w+` | Email format | Matches `user@example.com` |

---

## ♿ Accessibility Notes

- Semantic HTML5 with landmarks (`<main>`, `<nav>`, `<header>`, `<section>`)
- Proper heading hierarchy (`<h1>` to `<h3>`)
- ARIA labels on buttons and inputs
- Live region alerts for budget cap status
- High contrast colors and dark mode support
- Keyboard-navigable forms and sections

---

## 🧪 How to Run Tests

Manual testing steps:

1. **Regex Search**  
   - Try searching `Lunch|Dinner` or `(?<=\$)\d+` in the search bar  
   - Toggle case sensitivity and observe results

2. **Import JSON**  
   - Use `assets/seed.json` with 10+ diverse records  
   - Click “Import” and verify records load correctly

3. **Export JSON**  
   - Click “Export” and confirm downloaded file matches current records

4. **Scraper Test**  
   - Paste `assets/test.html` into the scraper textarea  
   - Click “Scrape” and verify structured output

5. **Dark Mode**  
   - Click 🌙 icon and confirm theme switches and persists

6. **Responsive Layout**  
   - Resize browser to mobile, tablet, and desktop widths  
   - Confirm layout adapts without overlap or breakage

---

## 📦 seed.json Requirements

Located in `assets/seed.json` — includes:

- ≥10 records
- Edge dates: `2020-01-01`, `2030-12-31`
- Large/small amounts: `0.01`, `99999.99`
- Tricky strings: `"Lunch @ Café"`, `"Rent (Jan)"`, `"Gift: 🎁"`

---
## 📹 Demo Video

Unlisted YouTube link: _To be added_


## 📚 References & Code Inspirations

- [MDN Web Docs](https://developer.mozilla.org/) — for JavaScript DOM methods, regex patterns, and accessibility best practices.
- [jQuery API Documentation](https://api.jquery.com/) — for selector syntax and DOM traversal used in the scraper.
- [CSS Tricks](https://css-tricks.com/) — for responsive layout patterns and dark mode implementation using `data-theme`.
- [Stack Overflow](https://stackoverflow.com/) — for debugging patterns and modular JS architecture inspiration.
- [Chart.js](https://www.chartjs.org/) — if used for chart rendering (optional).

> External references were used for learning and implementation guidance.


