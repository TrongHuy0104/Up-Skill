// components/ui/ModalComponent.tsx
const ModalComponent = ({
    closeModal,
    onSelectSort
}: {
    closeModal: () => void;
    onSelectSort: (sortValue: string) => void;
}) => (
    <div className="absolute top-[1%] right-0 mt-2 bg-white rounded-lg shadow-lg w-48 p-4 z-50">
        <ul className="space-y-2">
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => {
                    onSelectSort('Best Selling');
                    closeModal();
                }}
            >
                Best Selling
            </li>
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => {
                    onSelectSort('Oldest');
                    closeModal();
                }}
            >
                Oldest
            </li>
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => {
                    onSelectSort('3 days');
                    closeModal();
                }}
            >
                3 days
            </li>
        </ul>
    </div>
);

export default ModalComponent;
