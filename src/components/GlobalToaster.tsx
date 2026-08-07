import { Transition } from '@headlessui/react';
import toast, { resolveValue, Toaster, ToastIcon } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

const toastStyle = {
  success: 'alert-success',
  error: 'alert-error',
  loading: 'alert-info',
  custom: 'alert-warning',
  blank: '',
};

export default function GlobalToaster() {
  return (
    <Toaster>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div
            className={twMerge(
              'alert max-w-sm mx-auto shadow-lg',
              'grid-flow-col grid-cols-[auto_minmax(auto,_1fr)] justify-items-start text-left',
              toastStyle[t.type] || toastStyle['blank'],
            )}
          >
            <ToastIcon toast={t} />
            <div className="flex-row justify-between w-full gap-2">
              <h4>{resolveValue(t.message, t)}</h4>
            </div>
            <button type="button" className="btn btn-circle btn-sm btn-ghost" onClick={() => toast.dismiss(t.id)}>
              ✕
            </button>
          </div>
        </Transition>
      )}
    </Toaster>
  );
}
