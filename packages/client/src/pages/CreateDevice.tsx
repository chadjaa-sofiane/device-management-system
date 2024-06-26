import { InputField } from "@/components/InputField";
import { Select } from "@/components/Select";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ARCHITECTURES, OPERATING_SYSTEM_NAME } from "@/lib/constants";
import { cn, mapServerErrorsToForm } from "@/lib/utils";
import {
  createDeviceSchema,
  type CreateDeviceInputs,
} from "@/services/devices";
import { createDeviceAsync, resetCreateDevice } from "@/store/devicesSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  FieldValues,
  Path,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const architecturesOptions = ARCHITECTURES.map((architecture) => ({
  label: architecture,
  value: architecture,
}));

const operatingSystemOptions = OPERATING_SYSTEM_NAME.map((operatingSystem) => ({
  label: operatingSystem,
  value: operatingSystem,
}));

const CreateDevice = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, errors: createDeviceErrors } = useAppSelector(
    (state) => state.devices.createDevice,
  );
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields },
  } = useForm<CreateDeviceInputs>({
    resolver: zodResolver(createDeviceSchema),
  });

  const submit = (data: CreateDeviceInputs) => {
    dispatch(createDeviceAsync(data));
  };

  useEffect(() => {
    if (status === "failed" && createDeviceErrors) {
      mapServerErrorsToForm(setError, createDeviceErrors);
    }
    if (status === "succeeded") {
      navigate("/devices");
      dispatch(resetCreateDevice());
    }
  }, [createDeviceErrors, status, setError, navigate, dispatch]);

  return (
    <div className="container m-auto flex justify-center items-center h-screen">
      <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg bg-gray-100/20">
        <div>
          <Link to="/devices">
            <FaArrowLeft className="text-2xl" />
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">Create a Device</h1>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <InputField
            {...register("systemId")}
            label="system Id"
            status={
              errors["systemId"]
                ? "error"
                : touchedFields["systemId"]
                  ? "done"
                  : "normal"
            }
            message={errors["systemId"] ? errors["systemId"]?.message : ""}
          />
          <InputField
            {...register("name")}
            label="name"
            status={
              errors["name"]
                ? "error"
                : touchedFields["name"]
                  ? "done"
                  : "normal"
            }
            message={errors["name"] ? errors["name"]?.message : ""}
          />

          <Select
            {...register("operatingSystem.name")}
            label="operating system"
            options={operatingSystemOptions}
            status={
              errors.operatingSystem?.name
                ? "error"
                : touchedFields.operatingSystem?.name
                  ? "done"
                  : "normal"
            }
            message={
              errors.operatingSystem?.name
                ? errors.operatingSystem?.name?.message
                : ""
            }
          />
          <Select
            {...register("operatingSystem.architecture")}
            label="architecture"
            options={architecturesOptions}
            status={
              errors.operatingSystem?.architecture
                ? "error"
                : touchedFields.operatingSystem?.architecture
                  ? "done"
                  : "normal"
            }
            message={
              errors.operatingSystem?.architecture
                ? errors.operatingSystem?.architecture?.message
                : ""
            }
          />
          <InputField
            {...register("operatingSystem.version")}
            label="version"
            status={
              errors.operatingSystem?.version
                ? "error"
                : touchedFields.operatingSystem?.version
                  ? "done"
                  : "normal"
            }
            message={
              errors.operatingSystem?.version
                ? errors.operatingSystem?.version?.message
                : ""
            }
          />

          <UploadImage register={register} />
          <button
            type="submit"
            className={cn(
              "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200",
              {
                "cursor-not-allowed bg-opacity-50": status === "loading",
              },
            )}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

interface UploadImageProps<T extends FieldValues> {
  register: UseFormRegister<T>;
}

export const UploadImage = <T extends FieldValues>({
  register,
}: UploadImageProps<T>) => {
  const [preview, setPreview] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPreview(reader.result as string);
    };
  };

  return (
    <div className="relative">
      <input
        {...register("picture" as unknown as Path<T>)}
        id="upload"
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={handleChange}
      />
      <div className="w-40 h-40 border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
        <label
          htmlFor="upload"
          className="w-full h-full grid place-items-center ml-2 text-blue-500 cursor-pointer hover:underline"
        >
          {preview ? <img src={preview} alt="device" /> : "Upload Image"}
        </label>
      </div>
    </div>
  );
};

export default CreateDevice;
