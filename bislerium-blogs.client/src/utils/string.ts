/**
 * Capitalize the first letter of a whole string or each word in a string
 *
 * @param {string} str The string to capitalize
 * @param {boolean} [all=false] If true, capitalize the first letter of each word
 * @param {string} [separator=' '] The separator to split the string by
 * @return {*}  {string}
 */
export const capitalizeFirstLetter = (
  str: string,
  all: boolean = false,
  separator: string = ' '
): string => {
  if (all) {
    return str
      .split(separator)
      .map((word) => capitalizeFirstLetter(word))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const seekValue = <T extends number | string>(
  value: T,
  position: number
): T | undefined => {
  const valueStr = value.toString();

  if (position >= 0 && position < valueStr.length) {
    const seekedValue = valueStr.charAt(position);
    return (typeof value === 'string' ? seekedValue : Number(seekedValue)) as T;
  } else {
    return undefined;
  }
};

export const removeFromPosition = <T extends number | string>(
  value: T,
  position: number
): T => {
  const currentValue = value.toString();

  if (position < 0 || position > currentValue.length) return value;

  const finalValue =
    currentValue.slice(0, position) + currentValue.slice(position + 1);

  return (typeof value === 'string' ? finalValue : Number(finalValue)) as T;
};

export const addToPosition = <T extends number | string>(
  value: T,
  position: number,
  toAdd: T
): T => {
  const currentValue = value.toString();
  if (position < 0 || position > currentValue.length) return value;
  const finalValue =
    currentValue.slice(0, position) +
    toAdd.toString() +
    currentValue.slice(position);
  return (typeof value === 'string'
    ? finalValue
    : Number(finalValue)) as unknown as T;
};
