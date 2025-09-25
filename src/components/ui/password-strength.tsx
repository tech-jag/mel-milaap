import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'One special character (@$!%*?&)',
    test: (password) => /[@$!%*?&]/.test(password)
  }
];

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const passedRules = passwordRules.filter(rule => rule.test(password));
  const strength = (passedRules.length / passwordRules.length) * 100;
  
  const getStrengthLabel = () => {
    if (strength === 0) return 'Enter a password';
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-destructive';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={`font-medium ${
            strength < 40 ? 'text-destructive' : 
            strength < 80 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        
        <Progress 
          value={strength} 
          className="h-2"
        />
        
        <div className="space-y-1">
          {passwordRules.map((rule) => {
            const passed = rule.test(password);
            return (
              <div key={rule.id} className="flex items-center space-x-2 text-xs">
                {passed ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-muted-foreground" />
                )}
                <span className={passed ? 'text-green-600' : 'text-muted-foreground'}>
                  {rule.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}