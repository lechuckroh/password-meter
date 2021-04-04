import {allCalcFunctions} from "./functions.ts";

/**
 * Get password strength score from 0 to 100
 * @param pwd password
 * @return password strength
 */
export default function getPasswordStrength(pwd: string): number {
  if (pwd === "") {
    return 0;
  }

  const pwdWithoutSpace = pwd.replace(/\s/g, '');
  const score = allCalcFunctions.reduce((total, calcFunc) => {
    total += calcFunc(pwdWithoutSpace);
    return total;
  }, 0);

  return Math.max(0, Math.min(100, score));
}