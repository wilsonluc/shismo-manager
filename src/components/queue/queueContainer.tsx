import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import Image from "next/image";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";

import { colorSchemeDarkBlue, themeQuartz } from "ag-grid-community";

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
import { Task } from "../../app/page";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  DragAndDropModule,
  ValidationModule,
  RowDragModule,
]);

interface QueueContainerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const QueueContainer: React.FC<QueueContainerProps> = ({ tasks, setTasks }) => {
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
          />
        ) : null;
      },
      valueFormatter: "",
      rowDrag: true,
      flex: 0.5,
      headerName: "Skill",
      sortable: false,
      lockPosition: true,
      resizable: false,
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
      flex: 0.5,
      headerName: "Level / \nDuration",
      sortable: false,
      lockPosition: true,
      resizable: false,
    },
    {
      field: "pluginName",
      flex: 1,
      headerName: "Plugin Name",
      sortable: false,
      lockPosition: true,
      resizable: false,
    },
  ]);

  const trashAreaRef = useRef<HTMLDivElement | null>(null);
  // const [rowData, setRowData] = useState(tasks);
  const rowDragText = () => {
    return "";  // Return an empty string to disable the row drag text
  };

  return (
    <div>
      <Dropdown
        title="Queue"
        defaultOpen={true}
        icon={<ChevronIcon isOpen={false} />}
        content={
          <div>
            {/* Remove area */}
            <div
              ref={trashAreaRef}
              className="inline-block p-2 mb-2 border border-neutral-500 rounded h-10 text-white bg-dullred select-none"
              onDragOver={(e) => e.preventDefault()}
            >
              Drag here to remove
            </div>

            {/* Queue area */}
            <AgGridReact
              rowModelType="clientSide"
              columnDefs={colDefs}
              overlayNoRowsTemplate={"No tasks in queue"}
              rowData={tasks}
              animateRows={true} // Animate rows when reordered
              domLayout="autoHeight"
              rowDragManaged={true} // Allow row dragging
              rowDragText={rowDragText}
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
                    setTasks((prevTasks) => {
                      const updatedTasks = prevTasks.filter((task) => task !== dragEvent.node.data);
                      tasks = updatedTasks;
                      return updatedTasks;
                    });

                    // tasks.forEach((task) => console.log(task.pluginName));
                  },
                };

                gridApi.addRowDropZone(dropZone);
              }}

              theme={themeQuartz.withPart(colorSchemeDarkBlue)}
            />
          </div>
        }
      />
    </div>
  );
};

export default QueueContainer;
