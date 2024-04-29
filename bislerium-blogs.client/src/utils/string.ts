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
