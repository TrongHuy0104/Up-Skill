const ModalComponent = ({
    closeModal,
    onSelectSort
}: {
    closeModal: () => void;
    onSelectSort: (sortValue: string) => void;
}) => (
    <div className="absolute top-[60%] right-0 mt-2 bg-white rounded-lg shadow-lg w-48 p-4 z-50">
        <ul className="space-y-2">
            <li>
                <button
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded w-full text-left"
                    onClick={() => {
                        onSelectSort('Best Selling');
                        closeModal();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onSelectSort('Best Selling');
                            closeModal();
                        }
                    }}
                >
                    Best Selling
                </button>
            </li>
            <li>
                <button
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded w-full text-left"
                    onClick={() => {
                        onSelectSort('Oldest');
                        closeModal();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onSelectSort('Oldest');
                            closeModal();
                        }
                    }}
                >
                    Oldest
                </button>
            </li>
            <li>
                <button
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded w-full text-left"
                    onClick={() => {
                        onSelectSort('3 Days');
                        closeModal();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onSelectSort('3 Days');
                            closeModal();
                        }
                    }}
                >
                    3 Days
                </button>
            </li>
        </ul>
    </div>
);

export default ModalComponent;
