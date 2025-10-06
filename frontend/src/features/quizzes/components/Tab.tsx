const Tab = ({ icon, color, title, questions, level, isFavourite, progress }) => {
    return (
        <div className="w-full flex flex-col p-5 bg-white rounded-md border h-20 shadow">
            <div className="w full flex flex-row justify-between items-center">
                <div className="flex flex-row gap-3 items-center">
                    <div
                        className="w-10 h-10 rounded-full flex justify-center items-center"
                        style={{ backgroundColor: color, color: "white" }}
                    >
                        {icon}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-sm text-gray-500">{questions} Questions</p>
                </div>
            </div>
        </div>
    );
};

export default Tab;
