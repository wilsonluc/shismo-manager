import React, { useState, useRef, useEffect } from "react";
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
import { getSkillIconPath } from "./skill";

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
  characterName: string | undefined;
}

const QueueContainer: React.FC<QueueContainerProps> = ({ tasks, setTasks, characterName }) => {
  const [colDefs] = useState<ColDef<Task>[]>([
    {
      field: "skill",
      cellRenderer: (params: { data: { skillName: string } }) => {
        const iconPath =
          params.data ? getSkillIconPath(params.data.skillName) : "";
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

  const [gridKey, setGridKey] = useState(0);
  useEffect(() => {
    setGridKey(prevKey => prevKey + 1); // Force re-render by changing key
  }, [tasks]);

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
              key={gridKey}
              rowModelType="clientSide"
              columnDefs={colDefs}
              overlayNoRowsTemplate={(characterName === undefined) ? "Please select a character first" : "Task queue is empty"}
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
