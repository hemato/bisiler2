import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { FieldValidationState } from '../../utils/validation';

interface FieldValidationIconProps {
  fieldState: FieldValidationState;
  className?: string;
}

export default function FieldValidationIcon({ fieldState, className = '' }: FieldValidationIconProps) {
  // Don't show icon if field hasn't been touched
  if (!fieldState.touched || fieldState.isValid === null) {
    return null;
  }

  const baseClasses = `w-5 h-5 ${className}`;

  if (fieldState.isValid) {
    return (
      <CheckCircle 
        className={`${baseClasses} text-green-600`}
        aria-label="Valid field"
      />
    );
  }

  return (
    <XCircle 
      className={`${baseClasses} text-red-600`}
      aria-label="Invalid field"
    />
  );
}

// Field wrapper component with validation styling and icon
interface ValidatedFieldProps {
  children: React.ReactNode;
  fieldState: FieldValidationState;
  label: string;
  required?: boolean;
  className?: string;
}

export function ValidatedField({ 
  children, 
  fieldState, 
  label, 
  required = false, 
  className = '' 
}: ValidatedFieldProps) {
  console.log('ValidatedField render:', { label, fieldState });
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-secondary-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
        
        {/* Validation icon positioned inside the input */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FieldValidationIcon fieldState={fieldState} />
        </div>
      </div>
      
      {/* Error message */}
      {fieldState.touched && fieldState.error && (
        <p 
          className="text-sm text-red-600 mt-1 animate-fadeIn"
          role="alert"
          aria-live="polite"
        >
          {fieldState.error}
        </p>
      )}
    </div>
  );
}
