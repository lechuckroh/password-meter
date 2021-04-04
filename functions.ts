const alphaRe = /[a-zA-Z]/;
const uppercaseRe = /[A-Z]/;
const lowercaseRe = /[a-z]/;
const numericRe = /[0-9]/;
const symbolRe = /[^a-zA-Z0-9]/;
const numericSymbolRe = /[^a-zA-Z]/;

const charList = (s: string): string[] => s.split('');
const isAlpha = (ch: string): boolean => alphaRe.test(ch);
const isUppercase = (ch: string): boolean => uppercaseRe.test(ch);
const isLowercase = (ch: string): boolean => lowercaseRe.test(ch);
const isNumeric = (ch: string): boolean => numericRe.test(ch);
const isSymbol = (ch: string): boolean => symbolRe.test(ch);
const isNumericSymbol = (ch: string): boolean => numericSymbolRe.test(ch);

const numberSeq = '01234567890';
const alphaSeq = 'abcdefghijklmnopqrstuvwxyz';
const symbolSeq = '~!@#$%^&*()_+{}|<>?,./';

export type CalcFunc = (pwd: string) => number;

export function calcNumberOfChars(pwd: string): number {
  return pwd.length * 4;
}

/**
 * Check count of uppercase character.
 * non-uppercase character required to get score.
 */
export function calcUppercaseLetters(pwd: string): number {
  const count = charList(pwd).reduce((count, ch) => {
    return isUppercase(ch) ? count + 1 : count;
  }, 0);
  const length = pwd.length;
  return (count && count < length) ? (length - count) * 2 : 0;
}

/**
 * Check count of lowercase character.
 * non-lowercase character required to get score.
 */
export function calcLowercaseLetters(pwd: string): number {
  const count = charList(pwd).reduce((count, ch) => {
    return isLowercase(ch) ? count + 1 : count;
  }, 0);
  const length = pwd.length;
  return (count && count < length) ? (length - count) * 2 : 0;
}

/**
 * Check count of numbers.
 * non-numeric character required to get score.
 */
export function calcNumbers(pwd: string): number {
  const count = charList(pwd).reduce((count, ch) => {
    return isNumeric(ch) ? count + 1 : count;
  }, 0);
  const length = pwd.length;
  return (count < length) ? count * 4 : 0;
}

/** Check count of symbols. */
export function calcSymbols(pwd: string): number {
  const count = charList(pwd).reduce((count, ch) => {
    return isSymbol(ch) ? count + 1 : count;
  }, 0);
  return count * 6;
}

/** Check count of numbers & symbols in the middle of string */
export function calcMiddleNumbersOrSymbols(pwd: string): number {
  const list = charList(pwd).slice(1, pwd.length - 1);
  const count = list.reduce((count, ch) => {
    return isNumericSymbol(ch) ? count + 1 : count;
  }, 0);
  return count * 2;
}

/**
 * Check minimum requirements.
 * * Minimum 8 characters in length
 * * Contains 3/4 of the following items:
 *   - Uppercase Letters
 *   - Lowercase Letters
 *   - Numbers
 *   - Symbols
 */
export function calcRequirements(pwd: string): number {
  let hasLowerCase = false;
  let hasUpperCase = false;
  let hasNumber = false;
  let hasSymbol = false;
  charList(pwd).forEach(ch => {
    if (isLowercase(ch)) {
      hasLowerCase = true;
    } else if (isUppercase(ch)) {
      hasUpperCase = true;
    } else if (isNumeric(ch)) {
      hasNumber = true;
    } else {
      hasSymbol = true;
    }
  });

  const req1 = (pwd.length >= 8) ? 1 : 0;
  const req2a = hasLowerCase ? 1 : 0;
  const req2b = hasUpperCase ? 1 : 0;
  const req2c = hasNumber ? 1 : 0;
  const req2d = hasSymbol ? 1 : 0;

  const req2sum = req2a + req2b + req2c + req2d;
  if (req1 && (req2sum >= 3)) {
    return (req1 + req2sum) * 2;
  } else {
    return 0;
  }
}

