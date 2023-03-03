import { Transition } from '@headlessui/react';
import toast, { resolveValue, Toaster, ToastIcon } from 'react-hot-toast';

const toastStyle = {
  success: 'alert-success',
  error: 'alert-error',
  loading: 'alert-info',
  custom: 'alert-warning',
  blank: '',
};

function GlobalToaster() {
  return (
    <Toaster>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className={`flex transform shadow-lg alert ${toastStyle[t.type] || toastStyle['blank']}`}
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div>
            <ToastIcon toast={t} />
            <span>{resolveValue(t.message, t)}</span>
          </div>
          <div className="flex-none">
            <button className="btn btn-sm btn-ghost" onClick={() => toast.dismiss(t.id)}>
              OK
            </button>
          </div>
        </Transition>
      )}
    </Toaster>
  );
}

export default GlobalToaster;
