import { isValidElement } from "react";

export type Column<T extends Record<string, unknown>> = {
  key: string;
  label: React.ReactNode;
  render?: ({ row }: { row: T }) => React.ReactNode;
};

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
}: TableProps<T>) => {
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
            <Row columns={columns} key={index} rowData={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const isRenderable = (element: unknown): element is React.ReactNode => {
  if (
    typeof element === "string" ||
    typeof element === "number" ||
    typeof element === "boolean" ||
    typeof element === "undefined" ||
    element === null ||
    isValidElement(element)
  ) {
    return true;
  }
  if (Array.isArray(element)) {
    return element.every(isRenderable);
  }

  return false;
};

interface RowProps<T extends Record<string, unknown>> {
  rowData: T;
  columns: Column<T>[];
}

const Row = <T extends Record<string, unknown>>({
  rowData,
  columns,
}: RowProps<T>) => {
  return (
    <tr>
      {columns.map((item, index) => (
        <RowCell key={index} data={rowData} item={item} />
      ))}
    </tr>
  );
};

const RowCell = <T extends Record<string, unknown>>({
  data,
  item,
}: {
  data: T;
  item: Column<T>;
}) => {
  const cellValue = data[item.key];

  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {item.render
        ? item.render({ row: data })
        : isRenderable(cellValue)
          ? cellValue
          : "N/A"}
    </td>
  );
};

export default Table;
