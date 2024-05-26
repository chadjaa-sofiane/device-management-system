import { Pagination } from "@/components/Pagination";
import { Column, Table } from "@/components/Table";
import { useAppSelector } from "@/hooks/reduxHooks";
import { cn } from "@/lib/utils";
import { Device } from "@/services/devices";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/Dialog";
import { MdDelete, MdModeEdit } from "react-icons/md";

const Devices = () => {
  const { devices, totalCount } = useAppSelector((state) => state.devices);
  const [page, setPage] = useState(1);

  return (
    <div className="container m-auto flex flex-col min-h-screen mt-4">
      <div className="border border-[#E2E8F0] rounded-lg mt-32 p-4">
        <Table columns={columns} data={devices} />
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={Math.ceil(totalCount / 10)}
          />
        </div>
      </div>
    </div>
  );
};

const columns: Column<Device>[] = [
  {
    key: "pictureUrl",
    label: "picture",
    render: ({ row }) => (
      <img
        src={row.pictureUrl || "https://picsum.photos/200/300"}
        alt={row.name || "picture"}
        className="w-24 h-24 object-cover"
      />
    ),
  },
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
      <div
        className={cn("bg-gray-50 p-4 rounded-lg shadow-sm bg-opacity-50", {
          "border border-red-200": row.operatingSystem.name === "macOS",
          "ring-1 ring-blue-200": row.operatingSystem.name === "windows",
          "ring-1 ring-green-200": row.operatingSystem.name === "linux",
        })}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-semibold text-gray-900">
            {row.operatingSystem.name}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-500">
              Version:
            </span>
            <span className="text-sm font-medium text-gray-700">
              {row.operatingSystem.version}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            <span className="text-gray-500">Architecture:</span>{" "}
            {row.operatingSystem.architecture}
          </p>
        </div>
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
    render: ({ row }) => {
      console.log("row", row);
      return (
        <div className="flex items-center">
          <button
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-2 transition-colors duration-200"
            // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <MdModeEdit className="w-4 h-4" />
          </button>
          <DeleteDialog row={row} />
        </div>
      );
    },
  },
];

interface DeleteDialogProps {
  row: Device;
}

const DeleteDialog = ({ row }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleOk = () => {
    // Add delete logic here
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg ml-2 transition-colors duration-200"
      >
        <MdDelete className="w-4 h-4" />
      </button>
      <Dialog open={open}>
        <DialogContent className="p-6 flex flex-col gap-y-6">
          <p className="text-lg font-semibold">
            Are you sure you want to delete this device?
          </p>
          <p className="text-md">
            Device name: <span className="font-bold">{row.name}</span>
          </p>
          <div className="flex justify-end gap-x-4">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              onClick={handleOk}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Devices;
