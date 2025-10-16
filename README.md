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

## 🚀 Features

- **Dashboard Overview**  
  View total records, total spending, top category, and budget cap status with visual alerts.

- **Record Management**  
  Add, edit, delete financial records with validation and accessibility support.

- **Sorting & Filtering**  
  Sort by description, amount, or date. Filter records using live regex search with case sensitivity toggle.

- **Currency Switching**  
  Display amounts in different currencies (e.g. USD, RWF) with dynamic formatting.

- **Budget Cap Alerts**  
  Set a spending cap and receive visual warnings when nearing or exceeding it.

- **Chart Visualization**  
  View a 7-day spending trend with animated bar charts.

- **Import/Export JSON**  
  Upload valid JSON arrays of records or export your data for backup.

- **Dark Mode Toggle**  
  Switch between light and dark themes using a persistent toggle button.

- **Mini jQuery Scraper**  
  Paste static HTML snippets and extract structured data like headings, links, images, tables, and form fields using jQuery selectors.

---

## 🧪 Scraper Usage

1. Navigate to the **Scraper** section via the nav button.
2. Paste any static HTML snippet (e.g. product cards, article blocks).
3. Click **Scrape** to extract:
   - Headings (`<h1>`–`<h6>`)
   - Links (`<a href>`)
   - Images (`<img src>`)
   - Tables (`<table>`)
   - Form fields (`<input>`, `<select>`, `<textarea>`)
4. View the structured JSON output in a styled container.

> Sample HTML snippets are available in `assets/test.html`.

---

## 📦 Import Format

```json
[
  {
    "description": "Lunch",
    "amount": 5.99,
    "category": "Food",
    "date": "2025-10-16"
  }
]
```

> Must be a valid JSON array. Each object must include `description`, `amount`, `category`, and `date`.

---

## 🛠 Technologies Used

- Vanilla JavaScript (modular)
- jQuery (for scraping only)
- Semantic HTML5
- Responsive CSS with dark mode support
- LocalStorage for persistence

---

## ♿ Accessibility Highlights

- ARIA labels on buttons
- Keyboard-navigable sections
- Color contrast and theme toggling
- Live region alerts for budget cap status

---

## 🌙 Dark Mode

Toggle via the moon/sun icon in the header. Theme preference is saved in `localStorage` and applied on load using:

```js
document.body.setAttribute('data-theme', 'dark');
```

CSS uses `[data-theme="dark"]` selectors for styling.

---

## 📌 Future Enhancements

- Clipboard export for scraped data
- CSV import/export
- Category color tagging
- System theme detection (`prefers-color-scheme`)
- Scraper selector presets

---

## 📚 References & Code Inspirations

- [MDN Web Docs](https://developer.mozilla.org/) — for JavaScript DOM methods, regex patterns, and accessibility best practices.
- [jQuery API Documentation](https://api.jquery.com/) — for selector syntax and DOM traversal used in the scraper.
- [CSS Tricks](https://css-tricks.com/) — for responsive layout patterns and dark mode implementation using `data-theme`.
- [Stack Overflow](https://stackoverflow.com/) — for debugging patterns and modular JS architecture inspiration.
- [Chart.js](https://www.chartjs.org/) — if used for chart rendering (optional).

> External references were used for learning and implementation guidance.


