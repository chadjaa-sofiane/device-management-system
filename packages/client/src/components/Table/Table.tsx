import { useMemo } from "react";

export type Columns = {
  key: string;
  label: React.ReactNode;
}[];

interface TableProps {
  columns: Columns;
  data: Record<string, string | React.ReactNode>[];
}

const Table = ({ columns, data }: TableProps) => {
  const Row = useMemo(() => createRow(columns), [columns]);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((item, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <Row key={index} rowData={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface RowProps {
  rowData: Record<string, string | React.ReactNode>;
}

const createRow =
  (columns: Columns) =>
  ({ rowData }: RowProps) => {
    return (
      <tr>
        {columns.map((item, index) => (
          <td
            key={index}
            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
          >
            {rowData[item.key]}
          </td>
        ))}
      </tr>
    );
  };

export default Table;
