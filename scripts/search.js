// THis file controls the regex search section

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


document.addEventListener('DOMContentLoaded', () => {
    const scrapeBtn = document.getElementById('scrapeBtn');
    if (!scrapeBtn) return;

    scrapeBtn.addEventListener('click', () => {
        const rawHtml = document.getElementById('htmlInput').value;
        const $dom = $('<div>').html(rawHtml);

        const items = [];
        $dom.find('.product').each(function () {
            const title = $(this).find('.title').text().trim();
            const price = $(this).find('.price').text().trim();
            items.push({ title, price });
        });

        document.getElementById('output').textContent = JSON.stringify(items, null, 2);
    });
});



