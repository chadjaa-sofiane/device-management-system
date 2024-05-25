import { Column, Table } from "@/components/Table";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Device } from "@/services/devices";
import { MdModeEdit, MdDelete } from "react-icons/md";

const columns: Column<Device>[] = [
  {
    key: "name",
    label: "name",
  },
  {
    key: "systemId",
    label: "system id",
  },
  {
    key: "operatingSystem",
    label: "operating system",
    render: ({ row }) => (
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <p className="text-sm font-semibold text-gray-700">
          <span className="text-gray-500">Name: </span>
          {row.operatingSystem.name}
        </p>
        <p className="text-sm font-semibold text-gray-700 mt-2">
          <span className="text-gray-500">Version: </span>
          {row.operatingSystem.version}
        </p>
        <p className="text-sm font-semibold text-gray-700 mt-2">
          <span className="text-gray-500">Architecture: </span>
          {row.operatingSystem.architecture}
        </p>
      </div>
    ),
  },
  {
    key: "actions",
    label: (
      <>
        <h1> actions </h1>
      </>
    ),
    render: () => (
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          <MdModeEdit />
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full ml-2">
          <MdDelete />
        </button>
      </div>
    ),
  },
];

const Devices = () => {
  const devices = useAppSelector((state) => state.devices.devices);
  return (
    <div className="container m-auto flex flex-col min-h-screen mt-4">
      <div className="flex-1">
        <Table columns={columns} data={devices} />
      </div>
    </div>
  );
};

export default Devices;
