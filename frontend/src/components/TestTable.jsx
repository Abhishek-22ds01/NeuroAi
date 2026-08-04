function TestTable({ tests }) {

    if (!tests || tests.length === 0) {
        return null;
    }

    return (

        <div className="card">

            <h2>📊 Test Results</h2>

            <div className="table-container">

                <table className="modern-table">

                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Unit</th>
                            <th>Normal Range</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {tests.map((test, index) => (

                            <tr key={index}>

                                <td>{test.name}</td>

                                <td>{test.value}</td>

                                <td>{test.unit}</td>

                                <td>{test.reference_range}</td>

                                <td>

                                    <span
                                        className={
                                            test.status === "Normal"
                                                ? "badge-normal"
                                                : "badge-abnormal"
                                        }
                                    >
                                        {test.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default TestTable;