const useLocalStorage = (
  key: string,
  type: 'set' | 'get' | 'delete'
  // eslint-disable-next-line @typescript-eslint/ban-types
): string | Function => {
  if (type === 'get') {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : '';
  } else if (type === 'set') {
    const setValue = (newValue: string | boolean) => {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    };
    return setValue;
  } else {
    const deleteValue = () => {
      window.localStorage.removeItem(key);
    };
    return deleteValue;
  }
};
export default useLocalStorage;

/* const useLocalStorage = (key, type) => {
  try {
    if (type === 'get') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : '';
    } else if (type === 'set') {
      const setValue = (newValue) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      };
      return [setValue];
    } else {
      const deleteValue = () => {
        window.localStorage.removeItem(key);
      };
      return [deleteValue];
    }
  } catch (error) {
    console.log(error);
  }
};
export default useLocalStorage;
 */
