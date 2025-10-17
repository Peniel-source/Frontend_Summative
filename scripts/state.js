// 
(function(App) {
    let records = App.Storage.load();

    // Currency settings and rates and their corresponding symbols
    const CURRENCY_RATES = {
        USD: 1.0,
        RWF: 1300.0
    };
    const CURRENCY_SYMBOLS = {
        USD: '$',
        RWF: 'Fr'
    };

    // Display currency and budget settings from the local storage
    let settings = {
        displayCurrency: localStorage.getItem('app:currency') || 'USD',
        budget: parseFloat(localStorage.getItem('app:cap')) || 200
    };

    function updateSetting(key, value) {
        if (key === 'currency') {
            settings.displayCurrency = value;
            localStorage.setItem('app:currency', value);
        } else if (key === 'cap') {
            settings.budget = value;
            localStorage.setItem('app:cap', value);
        }
    }

    function getCurrencyDisplay(amount, currencyCode = settings.displayCurrency) {
        const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
        const rate = CURRENCY_RATES[currencyCode] || 1.0;
        const converted = amount * rate;
        return `${converted.toFixed(2)} ${symbol}`;
    }

    function generateId() {
        const count = records.length + 1;
        return `txn_${count.toString().padStart(3, '0')}_${Date.now()}`;
    }

    function addRecord(data) {
        const newRecord = {
            id: generateId(),
            description: data.description.trim(),
            amount: parseFloat(data.amount),
            category: data.category.trim(),
            date: data.date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        records.unshift(newRecord);
        App.Storage.save(records);
        
        if (App.UI && App.UI.renderDashboard) {
            App.UI.renderDashboard();
        }
    }

    function editRecord(id, updates) {
        const index = records.findIndex(record => record.id === id);
        if (index === -1) return;

        const record = records[index];
        if (updates.description) record.description = updates.description.trim();
        if (updates.amount) record.amount = parseFloat(updates.amount);
        if (updates.category) record.category = updates.category.trim();
        if (updates.date) record.date = updates.date;

        record.updatedAt = new Date().toISOString();
        App.Storage.save(records);
        
        if (App.UI && App.UI.renderDashboard) {
            App.UI.renderDashboard();
        }
    }

    function deleteRecord(id) {
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records.splice(index, 1);
        }
        App.Storage.save(records);
        
        if (App.UI && App.UI.renderDashboard) {
            App.UI.renderDashboard();
        }
    }

    
    let sortState = {
        key: 'date',
        dir: 'desc'
    };

    App.State = {
        records,
        settings,
        sortState,
        addRecord,
        editRecord,
        deleteRecord,
        updateSetting,
        generateId,
        getCurrencyDisplay
    };
})(window.App);