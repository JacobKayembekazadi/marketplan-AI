"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextInput = ({ value, onChange, placeholder }: InputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if(localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <Input
      value={localValue || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="bg-input"
    />
  );
};

export const TextAreaInput = ({ value, onChange, placeholder }: InputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };
  
  return (
    <Textarea
      value={localValue || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="min-h-[120px] bg-input"
    />
  );
};
