// UserContext.js

// Import necessary dependencies and modules
import React, { useContext, useState, useEffect, ReactNode } from "react";
import firebase from "firebase/compat/app"; // Firebase compatibility module
import "firebase/auth"; // Firebase authentication module
import { auth } from "./firebase"; // Firebase authentication object
import { useRouter } from "next/navigation"; // Next.js routing
import { TreeListColumnProps } from "@progress/kendo-react-treelist"; // Kendo UI TreeList components
import { FilterDescriptor, SortDescriptor } from "@progress/kendo-data-query"; // Kendo UI data query components

// Create a React context for managing user data
export const UserContext = React.createContext<AppUserContext | null>(null);

// Define the structure of the user context
export interface AppUserContext {
  user: firebase.User | null;
}

// UserProvider component responsible for managing user authentication state
export function UserProvider({ children }: { children: ReactNode }) {
  // State to hold user information
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter(); // Next.js router

  useEffect(() => {
    // Listen for changes in user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // User is signed out, redirect to login page
        router.push("./login");
        setUser(null);
      }
    });

    // Unsubscribe from the authentication state changes when the component unmounts
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return null;
  }

  // Provide the user context and its data to child components
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

// Custom hook to access user information from the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    return null;
  }
  return context.user;
}

// Constants used for dataset item management
export const childrenItemsField: string = "childrenItems";
export const latLongField: string = "latLongField";
export const expandField: string = "expanded";

// Define the structure of a dataset item
export interface DatasetItem {
  firebaseId?: string | null;
  id: number;
  name: string;
  parentId?: null | number;
  childrenItems: DatasetItem[] | null;
  model?: string | null;
  description?: string | null;
  make?: string | null;
  year: number;
  city?: string | null;
  country?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  isNew: boolean;
}

// Define data state and grid state interfaces
export interface GridState {
  dataState: DataState;
  expanded: number[];
}

export interface DataState {
  sort?: SortDescriptor[] | undefined;
  filter?: FilterDescriptor[] | undefined;
}

// Props for a command cell component
export interface CommandCellProps {
  columnProps: TreeListColumnProps;
  onClick: (dataItemToSave: DatasetItem) => void;
}

// Props for a form component
export interface FormComponentProps {
  addRecord: (dataItemToSave: DatasetItem) => Promise<void>;
  onCancelSaveItem: () => void;
  editingItem: DatasetItem | null;
  assetsList: DatasetItem[];
}

// Props for a map component
export interface MapComponentProps {
  renderedData: DatasetItem[];
}
export const renderedColumns: TreeListColumnProps[] = [
  {
    field: "id",
    title: "ID",
    width: "250px",
    expandable: true,
    resizable: false,
    reorderable: false,
    locked: true,
  },
  {
    field: "name",
    title: "Name*",
    resizable: true,
    minResizableWidth: 100,
    width: "280px",
    //  editCell: TreeListTextEditor,
  },
  {
    field: "model",
    title: "Model",
    resizable: true,
    minResizableWidth: 100,
    width: "260px",
    // editCell: TreeListTextEditor,
  },
  {
    field: "make",
    title: "Make",
    resizable: true,
    minResizableWidth: 100,
    width: "260px",
    // editCell: TreeListTextEditor,
  },
  {
    field: "description",
    title: "Description",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    // editCell: TreeListTextEditor,
  },
  {
    field: "year",
    title: "Year",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    //editCell: TreeListTextEditor,
  },
  {
    field: "city",
    title: "City",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    //editCell: TreeListTextEditor,
  },
  {
    field: "country",
    title: "Country",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    //editCell: TreeListTextEditor,
  },
  {
    field: "longitude",
    title: "Longitude",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    //editCell: TreeListNumericEditor,
  },
  {
    field: "latitude",
    title: "Latitude",
    resizable: true,
    minResizableWidth: 100,
    width: "170px",
    //editCell: TreeListNumericEditor,
  },
];
