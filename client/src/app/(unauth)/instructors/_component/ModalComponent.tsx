const ModalComponent = ({
    closeModal,
    onSelectSort
}: {
    closeModal: () => void;
    onSelectSort: (sortValue: string) => void;
}) => (
    <div className="absolute top-[60%] right-0 mt-2 bg-white rounded-lg shadow-lg w-48 p-4 z-50">
        <ul className="space-y-2">
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
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
                tabIndex={0} // Làm cho phần tử có thể nhận sự kiện bàn phím
                role="button" // Đảm bảo phần tử <li> được nhận diện là button cho accessibility
            >
                Best Selling
            </li>
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
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
                tabIndex={0} // Làm cho phần tử có thể nhận sự kiện bàn phím
                role="button" // Đảm bảo phần tử <li> được nhận diện là button cho accessibility
            >
                Oldest
            </li>
            <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => {
                    onSelectSort('3 days');
                    closeModal();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onSelectSort('3 days');
                        closeModal();
                    }
                }}
                tabIndex={0} // Làm cho phần tử có thể nhận sự kiện bàn phím
                role="button" // Đảm bảo phần tử <li> được nhận diện là button cho accessibility
            >
                3 days
            </li>
        </ul>
    </div>
);

export default ModalComponent;
