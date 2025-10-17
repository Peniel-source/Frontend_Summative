// This file does most of error handling and validating regex
(function(App) {
    // Define regexes
    const rules = {
        description: /^\S(?:.*\S)?$|^[^ ]$/,
        amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        advanced: /\b(\w+)\s+\1\b/
    };

    
    function validateField(fieldName, value) {
        const regex = rules[fieldName];
        if (!regex) return false;
        if (fieldName === 'amount' && parseFloat(value) <= 0) return false;

        return regex.test(value);
    }

    function getErrorMessage(fieldName) {
        const messages = {
            description: 'Description required. No leading/trailing spaces allowed.',
            amount: 'Enter a valid amount (> 0) up to two decimal places (e.g., 12.50).',
            date: 'Use format YYYY-MM-DD.',
            category: 'Only letters, spaces, and hyphens allowed (e.g., "Dining Out").',
            advanced: 'Description contains duplicate words (e.g., "coffee coffee").'
        };
        return messages[fieldName] || 'Invalid input.';
    }

    function validateRecordStructure(record) {
        const requiredFields = ['id', 'description', 'amount', 'category', 'date', 'createdAt', 'updatedAt'];
        const hasRequiredFields = requiredFields.every(field => record.hasOwnProperty(field));

        if (!hasRequiredFields) {
            return false;
        }

        if (typeof record.amount !== 'number' || typeof record.id !== 'string') {
            return false;
        }

        if (!validateField('amount', record.amount.toString()) || !validateField('date', record.date)) {
            return false;
        }

        return true;
    }

    App.Validators = { rules, validateField, getErrorMessage, validateRecordStructure };
})(window.App);