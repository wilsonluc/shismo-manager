import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Task } from "./queue";
import Image from "next/image";
import Dropdown from "../dropdown/dropdown";
import ChevronIcon from "../dropdown/chevronIcon";

import { ModuleRegistry, ColDef } from "ag-grid-community";
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

  return (
    <div>
      <Dropdown
        title="Queue"
        icon={<ChevronIcon isOpen={false} />}
        content={
          <div>
            {/*Trash area*/}
            <div
              style={{
                minHeight: "150px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                padding: "10px",
                marginTop: "10px",
                color: "black"
              }}
              onDragOver={(e) => e.preventDefault()} // Allow drop by preventing default action
            >
              <span>Drag here to remove task</span>
            </div>

            {/*Queue area*/}
            <AgGridReact
              rowModelType="clientSide"
              columnDefs={colDefs}
              rowData={tasks}
              animateRows={true} // Animate rows when reordered
              domLayout="autoHeight"
              rowDragManaged={true} // Allow row dragging
            />
          </div>
        }
      />
    </div>
  );
};

export default GridExample;
