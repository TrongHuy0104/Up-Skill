const ModalComponent = ({
    closeModal,
    onSelectSort
}: {
    closeModal: () => void;
    onSelectSort: (sortValue: string) => void;
}) => (
    <div className="absolute top-[60%] right-0 mt-2 bg-white rounded-lg shadow-lg w-40 p-4 z-50">
        <ul className="space-y-2">
            <li>
                <button
                    className="w-full cursor-pointer hover:bg-gray-200 p-2 rounded"
                    onClick={() => {
                        onSelectSort('Best Selling');
                        closeModal();
                    }}
                >
                    Best Selling
                </button>
            </li>
            <li>
                <button
                    className="w-full cursor-pointer hover:bg-gray-200 p-2 rounded"
                    onClick={() => {
                        onSelectSort('Oldest');
                        closeModal();
                    }}
                >
                    Oldest
                </button>
            </li>
            <li>
                <button
                    className="w-full cursor-pointer hover:bg-gray-200 p-2 rounded"
                    onClick={() => {
                        onSelectSort('3 days');
                        closeModal();
                    }}
                >
                    3 days
                </button>
            </li>
        </ul>
    </div>
);

export default ModalComponent;
