const useSessionStorage = (key: string, type: 'set' | 'get' | 'delete') => {
  try {
    if (type === 'get') {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue: string | boolean) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      };
      return setValue;
    } else {
      const deleteValue = () => {
        window.sessionStorage.removeItem(key);
      };
      return deleteValue;
    }
  } catch (error) {
    console.log(error);
  }
};
export default useSessionStorage;

/* const useSessionStorage = (key, type) => {
  try {
    if (type === 'get') {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.sessionStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.log(error);
  }
};
export default useSessionStorage;
 */
