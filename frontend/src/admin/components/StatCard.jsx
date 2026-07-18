const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
            {value}
          </h2>
        </div>

        <div
          className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
