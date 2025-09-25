import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

// Phone validation schema
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]{8,20}$/, 'Please enter a valid phone number')
  .optional();

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-\'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods');

// Age validation schema
export const ageSchema = z
  .number()
  .min(18, 'You must be at least 18 years old')
  .max(80, 'Age must be realistic');

// Bio validation schema
export const bioSchema = z
  .string()
  .max(1000, 'Bio must be less than 1000 characters')
  .optional();

// Location validation schema
export const locationSchema = z
  .string()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-\,\.]+$/, 'Location can only contain letters, spaces, hyphens, commas, and periods')
  .optional();

// Profession validation schema
export const professionSchema = z
  .string()
  .min(2, 'Profession must be at least 2 characters')
  .max(100, 'Profession must be less than 100 characters')
  .optional();

// Education validation schema
export const educationSchema = z
  .string()
  .min(2, 'Education must be at least 2 characters')
  .max(200, 'Education must be less than 200 characters')
  .optional();

// Registration form validation schema
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  parentManaged: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  bio: bioSchema,
  profession: professionSchema,
  education: educationSchema,
  city: locationSchema,
  age: ageSchema.optional(),
});

// Sanitization function to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Validate and sanitize text input
export const validateAndSanitize = (input: string, schema: z.ZodString): { isValid: boolean; value?: string; error?: string } => {
  try {
    const sanitized = sanitizeInput(input);
    const validated = schema.parse(sanitized);
    return { isValid: true, value: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid input' };
  }
};