// UserContext.js
import React, { useContext, useState, useEffect, ReactNode } from "react";
import firebase from "firebase/compat/app";
import "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";
import {
  TreeListColumnProps,
  TreeListTextEditor,
} from "@progress/kendo-react-treelist";
import { FilterDescriptor, SortDescriptor } from "@progress/kendo-data-query";

export const UserContext = React.createContext<AppUserContext | null>(null);

export interface AppUserContext {
  user: firebase.User | null;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // User is signed out.
        router.push("./login");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return;
  }
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    return null;
  }
  return context.user;
}

export const childrenItemsField: string = "childrenItems";
export const latLongField: string = "latLongField";
export const expandField: string = "expanded";

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

export interface GridState {
  dataState: DataState;
  expanded: number[];
}
export interface DataState {
  sort?: SortDescriptor[] | undefined;
  filter?: FilterDescriptor[] | undefined;
}

export interface CommandCellProps {
  columnProps: TreeListColumnProps;
  onClick: (dataItemToSave: DatasetItem) => void;
  // onCancel: (dataItemToSave: any) => void;
}

export interface FormComponentProps {
  addRecord: (dataItemToSave: DatasetItem) => Promise<void>;
  onCancelSaveItem: () => void;
  editingItem: DatasetItem | null;
  assetsList: DatasetItem[];
}

export interface MapComponentProps {
  renderedData: DatasetItem[];
}
