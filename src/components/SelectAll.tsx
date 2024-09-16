import { useState } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
interface AllProps {
  selectAll: boolean;
  onSelectAllChange: (e: CheckboxChangeEvent) => void;

  onManualSelectRows: (rows: number) => void;
}
export default function SelectAll({
  selectAll,
  onSelectAllChange,
  onManualSelectRows,
}: AllProps) {
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectRows, setSelectRows] = useState<number>(0);

  const toggleOptions = () => {
    setShowDropDown((prev) => !prev); // Toggle dropdown visibility
  };
  const handleSubmit = () => {
    if (selectRows > 0 && selectRows<1000 ) {
      onManualSelectRows(selectRows);
    } else {
      alert("Number should be Greater than 0 and less than 1000");
    }
    setSelectRows(0);
    toggleOptions();
  };

  return (
    <>
      <div className="flex gap-[2px] justify-center items-center relative">
        <Checkbox checked={selectAll} onChange={onSelectAllChange} />
        <div onClick={toggleOptions}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="20px"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
          </svg>
        </div>
        {/* custom selectisons */}
        {showDropDown && (
          <form
            className="absolute top-6 left-6 w-52 h-32 bg-white border border-black rounded-lg px-2"
            onSubmit={handleSubmit}
          >
            <input
              type="number"
              name="select"
              id="select"
              value={selectRows == 0 ? "" : selectRows}
              className="w-full border border-gray-300 rounded-md p-1 mt-3"
              placeholder="Select Rows ..."
              onChange={(e) => setSelectRows(Number(e.target.value))}
            />
            <button
              type="submit"
              className="w-[50%]  rounded-lg py-2 float-right border border-black mt-3 "
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
}
