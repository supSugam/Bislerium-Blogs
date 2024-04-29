export const cleanObject = <T>(
  obj: T,
  { includeNull = false, includeUndefined = false } = {
    includeNull: false,
    includeUndefined: false,
  }
): T => {
  const cleanedObj = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        cleanedObj[key] = value;
      } else if (includeNull && value === null) {
        cleanedObj[key] = value;
      } else if (includeUndefined && value === undefined) {
        cleanedObj[key] = value;
      }
    }
  }
  return cleanedObj;
};

export const objectToFormData = (obj: any): FormData => {
  if (!(obj instanceof Object)) throw new Error('Invalid object');
  const formData = new FormData();
  const cleanedObj = cleanObject(obj);

  for (const key in cleanedObj) {
    if (Object.prototype.hasOwnProperty.call(cleanedObj, key)) {
      console.log(key);
      const value = cleanedObj[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value instanceof Array) {
        value.forEach((element: any, i) => {
          formData.append(`${key}[${i}]`, element);
        });
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
};
