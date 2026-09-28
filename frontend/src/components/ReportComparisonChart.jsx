import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    ReferenceArea,
} from "recharts";

function ReportComparisonChart({ testName, data }) {
    if (!data || data.length < 2) {
        return null;
    }

    const chartData = data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        }),
        value: item.value,
        reportId: item.report_id,
        status: item.status,
    }));

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;

    const difference = lastValue - firstValue;

    const percentageChange =
        firstValue !== 0
            ? ((difference / firstValue) * 100).toFixed(1)
            : "0.0";

    const latestStatus =
        data[data.length - 1].status || "Unknown";

    const referenceRange =
        data[data.length - 1].reference_range || "";

    // Parse ranges such as "13.0-17.0"
    let referenceMin = null;
    let referenceMax = null;

    const rangeMatch = referenceRange.match(
        /^\s*(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)\s*$/
    );

    if (rangeMatch) {
        referenceMin = Number(rangeMatch[1]);
        referenceMax = Number(rangeMatch[2]);
    }

    const values = data.map((item) => item.value);

    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);

    if (referenceMin !== null) {
        minValue = Math.min(minValue, referenceMin);
        maxValue = Math.max(maxValue, referenceMax);
    }

    const padding =
        maxValue === minValue
            ? Math.max(Math.abs(maxValue) * 0.2, 1)
            : (maxValue - minValue) * 0.18;

    const yMin = Math.max(
        0,
        Math.round((minValue - padding) * 10) / 10
    );

    const yMax =
        Math.round((maxValue + padding) * 10) / 10;

    function getTrendText() {
        if (difference > 0) {
            return `↑ Increased by ${Math.abs(
                difference
            ).toFixed(1)} (${Math.abs(
                Number(percentageChange)
            ).toFixed(1)}%)`;
        }

        if (difference < 0) {
            return `↓ Decreased by ${Math.abs(
                difference
            ).toFixed(1)} (${Math.abs(
                Number(percentageChange)
            ).toFixed(1)}%)`;
        }

        return "→ No change";
    }

    function getStatusClass() {
        switch (latestStatus?.toLowerCase()) {
            case "normal":
                return "status-normal";

            case "high":
                return "status-high";

            case "low":
                return "status-low";

            case "critical":
                return "status-critical";

            case "borderline":
                return "status-borderline";

            default:
                return "status-unknown";
        }
    }

    return (
        <div className="comparison-chart-card">
            {/* Header */}
            <div className="comparison-chart-header">
                <div>
                    <h3>{testName}</h3>

                    <p className="comparison-chart-unit">
                        Unit: {data[0]?.unit || "N/A"}
                    </p>
                </div>

                <span
                    className={`comparison-status ${getStatusClass()}`}
                >
                    {latestStatus}
                </span>
            </div>

            {/* Before / After Summary */}
            <div className="comparison-summary">
                <div className="comparison-value">
                    <span>Before</span>
                    <strong>{firstValue}</strong>
                </div>

                <div className="comparison-arrow">
                    →
                </div>

                <div className="comparison-value">
                    <span>Latest</span>
                    <strong>{lastValue}</strong>
                </div>

                <div className="comparison-change">
                    {getTrendText()}
                </div>
            </div>

            {/* Chart */}
            <div className="comparison-chart-wrapper">
                <ResponsiveContainer
                    width="100%"
                    height={320}
                >
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 25,
                            right: 20,
                            left: 5,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            tick={{
                                fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            domain={[yMin, yMax]}
                            tickCount={5}
                            tickFormatter={(value) =>
                                Number.isInteger(value)
                                    ? value
                                    : value.toFixed(1)
                            }
                            tick={{
                                fontSize: 12,
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        {/* Reference range */}
                        {referenceMin !== null &&
                            referenceMax !== null && (
                                <ReferenceArea
                                    y1={referenceMin}
                                    y2={referenceMax}
                                    fill="#22c55e"
                                    fillOpacity={0.08}
                                    ifOverflow="extendDomain"
                                />
                            )}

                        <Tooltip
                            content={({ active, payload }) => {
                                if (
                                    !active ||
                                    !payload ||
                                    !payload.length
                                ) {
                                    return null;
                                }

                                const item =
                                    payload[0].payload;

                                return (
                                    <div className="chart-tooltip">
                                        <strong>
                                            {item.date}
                                        </strong>

                                        <div>
                                            Value:{" "}
                                            <b>
                                                {item.value}{" "}
                                                {data[0]?.unit}
                                            </b>
                                        </div>

                                        <div>
                                            Status:{" "}
                                            <b>
                                                {item.status}
                                            </b>
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{
                                r: 5,
                                strokeWidth: 2,
                                fill: "#ffffff",
                            }}
                            activeDot={{
                                r: 7,
                            }}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                offset={10}
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    fill: "#111827",
                                }}
                            />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Reference Range */}
            <div className="comparison-reference">
                <span>
                    Reference range:
                </span>

                <strong>
                    {referenceRange || "Not available"}
                </strong>
            </div>
        </div>
    );
}

export default ReportComparisonChart;