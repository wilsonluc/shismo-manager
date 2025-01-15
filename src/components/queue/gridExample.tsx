import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Task } from "./queue";
import Image from "next/image";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";

import {
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  RowDragEvent,
  RowDropZoneParams,
} from "ag-grid-community";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  DragAndDropModule,
  ValidationModule,
  RowDragModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  DragAndDropModule,
  ValidationModule,
  RowDragModule,
]);

interface GridExampleProps {
  tasks: Task[];
}

const GridExample: React.FC<GridExampleProps> = ({ tasks }) => {
  const [colDefs] = useState<ColDef<Task>[]>([
    {
      field: "skill",
      cellRenderer: (params: { data: { skill: { iconPath: string } } }) => {
        const iconPath =
          params.data && params.data.skill ? params.data.skill.iconPath : "";
        return iconPath ? (
          <Image
            src={iconPath}
            alt="Skill Icon"
            width={30}
            height={30}
            objectFit="cover"
          />
        ) : null;
      },
      rowDrag: true,
      maxWidth: 100,
      headerName: "Skill",
      sortable: false,
      lockPosition: true,
    },
    {
      field: "duration",
      valueGetter: (params) => {
        if (params.data) {
          if (params.data.level) {
            return "Lv. " + params.data.level;
          } else if (params.data.duration) {
            return params.data.duration + " mins";
          }
        }
        return "";
      },
      maxWidth: 180,
      headerName: "Level/Duration (mins)",
      sortable: false,
      lockPosition: true,
    },
    {
      field: "pluginName",
      maxWidth: 150,
      headerName: "Plugin Name",
      sortable: false,
      lockPosition: true,
    },
  ]);

  const trashAreaRef = useRef<HTMLDivElement | null>(null);
  const [rowData, setRowData] = useState(tasks);

  return (
    <div>
      <Dropdown
        title="Queue"
        icon={<ChevronIcon isOpen={false} />}
        content={
          <div>
            {/* Trash area */}
            <div
              ref={trashAreaRef}
              style={{
                minHeight: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                marginTop: "10px",
                color: "black",
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <span>Drag here to remove task</span>
            </div>

            {/* Queue area */}
            <AgGridReact
              rowModelType="clientSide"
              columnDefs={colDefs}
              rowData={rowData}
              animateRows={true} // Animate rows when reordered
              domLayout="autoHeight"
              rowDragManaged={true} // Allow row dragging
              onGridReady={(params: GridReadyEvent) => {
                const gridApi = params.api;

                // Add drop zone logic
                const dropZone: RowDropZoneParams = {
                  getContainer: () => {
                    if (trashAreaRef.current) {
                      return trashAreaRef.current;
                    }
                    throw new Error("Trash area container is not available");
                  },
                  onDragStop: (dragEvent: RowDragEvent) => {
                    console.log("Dragged Row Data: ", dragEvent.node.data);

                    // If a drop happened on the trash area, remove the row from the grid
                    setRowData((prevData) =>
                      prevData.filter((task) => task !== dragEvent.node.data)
                    );
                  },
                };

                gridApi.addRowDropZone(dropZone);
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default GridExample;
