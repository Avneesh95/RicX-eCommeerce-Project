const steps = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export default function OrderTimeline({ status }) {
  const current = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-5">
      {steps.map((step, index) => (
        <div
          key={step}
          className="flex flex-col items-center flex-1"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white
            ${
              index <= current
                ? "bg-green-600"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            ✓
          </div>

          <p className="text-xs mt-2 text-center capitalize text-gray-700 dark:text-gray-300">
            {step.replaceAll("_", " ")}
          </p>
        </div>
      ))}
    </div>
  );
}