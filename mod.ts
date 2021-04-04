import {allCalcFunctions, CalcFunc} from "./functions.ts";

export interface Option {
  // CalcFunc list to apply.
  functions?: CalcFunc[];
}

/**
 * Get password strength score from 0 to 100
 * @param pwd password
 * @param option option
 * @return password strength
 */
export default function getPasswordStrength(pwd: string, option?: Option): number {
  if (pwd === "") {
    return 0;
  }

  const pwdWithoutSpace = pwd.replace(/\s/g, '');

  const functions = option?.functions ?? allCalcFunctions;
  const score = functions.reduce((total, calcFunc) => {
    total += calcFunc(pwdWithoutSpace);
    return total;
  }, 0);

  return Math.max(0, Math.min(100, score));
}