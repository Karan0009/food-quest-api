import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IntNumberStringOrIntNumber', async: false })
export class IntNumberStringOrIntNumber
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    if (typeof text === 'string') {
      const trimmedText = text.trim();
      const isNanOrFloat = Number(trimmedText) % 1; // if not 0 or NaN then it is either float or have non numerical char in text
      if (isNaN(isNanOrFloat) || isNanOrFloat != 0) return false;
    } else if (typeof text === 'number') {
      const trimmedNumStr = (text as any).toString().trim();
      if (
        trimmedNumStr.length < args.constraints[0] ||
        trimmedNumStr.length > args.constraints[1]
      )
        return false;
      const floatCheckVal = text % 1;
      if (floatCheckVal != 0) return false;
    } else {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid integer number whole length must be between ${args.constraints[0]} and ${args.constraints[1]}`;
  }
}
