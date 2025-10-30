const QuestionTab = ({ data, number, handleSelectQuestion }) => {
    return (
        <div
            onClick={() => {
                handleSelectQuestion(number);
            }}
            className="w-full border rounded-md p-3 flex flex-col cursor-pointer gap-2"
        >
            <div className="w-full flex flex-row items-center justify-between">
                <div className="w-5 h-5 bg-gray-200 rounded-sm flex justify-center items-center p-3">
                    <p className="text-xs font-semibold text-gray-500">Q1</p>
                </div>
            </div>
            <p className="text-sm">{data.question}</p>
        </div>
    );
};

export default QuestionTab;
