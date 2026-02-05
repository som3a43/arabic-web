import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface DeleteConfirmDialogProps {
  open: boolean;
  sectionName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  sectionName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg p-6 shadow-2xl">
        <h3
          className="mb-4 text-lg font-semibold text-center"
          style={{ color: 'var(--text-dark)' }}
        >
          تأكيد الحذف
        </h3>
        
        <p className="mb-6 text-center" style={{ color: 'var(--text-medium)' }}>
          هل أنت متأكد من رغبتك في حذف القسم <strong>"{sectionName}"</strong>؟
        </p>
        
        <div className="flex gap-3 justify-center">
          <PrimaryButton
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'جاري الحذف...' : 'حذف'}
          </PrimaryButton>
          <SecondaryButton onClick={onCancel} disabled={isLoading}>
            إلغاء الأمر
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
