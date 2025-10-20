import { cn } from "@/lib/utils";

const QuickStats = ({ data }) => {
    return (
        <div className="bg-white border w-1/3 rounded-md p-5">
            <p className="text-md font-semibold mb-5">Quick stats</p>
            <div className="w-full flex flex-col gap-3">
                {data.map((item) => (
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center  text-center gap-3">
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-md text-sm flex items-center justify-center text-violet-500 bg-violet-100",
                                    item.bgColor && item.textColor && `${item.bgColor} ${item.textColor}`
                                )}
                            >
                                {item.icon}
                            </div>
                            <p>{item.title}</p>
                        </div>
                        <div className="font-semibold">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickStats;
