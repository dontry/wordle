
import React, { Fragment } from 'react';
import { Dialog as HSDialog, Transition } from '@headlessui/react';

interface DialogProps {
  title?: string;
  description?: string;
  open: boolean;
  onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ title, description, open = false, onClose, children }) => {
  console.log(title, open);
  return <Transition appear show={open} as={Fragment}>
    <HSDialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={onClose}>
      <div className="min-h-screen px-4 text-center grid content-center items-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-0"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HSDialog.Overlay className="fixed inset-0" />
        </Transition.Child>
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl mx-auto border" style={{ marginTop: '-30rem' }}>
            {title && <HSDialog.Title
              as="h1"
              className="text-lg text-center font-medium leading-6 text-gray-900">
              {title}
            </HSDialog.Title>}
            {description && <HSDialog.Description>{description}</HSDialog.Description>}
          {children}
        </div>
      </div>
    </HSDialog>
  </Transition>
};

export default Dialog;
