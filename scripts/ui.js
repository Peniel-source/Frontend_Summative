// This is the main script file. It does DOM manipulation and some interface works

(function(App) {
    const { settings, sortState, addRecord, editRecord, deleteRecord, updateSetting, getCurrencyDisplay } = App.State;
    const { validateField, getErrorMessage, rules, validateRecordStructure } = App.Validators;
    const { compileRegex, highlight, filterRecords } = App.Search;

    let currentRegex = null;

    function getRecords() {
        return App.State.records;
    }

    // Switching to section when corresponding button is clicked
    function showSection(id) {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.add('hidden-section');
        });
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.setAttribute('tabindex', '-1');
            targetSection.focus();
            targetSection.removeAttribute('tabindex');
        }

        document.querySelectorAll('.nav-button').forEach(btn => {
            const isSelected = btn.getAttribute('data-target') === id;
            btn.classList.toggle('active', isSelected);
        });
    }

    function renderRecords() {
        const records = getRecords();
        const sortedRecords = [...records].sort((a, b) => {
            const { key, dir } = sortState;
            let comparison = 0;

            if (key === 'description') {
                comparison = a.description.localeCompare(b.description);
            } else if (key === 'amount') {
                comparison = a.amount - b.amount;
            } else if (key === 'date') {
                comparison = new Date(a.date) - new Date(b.date);
            }

            return dir === 'asc' ? comparison : -comparison;
        });

        const finalRecords = filterRecords(sortedRecords, currentRegex);

        const container = document.getElementById('recordsContainer');
        container.innerHTML = '';

        if (finalRecords.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #666; padding: 2rem;">No records found matching current filter/search criteria.</p>`;
            return;
        }

        finalRecords.forEach(record => {
            const div = document.createElement('div');
            div.className = 'record-card';
            div.innerHTML = `              
                <div class="record-category">${record.category}</div>
                <p class="record-description">${highlight(record.description, currentRegex)}</p>
                <p class="record-amount">${getCurrencyDisplay(record.amount)}</p>
                <p class="record-date">Date: ${record.date}</p>
                <p class="record-updated">Updated: ${new Date(record.updatedAt).toLocaleDateString()}</p>
                <div class="record-actions">
                  <button class="edit-btn" data-id="${record.id}" aria-label="Edit record ${record.description}">Edit</button>
                  <button class="delete-btn" data-id="${record.id}" aria-label="Delete record ${record.description}">Delete</button>
                </div>              
            `;
            container.appendChild(div);
        });
    }

    // Dashboard settings
    function renderDashboard() {
        const records = getRecords();
        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);

        const categoryCount = {};
        records.forEach(r => {
            categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
        });
        const topCategory = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        document.getElementById('totalRecords').textContent = totalRecords;
        document.getElementById('totalAmount').textContent = getCurrencyDisplay(totalAmount, settings.displayCurrency);
        document.getElementById('topCategory').textContent = topCategory;

        const cap = settings.budget;
        const capMessage = document.getElementById('capMessage');
        const remaining = cap - totalAmount;

        capMessage.className = 'budget-status';

        if (remaining < 0) {
            capMessage.setAttribute('aria-live', 'assertive');
            capMessage.textContent = `🚨 Budget EXCEEDED! You are ${getCurrencyDisplay(Math.abs(remaining))} over your cap of ${getCurrencyDisplay(cap, 'USD')}.`;
            capMessage.style.color = '#dc2626';
        } else if (remaining < cap * 0.2) {
            capMessage.setAttribute('aria-live', 'polite');
            capMessage.textContent = `⚠️ Warning: You have ${getCurrencyDisplay(remaining)} remaining. Use caution!`;
            capMessage.style.color = '#d97706';
        } else {
            capMessage.setAttribute('aria-live', 'polite');
            capMessage.textContent = `✅ Good job! You have ${getCurrencyDisplay(remaining)} remaining out of your cap of ${getCurrencyDisplay(cap, 'USD')}.`;
            capMessage.style.color = '#059669';
        }

        renderTrendChart(records);
    }

    // Expense chart
    function renderTrendChart(records) {
        const chart = document.getElementById('trendChart');
        chart.innerHTML = '';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyTotals = Array(7).fill(0);

        records.forEach(r => {
            const date = new Date(r.date);
            date.setHours(0, 0, 0, 0);

            const diffMs = today.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays < 7) {
                dailyTotals[6 - diffDays] += r.amount;
            }
        });

        const maxAmount = Math.max(...dailyTotals, 10);

        dailyTotals.forEach((amount, index) => {
            const bar = document.createElement('div');
            const heightPercentage = amount > 0 ? Math.max((amount / maxAmount) * 100, 5) : 0;

            bar.className = 'chart-bar';
            bar.style.height = `${heightPercentage}%`;
            bar.title = `Day ${index + 1}: ${amount.toFixed(2)} USD`;
            bar.setAttribute('aria-label', `Day ${index + 1}: ${amount.toFixed(2)} USD`);
            chart.appendChild(bar);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;

        const data = {
            description: document.getElementById('desc').value,
            amount: document.getElementById('amount').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };

        let isValid = true;
        for (const field in data) {
            const value = data[field];
            const errorSpan = document.getElementById(`${field}Error`);
            errorSpan.textContent = '';

            if (!validateField(field, value)) {
                errorSpan.textContent = getErrorMessage(field);
                isValid = false;
            }
        }

        // Advanced regex check for duplicate words
        const advancedCheck = rules.advanced.test(data.description);
        const descErrorSpan = document.getElementById('descriptionError');
        if (advancedCheck) {
            descErrorSpan.textContent = getErrorMessage('advanced');
            isValid = false;
        }

        if (!isValid) return;

        const recordId = document.getElementById('recordId').value;

        if (recordId) {
            editRecord(recordId, data);
        } else {
            addRecord(data);
        }

        renderRecords();
        renderDashboard();
        form.reset();
        document.getElementById('recordId').value = '';
        showSection('records');
    }

    function setupListeners() {
        // Navigation
        document.querySelectorAll('[data-target]').forEach(button => {
            button.addEventListener('click', () => showSection(button.getAttribute('data-target')));
        });

        showSection('dashboard');

        // Form Submit
        document.getElementById('recordForm').addEventListener('submit', handleFormSubmit);

        // Edit/Delete Buttons
        document.getElementById('recordsContainer').addEventListener('click', (e) => {
            const target = e.target;
            const id = target.getAttribute('data-id');
            const records = getRecords();

            if (target.classList.contains('edit-btn')) {
                const record = records.find(r => r.id === id);
                if (record) {
                    document.getElementById('recordId').value = record.id;
                    document.getElementById('desc').value = record.description;
                    document.getElementById('amount').value = record.amount;
                    document.getElementById('category').value = record.category;
                    document.getElementById('date').value = record.date;
                    showSection('forms');
                }
            } else if (target.classList.contains('delete-btn')) {
                document.getElementById('confirmDeleteBtn').setAttribute('data-record-id', id);
                document.getElementById('deleteModal').style.display = 'flex';
            }
        });

        // Delete Modal Handlers
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            document.getElementById('deleteModal').style.display = 'none';
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-record-id');
            deleteRecord(id);
            renderRecords();
            renderDashboard();
            document.getElementById('deleteModal').style.display = 'none';
        });

        // Sorting
        document.querySelectorAll('.sort-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const key = button.id.replace('sort', '').toLowerCase();
                const currentDir = button.getAttribute('data-dir');
                const newDir = (sortState.key === key && currentDir === 'asc') ? 'desc' : 'asc';

                sortState.key = key;
                sortState.dir = newDir;

                document.querySelectorAll('.sort-button').forEach(btn => {
                    const icon = btn.querySelector('.sort-icon');
                    icon.textContent = (btn.id === button.id && newDir === 'desc') ? '↓' : '↑';
                    btn.setAttribute('data-dir', (btn.id === button.id) ? newDir : 'asc');
                });

                renderRecords();
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        const caseToggle = document.getElementById('caseToggle');
        const regexStatus = document.getElementById('regexStatus');

        const handleSearch = () => {
            const pattern = searchInput.value.trim();
            const flags = caseToggle.checked ? 'i' : '';

            // If pattern is empty, show all records
            if (!pattern) {
                currentRegex = null;
                regexStatus.textContent = '';
                renderRecords();
                return;
            }

            const regex = compileRegex(pattern, flags);
            currentRegex = regex;

            if (!regex) {
                regexStatus.textContent = '⚠️ Invalid regex pattern. Please check syntax.';
                regexStatus.style.color = '#dc2626';
            } else {
                const records = getRecords();
                const matchCount = records.filter(r =>
                    regex.test(r.description) || regex.test(r.category)
                ).length;
                regexStatus.textContent = `✓ Valid pattern - ${matchCount} match(es) found`;
                regexStatus.style.color = '#059669';
            }

            renderRecords();
        };

        searchInput.addEventListener('input', handleSearch);
        caseToggle.addEventListener('change', handleSearch);

        // Settings
        document.getElementById('currencySelect').value = settings.displayCurrency;
        document.getElementById('budget').value = settings.budget;

        document.getElementById('currencySelect').addEventListener('change', (e) => {
            updateSetting('currency', e.target.value);
            renderDashboard();
            renderRecords();
        });

        document.getElementById('budget').addEventListener('input', (e) => {
            updateSetting('cap', parseFloat(e.target.value) || 0);
            renderDashboard();
        });

        // Import
        document.getElementById('importBtn').addEventListener('click', () => {
            const fileInput = document.getElementById('importFile');
            const status = document.getElementById('importStatus');
            const file = fileInput.files[0];
            const records = getRecords();

            status.textContent = '';

            if (!file) {
                status.textContent = 'Please choose a JSON file from your computer.';
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const imported = JSON.parse(reader.result);

                    if (!Array.isArray(imported)) {
                        status.textContent = '❌ Import failed: Ensure that the file contents are JSON arrays.';
                        return;
                    }

                    const isValidStructure = imported.every(validateRecordStructure);

                    if (!isValidStructure) {
                        status.textContent = '❌ Import failed: Data structure is missing some fields (or wrong types).';
                        return;
                    }

                    imported.forEach(record => {
                        record.id = App.State.generateId();
                        record.createdAt = new Date().toISOString();
                        record.updatedAt = new Date().toISOString();
                        records.push(record);
                    });

                    App.Storage.save(records);
                    renderRecords();
                    renderDashboard();
                    status.textContent = `✅ Import success. You have added ${imported.length} records.`;
                    fileInput.value = '';
                } catch (e) {
                    status.textContent = `❌ Invalid format.`;
                }
            };
            reader.readAsText(file);
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            const records = getRecords();
            const dataStr = JSON.stringify(records, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'finance_tracker_export.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Dark Mode Toggle
    function setupDarkMode() {
        const toggleBtn = document.getElementById('darkModeToggle');
        if (!toggleBtn) return;

        const savedTheme = localStorage.getItem('app:theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);

        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('app:theme', newTheme);

            // Update toggle icon
            const icon = toggleBtn.querySelector('.toggle-icon');
            if (icon) {
                icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            }
        });

        // Set initial icon
        const icon = toggleBtn.querySelector('.toggle-icon');
        if (icon) {
            icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    App.UI = { renderDashboard, renderRecords, setupListeners };

    document.addEventListener('DOMContentLoaded', () => {
        setupListeners();
        setupDarkMode();
        renderRecords();
        renderDashboard();
    });

})(window.App);