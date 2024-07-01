export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};
export const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
