import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import Spinner from "./components/Spinner"; // Custom spinner component
import SelectAll from "./components/SelectAll";
const API_URL = import.meta.env.VITE_REACT_APP_API;
interface DataRow {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}
type SelectedRows = {
  [key: number]: boolean;
};
const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const rowsPerPage = 12;

  // Initialize selected rows by fetching from localStorage
  const getSelectedRowsFromStorage = (): Record<number, boolean> => {
    const storedSelections = localStorage.getItem("selectedRows");
    return storedSelections ? JSON.parse(storedSelections) : {};
  };

  const [selectedRowsMap, setSelectedRowsMap] = useState<SelectedRows>(
    getSelectedRowsFromStorage
  );
  const [selectAll, setSelectAll] = useState<boolean>(false); // State for "Select All" checkbox

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}${page}`
      );
      const result = await response.json();
      const extractedData = result.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      setData(extractedData);
      setTotalRecords(result.pagination.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (e: { page: number }) => {
    console.log(e);

    setPage(e.page + 1);
    setSelectAll(false); // Reset "Select All" checkbox when page changes
  };

  // Check if a row is selected by looking it up in selectedRowsMap
  const isRowSelected = (row: DataRow) => {
    return selectedRowsMap[row.id] || false;
  };

  // Handle checkbox change event
  const onCheckboxChange = (e: CheckboxChangeEvent, rowData: DataRow) => {
    const newSelectedRows = { ...selectedRowsMap };

    if (e.checked) {
      newSelectedRows[rowData.id] = true;
    } else {
      delete newSelectedRows[rowData.id];
    }

    setSelectedRowsMap(newSelectedRows);
    localStorage.setItem("selectedRows", JSON.stringify(newSelectedRows)); // Save to localStorage
  };

  // Handle "Select All" checkbox change
  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.checked!;
    const newSelectedRows = { ...selectedRowsMap };

    if (checked) {
      // Select all rows on the current page
      data.forEach((row) => {
        newSelectedRows[row.id] = true;
      });
    } else {
      // Deselect all rows on the current page
      data.forEach((row) => {
        delete newSelectedRows[row.id];
      });
    }

    setSelectedRowsMap(newSelectedRows);
    localStorage.setItem("selectedRows", JSON.stringify(newSelectedRows)); // Save to localStorage
    setSelectAll(checked!); // Update "Select All" state
  };
  const onManualSelectRows = async (selectedRowIds: number) => {
    const newSelectedRowsMap = { ...selectedRowsMap };

    if (selectedRowIds > 0 && selectedRowIds <= 12) {
      for (let i = 1; i <= selectedRowIds; i++) {
        newSelectedRowsMap[data[i - 1].id] = true;
      }
    } else {
      setLoading(true);
      const pagesToLoad = Math.ceil(selectedRowIds / rowsPerPage);
      //    const remainingRowsToLoad=selectedRowIds%rowsPerPage;
      const pageData = [...data];
      try {
        for (let i = 1; i < pagesToLoad; i++) {
          const response = await fetch(
            `${API_URL}${page + i}`
          );
          const result = await response.json();
          const extractedData = result.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
          }));
          pageData.push(...extractedData);
        }
        for (let i = 1; i <= selectedRowIds; i++) {
          newSelectedRowsMap[pageData[i - 1].id] = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    setSelectedRowsMap(newSelectedRowsMap);
    localStorage.setItem("selectedRows", JSON.stringify(newSelectedRowsMap)); // Save to localStorage
  };
  const renderCheckbox = (rowData: DataRow) => {
    return (
      <Checkbox
        checked={isRowSelected(rowData)}
        onChange={(e) => onCheckboxChange(e, rowData)}
      />
    );
  };

  return (
    <div className="flex flex-col w-full border-y ">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="min-w-fit mx-auto  p-6 overflow-scroll">
            <h1 className="w-full text-center my-3 text-4xl font-bold">Paginated Data Table</h1>
            <DataTable value={data} paginator={false} className="border-y">
              <Column
                className="border-y"
                header={
                  <SelectAll
                    selectAll={selectAll}
                    onSelectAllChange={onSelectAllChange}
                    onManualSelectRows={onManualSelectRows}
                  />
                 
                }
                body={renderCheckbox}
                headerStyle={{ width: "4em" }}
                exportable={false}
                
              />
              <Column field="title" header="Title" className="border-y" style={{width:'20%'}}/>
              <Column
                field="place_of_origin"
                header="Place of Origin"
                style={{width:'20%'}}
                className="border-y "
              />
              <Column
                field="artist_display"
                header="Artist"
                className="border-y w-fit"
                style={{width:'20%'}}
              />
              <Column
                field="inscriptions"
                header="Inscriptions"
                className="border-y"
                style={{width:'20%'}}
              />
              <Column
                field="date_start"
                header="Start Date"
                className="border-y"
                style={{width:'20%'}}
              />
              <Column field="date_end" header="End Date" className="border-y" style={{width:'20%'}}/>
            </DataTable>
            <Paginator
              first={(page - 1) * rowsPerPage}
              rows={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
              className=" flex gap-3 my-3"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