/** Check if every character is a letter */
export function calcLettersOnly(pwd: string): number {
  return charList(pwd).every(ch => isAlpha(ch)) ? -pwd.length : 0;
}

/** Check if every character is numeric */
export function calcNumbersOnly(pwd: string): number {
  return charList(pwd).every(ch => isNumeric(ch)) ? -pwd.length : 0;
}

/**
 * Calculate deduction based on proximity to identical characters
 * Deduction is incremented each time a new match is discovered
 * Deduction amount is based on total password length divided by the
 * difference of distance between currently selected match
 */
export function calcRepeatChars(pwd: string): number {
  const list = charList(pwd);
  const length = pwd.length;

  let repeatedCharCount = 0;
  const score = list.reduce((total, c1, i1) => {
    let inc = 0;

    list.forEach((c2, i2) => {
      if (i1 !== i2 && c1 === c2) {
        inc += Math.abs(length / (i2 - i1));
      }
    });

    if (inc > 0) {
      repeatedCharCount++;
      const uniqueCharCount = length - repeatedCharCount;
      total = uniqueCharCount ?
        Math.ceil((total + inc) / uniqueCharCount) :
        Math.ceil(total + inc);
    }

    return total;
  }, 0);

  return -score;
}

/** Check for consecutive uppercase character */
export function calcConsecutiveUppercase(pwd: string): number {
  const count = getConsecutiveCount(pwd, isUppercase);
  return -count * 2;
}

/** Check for consecutive lowercase character */
export function calcConsecutiveLowercase(pwd: string): number {
  const count = getConsecutiveCount(pwd, isLowercase);
  return -count * 2;
}

/** Check for consecutive numeric character */
export function calcConsecutiveNumber(pwd: string): number {
  const count = getConsecutiveCount(pwd, isNumeric);
  return -count * 2;
}

function getConsecutiveCount(pwd: string, fn: (s: string) => boolean): number {
  const list = charList(pwd);
  const length = list.length;
  return list.reduce((count, ch, idx, arr) => {
    if (idx < length - 1) {
      if (fn(ch) && fn(arr[idx + 1])) {
        count++;
      }
    }
    return count;
  }, 0);
}


/** Check for sequential alpha string pattern (forward and backward) */
export function calcSequentialLetters(pwd: string): number {
  const count = getSequentialCount(pwd.toLowerCase(), alphaSeq);
  return -count * 3;
}

/** Check for sequential numeric string pattern (forward and backward) */
export function calcSequentialNumbers(pwd: string): number {
  const count = getSequentialCount(pwd, numberSeq);
  return -count * 3;
}

/** Check for sequential symbol string pattern (forward and backward) */
export function calcSequentialSymbols(pwd: string): number {
  const count = getSequentialCount(pwd, symbolSeq);
  return -count * 3;
}

function getSequentialCount(str: string, seqStr: string): number {
  let count = 0;
  const maxIdx = seqStr.length - 3;
  for (let i = 0; i <= maxIdx; i++) {
    const fwd = seqStr.substring(i, i + 3);
    const bwd = fwd.split('').reverse().join('');
    if (str.includes(fwd) || str.includes(bwd)) {
      count++;
    }
  }
  return count;
}

export const allCalcFunctions: CalcFunc[] = [
  calcNumberOfChars,
  calcUppercaseLetters,
  calcLowercaseLetters,
  calcNumbers,
  calcSymbols,
  calcMiddleNumbersOrSymbols,
  calcRequirements,
  calcLettersOnly,
  calcNumbersOnly,
  calcRepeatChars,
  calcConsecutiveUppercase,
  calcConsecutiveLowercase,
  calcConsecutiveNumber,
  calcSequentialLetters,
  calcSequentialNumbers,
  calcSequentialSymbols,
];
