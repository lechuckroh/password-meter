# password-meter

Password strength calculator written in TypeScript.

Scoring rule is based on [The Password Meter](http://www.passwordmeter.com).

Password strength value is from 0 to 100.

## Usage

```ts
import getPasswordStrength from "https://deno.land/x/password_meter/mod.ts";

const strength = getPasswordStrength('Password');
console.log(`'Password' strength is ${strength}`);

// 'Password' strength is 26 
```

To add custom calculators:

```ts
import getPasswordStrength from "https://deno.land/x/password_meter/mod.ts";
import {allCalcFunctions} from "https://deno.land/x/password_meter/functions.ts";

const myCalc = (s: string): number => s.length;
const strength = getPasswordStrength('Password', {
  functions: [
    ...allCalcFunctions,
    myCalc,
  ],
});
console.log(`'Password' strength is ${strength}`);
```