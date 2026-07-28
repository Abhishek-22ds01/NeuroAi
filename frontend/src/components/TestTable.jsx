function TestTable({ tests }) {
  return (
    <div className="card">

      <h2>Test Results</h2>

      <table>

        <thead>

          <tr>
            <th>Test</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Reference</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {tests?.map((test, index) => (
            <tr key={index}>

              <td>{test.name}</td>

              <td>{test.value}</td>

              <td>{test.unit}</td>

              <td>{test.reference_range}</td>

              <td
                className={
                  test.status === "High"
                    ? "high"
                    : test.status === "Low"
                    ? "low"
                    : "normal"
                }
              >
                {test.status}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TestTable;