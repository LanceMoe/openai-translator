import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Button } from 'react-daisyui';
import toast, { resolveValue, Toaster, ToastIcon } from 'react-hot-toast';

const toastStyle = {
  success: 'alert-success',
  error: 'alert-error',
  loading: 'alert-info',
  custom: 'alert-warning',
  blank: '',
};

export function GlobalToaster() {
  return (
    <Toaster>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className={clsx(
            'alert max-w-screen-lg mx-auto shadow-lg',
            'grid-flow-col grid-cols-[auto_minmax(auto,_1fr)] justify-items-start text-left',
            toastStyle[t.type] || toastStyle['blank'],
          )}
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          <div className="flex-row justify-between w-full gap-2">
            <h4>{resolveValue(t.message, t)}</h4>
          </div>
          <Button size="sm" color="ghost" shape="circle" onClick={() => toast.dismiss(t.id)}>
            ✕
          </Button>
        </Transition>
      )}
    </Toaster>
  );
}
