import toast from 'react-hot-toast';

function ConfigPage() {
  return (
    <div className="w-full max-w-full p-4 m-0 mb-12">
      <h1 className="mb-2 text-lg">Config</h1>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          toast.success('Under construction!!!');
        }}
      >
        Under construction
      </button>
    </div>
  );
}

export default ConfigPage;
