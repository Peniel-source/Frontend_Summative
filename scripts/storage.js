// THe storage.js handles localStorage on the browser
window.App = window.App || {};

(function(App) {
    const KEY = 'finance:data';

    const load = () => {
        const stored = localStorage.getItem(KEY);
        if (stored) {
            try {
                return JSON.parse(stored) || [];
            } catch {
                console.error("Failed to parse stored JSON.");
                return [];
            }
        } else {
            return [];
        }
    };

    const save = (data) => {
        localStorage.setItem(KEY, JSON.stringify(data));
    };

    App.Storage = { load, save };
})(window.App);
