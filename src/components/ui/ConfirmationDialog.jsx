import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle, HelpCircle } from 'lucide-react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
  icon: Icon = HelpCircle,
  checkboxLabel,
  checkboxChecked,
  onCheckboxChange,
  closeOnOutsideClick = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false} maxWidth="max-w-sm" closeOnOutsideClick={closeOnOutsideClick}>
      <div className="text-center space-y-6">
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center mx-auto
          ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-brand/10 text-brand'}
        `}>
          <Icon size={40} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-main tracking-tight">{title}</h3>
          <p className="text-dim text-sm leading-relaxed px-2">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          {checkboxLabel && (
            <label className="flex items-center justify-center gap-2 text-sm text-dim hover:text-main cursor-pointer mb-2 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded-sm border-(--border-subtle) text-brand focus:ring-brand/30 bg-(--bg-side) cursor-pointer accent-brand"
                checked={checkboxChecked} 
                onChange={(e) => onCheckboxChange && onCheckboxChange(e.target.checked)} 
              />
              {checkboxLabel}
            </label>
          )}
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            onClick={onConfirm}
            loading={loading}
            className="py-4 rounded-[20px] text-base"
          >
            {confirmText}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={loading}
            className="py-4 rounded-[20px] text-dim hover:text-main"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
