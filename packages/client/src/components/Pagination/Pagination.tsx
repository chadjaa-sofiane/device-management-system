import { cn, createSequentialArray } from "@/lib/utils";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  className?: string;
  currentPage: number;
  onPageChange?: (page: number) => void;
  totalPages: number;
}

const Pagination = ({
  className,
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };
  const createPages = () => {
    const startPage = Math.max(currentPage - 1, 1);
    const endPage = Math.min(currentPage + 1, totalPages);
    const pages = createSequentialArray(
      startPage,
      Math.max(endPage, Math.min(startPage + 2, totalPages)),
    );
    return pages;
  };

  return (
    <div className={cn("flex w-fit px-4 py-2 gap-x-2", className)}>
      <PaginationButton onClick={handlePrevPage}>
        <MdChevronLeft className="w-5 h-5 mt-[2px]" />
        <span className="text-sm ml-1">prev</span>
      </PaginationButton>

      {createPages().map((page) => (
        <PaginationButton
          key={page}
          onClick={() => onPageChange?.(page)}
          className={cn({
            "bg-gray-200 hover:bg-gray-200": page === currentPage,
          })}
        >
          {page}
        </PaginationButton>
      ))}

      <PaginationButton onClick={handleNextPage}>
        <span className="text-sm mr-1">next</span>
        <MdChevronRight className="w-5 h-5 mt-[2px]" />
      </PaginationButton>
    </div>
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PaginationButton = ({
  children,
  className,
  onClick,
}: PaginationButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-x-1 p-2 hover:bg-gray-100 cursor-pointer rounded-md min-w-10 min-h-10 hover:transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Pagination;
