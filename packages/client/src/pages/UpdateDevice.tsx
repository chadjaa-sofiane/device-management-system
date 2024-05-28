import { InputField } from "@/components/InputField";
import { Select } from "@/components/Select";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ARCHITECTURES, OPERATING_SYSTEM_NAME } from "@/lib/constants";
import { cn, mapServerErrorsToForm } from "@/lib/utils";
import {
  updateDeviceSchema,
  type UpdateDeviceInputs,
} from "@/services/devices";
import { resetUpdateDevice, updateDeviceAsync } from "@/store/devicesSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { UploadImage } from "./CreateDevice";

const operatingSystemOptions = OPERATING_SYSTEM_NAME.map((operatingSystem) => ({
  label: operatingSystem,
  value: operatingSystem,
}));

const architecturesOptions = ARCHITECTURES.map((architecture) => ({
  label: architecture,
  value: architecture,
}));

const UpdateDevice = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { devices } = useAppSelector((state) => state.devices);
  const { status, errors: createDeviceErrors } = useAppSelector(
    (state) => state.devices.updateDevice,
  );

  const device = useMemo(
    () => devices.find((device) => device._id === id),
    [devices, id],
  );
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateDeviceInputs>({
    resolver: zodResolver(updateDeviceSchema),
  });

  useEffect(() => {
    if (device) {
      reset({
        name: device.name,
        operatingSystem: {
          name: device.operatingSystem.name,
          version: device.operatingSystem.version,
          architecture: device.operatingSystem.architecture,
        },
      } as UpdateDeviceInputs); // Reset form with device data
    }
  }, [device, reset]);

  useEffect(() => {
    if (status === "failed" && createDeviceErrors) {
      mapServerErrorsToForm(setError, createDeviceErrors);
    }
    if (status === "succeeded") {
      navigate("/devices");
      dispatch(resetUpdateDevice());
    }
  }, [createDeviceErrors, status, setError, navigate, dispatch]);

  const submit = (data: UpdateDeviceInputs) => {
    if (id) {
      dispatch(updateDeviceAsync({ id, updateDeviceInputs: data }));
    }
  };
  return (
    <div className="container m-auto flex justify-center items-center h-screen">
      <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg bg-gray-100/20">
        <div>
          <Link to="/devices">
            <FaArrowLeft className="text-2xl" />
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">Update a Device</h1>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <InputField
            {...register("name")}
            label="name"
            status={errors["name"] && "error"}
            message={errors["name"] && errors["name"]?.message}
          />

          <Select
            {...register("operatingSystem.name")}
            label="operating system"
            options={operatingSystemOptions}
            status={errors?.operatingSystem?.name && "error"}
            message={
              errors?.operatingSystem?.name &&
              errors?.operatingSystem?.name?.message
            }
          />
          <Select
            {...register("operatingSystem.architecture")}
            label="architecture"
            options={architecturesOptions}
            status={errors?.operatingSystem?.architecture && "error"}
            message={
              errors?.operatingSystem?.architecture &&
              errors?.operatingSystem?.architecture?.message
            }
          />
          <InputField
            {...register("operatingSystem.version")}
            label="version"
            status={errors?.operatingSystem?.version && "error"}
            message={
              errors?.operatingSystem?.version &&
              errors?.operatingSystem?.version?.message
            }
          />

          {/* <UploadImage register={register} /> */}
          <button
            type="submit"
            className={cn(
              "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200",
              {
                "cursor-not-allowed bg-opacity-50": isSubmitting,
              },
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDevice;
