/**
 * Capitalize the first letter of a whole string or each word in a string
 *
 * @param {string} str The string to capitalize
 * @param {boolean} [all=false] If true, capitalize the first letter of each word
 * @param {string} [separator=' '] The separator to split the string by
 * @return {*}  {string}
 */
export const capitalizeFirstLetter = (
  str?: string,
  all: boolean = false,
  separator: string = ' '
): string => {
  if (!str) return '';
  if (all) {
    return str
      .split(separator)
      .map((word) => capitalizeFirstLetter(word))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const joinStrings = (strings: string[], separator = ' '): string => {
  return strings.join(separator);
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

export const removeFromPosition = <T extends number | string | undefined>(
  value: T,
  position: number
): T => {
  const currentValue = value?.toString();

  if (currentValue === undefined) return value as T;

  if (position < 0 || position >= currentValue.length) return value;

  const finalValue =
    currentValue.slice(0, position) + currentValue.slice(position + 1);

  return (
    typeof value === 'string'
      ? finalValue
      : finalValue !== ''
      ? Number(finalValue)
      : undefined
  ) as T;
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

export const parseStringToNumber = (input: string): number | undefined => {
  // Attempt to parse the input string into a number
  const parsedNumber = parseFloat(input);

  // Check if the parsed number is NaN (not a number)
  if (isNaN(parsedNumber)) {
    return undefined; // Return undefined if input is not a valid number
  } else {
    return parsedNumber; // Return the parsed number if input is a valid number
  }
};

export const nameFromEmail = (email: string): string =>
  email.split('@')[0] ?? '';

export const estimateReadingTime = (content: string): number => {
  // Average reading speed in words per minute (WPM)
  const averageReadingSpeed = 200;

  // Remove HTML tags and convert entities to readable characters
  const cleanContent = content.replace(/<[^>]+>/g, '').replace(/&\w+;/g, '');

  // Split the content into words
  const words = cleanContent.split(/\s+/);

  // Calculate the reading time in minutes
  const readingTime = Math.ceil(words.length / averageReadingSpeed);

  return readingTime;
};

export const getFormattedDate = (date?: Date | string | number): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRidOfWhiteSpace = (str: string): string => {
  return str.replace(/<p[^>]*>(\s|&nbsp;|<br[^>]*>)*<\/p>/g, '');
};

export const whenDidItHappen = (date: Date | string | number): string => {
  const currentDate = new Date();
  const eventDate = new Date(date);

  const timeDifference = currentDate.getTime() - eventDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return getFormattedDate(date);
  } else if (months > 0) {
    return `${months > 1 ? months : 'a'} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks > 1 ? weeks : 'a'} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days > 1 ? days : 'a'} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours > 1 ? hours : 'an'} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes > 1 ? minutes : 'a'} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
};

export const isSameInnerHtml = (html1: string, html2: string): boolean => {
  // get rid of all props of html tags
  const cleanHtml1 = html1.replace(/<[^>]+>/g, '');
  const cleanHtml2 = html2.replace(/<[^>]+>/g, '');

  return cleanHtml1 === cleanHtml2;
};
