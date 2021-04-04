import {assertEquals} from "./test_deps.ts";
import getPasswordStrength from "./mod.ts";
import {
  calcConsecutiveLowercase,
  calcConsecutiveNumber,
  calcConsecutiveUppercase,
  calcLettersOnly,
  calcLowercaseLetters,
  calcMiddleNumbersOrSymbols,
  calcNumberOfChars,
  calcNumbers,
  calcNumbersOnly,
  calcRepeatChars,
  calcRequirements,
  calcSequentialLetters,
  calcSequentialNumbers,
  calcSequentialSymbols,
  calcSymbols,
  calcUppercaseLetters
} from "./functions.ts";

// convert '-0' to '0'
const fixMinusZero = (n: number): number => n === 0 ? 0 : n;
const assertEq = (actual: number, expected: number) =>
  assertEquals(fixMinusZero(actual), expected);

Deno.test("calcNumberOfChars", () => {
  const calc = calcNumberOfChars;
  assertEq(calc(""), 0);
  assertEq(calc("14"), 8);
  assertEq(calc("abc"), 12);
});

Deno.test('calcUppercaseLetters', () => {
  const calc = calcUppercaseLetters;
  assertEq(calc(''), 0);
  assertEq(calc('1'), 0);
  assertEq(calc('AB'), 0);
  assertEq(calc('ABa'), 2);
  assertEq(calc('ABCDEaa'), 4);
});

Deno.test('calcLowercaseLetters', function () {
  const calc = calcLowercaseLetters;
  assertEq(calc(''), 0);
  assertEq(calc('1'), 0);
  assertEq(calc('ab'), 0);
  assertEq(calc('ABa'), 4);
  assertEq(calc('ABCDEaa'), 10);
});

Deno.test('calcNumbers', function () {
  const calc = calcNumbers;
  assertEq(calc('12'), 0);
  assertEq(calc('a1'), 4);
  assertEq(calc('A12'), 8);
  assertEq(calc('1ab2cd3'), 12);
});

Deno.test('calcSymbols', function () {
  const calc = calcSymbols;
  assertEq(calc('+'), 6);
  assertEq(calc('Aa1'), 0);
  assertEq(calc('++A++'), 24);
});

Deno.test('calcMiddleNumbersOrSymbols', function () {
  const calc = calcMiddleNumbersOrSymbols;
  assertEq(calc('AbA'), 0);
  assertEq(calc('1234'), 4);
  assertEq(calc('A1@B3C+'), 6);
});

Deno.test('calcRequirements', function () {
  const calc = calcRequirements;
  assertEq(calc('Aa1$'), 0);
  assertEq(calc('AAAbbb123'), 8);
  assertEq(calc('AAbb12()'), 10);
});

Deno.test('calcLettersOnly', function () {
  const calc = calcLettersOnly;
  assertEq(calc('A'), -1);
  assertEq(calc('A1'), 0);
  assertEq(calc('A!'), 0);
  assertEq(calc('AbCdE'), -5);
});

Deno.test('calcNumbersOnly', function () {
  const calc = calcNumbersOnly;
  assertEq(calc('1'), -1);
  assertEq(calc('1A'), 0);
  assertEq(calc('1!'), 0);
  assertEq(calc('12345'), -5);
});

Deno.test('calcRepeatChars', function () {
  const calc = calcRepeatChars;
  assertEq(calc('A'), 0);
  assertEq(calc('AA'), -4);
  assertEq(calc('AAA'), -14);
  assertEq(calc('AAa'), -5);
  assertEq(calc('A1121A'), -7);
  assertEq(calc('aAAAa'), -17);
});

Deno.test('calcConsecutiveUppercase', function () {
  const calc = calcConsecutiveUppercase;
  assertEq(calc('A'), 0);
  assertEq(calc('AB'), -2);
  assertEq(calc('AAB'), -4);
  assertEq(calc('ABCD'), -6);
  assertEq(calc('A1AaB'), 0);
});

Deno.test('calcConsecutiveLowercase', function () {
  const calc = calcConsecutiveLowercase;
  assertEq(calc('a'), 0);
  assertEq(calc('ab'), -2);
  assertEq(calc('aab'), -4);
  assertEq(calc('abcd'), -6);
  assertEq(calc('A1aAb'), 0);
});

Deno.test('calcConsecutiveNumber', function () {
  const calc = calcConsecutiveNumber;
  assertEq(calc('1'), 0);
  assertEq(calc('12'), -2);
  assertEq(calc('123'), -4);
  assertEq(calc('1212'), -6);
  assertEq(calc('1Ab2A'), 0);
});

Deno.test('calcSequentialLetters', function () {
  const calc = calcSequentialLetters;
  assertEq(calc('abc'), -3);
  assertEq(calc('abcd'), -6);
  assertEq(calc('zyx'), -3);
  assertEq(calc('ABCDabc'), -6);
  assertEq(calc('ABCDEF1ABCD'), -12);
});

Deno.test('calcSequentialNumbers', function () {
  const calc = calcSequentialNumbers;
  assertEq(calc('012'), -3);
  assertEq(calc('7890'), -6);
  assertEq(calc('098'), -3);
  assertEq(calc('3210'), -6);
  assertEq(calc('012345A1234'), -12);
});

Deno.test('calcSequentialSymbols', function () {
  const calc = calcSequentialSymbols;
  assertEq(calc('~!@'), -3);
  assertEq(calc('()_+'), -6);
  assertEq(calc('+_)('), -6);
  assertEq(calc('<>?'), -3);
  assertEq(calc('{}|'), -3);
  assertEq(calc('A#$%^B&*()C'), -12);
});

Deno.test("password score", () => {
  const testSet = {
    '': 0,
    'a': 3,
    '1': 3,
    '321': 4,
    '3 2 1': 4,
    'Aa': 10,
    'AA': 0,
    'PassW0rd!': 72,
    ' Pass W0rd! ': 72
  };

  Object.entries(testSet).forEach(e => {
    const [password, score] = e;
    assertEq(getPasswordStrength(password), score);
  });
});
