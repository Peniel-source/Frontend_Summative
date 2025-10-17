// This file controls the regex search section

(function(App) {
    const compileRegex = (input, flags = '') => {
        try {
            const effectiveFlags = input ? flags : '';
            return input ? new RegExp(input, effectiveFlags) : null;
        } catch {
            return null; 
        }
    };

    const highlight = (text, regex) => {
        if (!regex || typeof text !== 'string') return text;
        try {
            return text.replace(regex, match => `<mark>${match}</mark>`);
        } catch {
            return text;
        }
    };

    const filterRecords = (records, regex) => {
        if (!regex) return records;

        return records.filter(record => {
            
            return regex.test(record.description) || regex.test(record.category);
        });
    };

    App.Search = { compileRegex, highlight, filterRecords };
})(window.App);


// Mini jQuery Scraper 
document.addEventListener('DOMContentLoaded', () => {
    const scrapeBtn = document.getElementById('scrapeBtn');
    if (!scrapeBtn) return;

    scrapeBtn.addEventListener('click', () => {
        const htmlInput = document.getElementById('htmlInput').value;

        // Check if jQuery is loaded
        if (typeof $ === 'undefined') {
            document.getElementById('output').textContent = 'Error: jQuery not loaded';
            return;
        }

        const $dom = $('<div>').html(htmlInput);

        const output = {
            headings: [],
            links: [],
            images: [],
            tables: [],
            formFields: []
        };

        // headings
        $dom.find('h1, h2, h3, h4, h5, h6').each(function() {
            const text = $(this).text().trim();
            if (text) output.headings.push(text);
        });

        // links
        $dom.find('a[href]').each(function() {
            output.links.push({
                text: $(this).text().trim(),
                href: $(this).attr('href')
            });
        });

        // images
        $dom.find('img[src]').each(function() {
            output.images.push({
                src: $(this).attr('src'),
                alt: $(this).attr('alt') || ''
            });
        });

        // tables
        $dom.find('table').each(function() {
            const rows = [];
            $(this).find('tr').each(function() {
                const cells = [];
                $(this).find('th, td').each(function() {
                    const text = $(this).text().trim();
                    cells.push(text);
                });
                if (cells.length) rows.push(cells);
            });
            if (rows.length) output.tables.push(rows);
        });

        //form fields
        $dom.find('input, select, textarea').each(function() {
            const tag = this.tagName.toLowerCase();
            const name = $(this).attr('name') || '';
            const type = $(this).attr('type') || '';
            const value = $(this).val() || '';
            output.formFields.push({ tag, name, type, value });
        });

        document.getElementById('output').textContent = JSON.stringify(output, null, 2);
    });
});