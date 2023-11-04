"use client";
import React, { useEffect } from "react";
import styles from "./../css/page.module.css";
import "@progress/kendo-theme-material/dist/all.css";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  CommandCellProps,
  DatasetItem,
  GridState,
  UserProvider,
  childrenItemsField,
  expandField,
  useUser,
} from "../services/context";
import { database, databseCollectionName } from "../services/firebase";

import { Toolbar, Button } from "@progress/kendo-react-buttons";
import {
  arrowRotateCwSmallIcon,
  editToolsIcon,
  logoutIcon,
  mapMarkerIcon,
  plusIcon,
} from "@progress/kendo-svg-icons";

import { FormComponent } from "../components/formComponent";
import {
  TreeList,
  mapTree,
  extendDataItem,
  TreeListExpandChangeEvent,
  TreeListColumnProps,
  TreeListItemChangeEvent,
  createDataTree,
} from "@progress/kendo-react-treelist";
import { Label } from "@progress/kendo-react-labels";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { MapComponent } from "../components/mapComponent";
import { TextBox, TextBoxChangeEvent } from "@progress/kendo-react-inputs";
import { filterBy } from "@progress/kendo-data-query";

const renderedColumns: TreeListColumnProps[] = [
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

const AssetManagement = () => {
  return (
    <UserProvider>
      <AssetContainer></AssetContainer>
    </UserProvider>
  );
};

const CommandCell = (props: CommandCellProps) => {
  function itemClicked(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    props.onClick((props.columnProps as any).dataItem);
  }

  return (
    <td>
      <Button
        size={"small"}
        onClick={itemClicked}
        title={"Edit"}
        svgIcon={editToolsIcon}
      ></Button>
    </td>
  );
};
export default AssetManagement;
var allData = [];

const AssetContainer = () => {
  const user = useUser();
  const router = useRouter();
  const gridComponentReference = React.useRef(null);
  const [state, setState] = React.useState<GridState>({
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
  });
  const [renderedGridData, setRenderedGridData] = React.useState<DatasetItem[]>(
    []
  );
  const [viewInGrid, setViewInGrid] = React.useState<boolean>(true);

  const [searchValue, setSearchValue] = React.useState<string>("");

  const [inEditMode, setInEditMode] = React.useState<boolean>(false);
  const [editingItem, setEditingItem] = React.useState<DatasetItem | null>(
    null
  );

  const onExpandChange = React.useCallback(
    (e: TreeListExpandChangeEvent) => {
      var expanded = e.value
        ? state.expanded.filter((id) => id !== e.dataItem.id)
        : [...state.expanded, e.dataItem.id];
      setState({
        ...state,
        expanded: expanded,
      });
    },
    [state]
  );

  const refreshData = React.useCallback(async () => {
    database
      .collection(databseCollectionName)
      .get()
      .then((querySnapshot) => {
        const dataArray = querySnapshot.docs.map((doc) => {
          var dataItem = doc.data() as DatasetItem;
          dataItem.isNew = false;
          dataItem.firebaseId = doc.id;
          return dataItem;
        });
        allData = dataArray;
        setRenderedGridData(dataArray);
      })
      .catch((error) => {
        debugger;
      });
  }, []);

  useEffect(() => {
    // This is an example query to fetch data from a "myCollection" collection in Firestore
    const fetchData = async () => {
      try {
        await refreshData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshData]);

  const addRecord = React.useCallback(() => {
    const newRecord: DatasetItem = {
      id: renderedGridData.length + 1,
      childrenItems: [],
      isNew: true,
      name: "",
      year: new Date().getFullYear(),
    };
    setEditingItem(newRecord);
    setInEditMode(true);
  }, [renderedGridData.length]);
  const windowHeight = window.innerHeight - 75;

  const onItemChange = (event: TreeListItemChangeEvent) => {
    const field: any = event.field;
    setRenderedGridData(
      mapTree(renderedGridData, childrenItemsField, (item: { id: any }) =>
        item.id === event.dataItem.id
          ? extendDataItem(item, childrenItemsField, {
              [field]: event.value,
            })
          : item
      )
    );
  };

  const onSaveItem = async (dataItemToSave: DatasetItem) => {
    try {
      // Reference to the Firestore collection where you want to add data
      const {
        id,
        name,
        parentId,
        model,
        description,
        make,
        year,
        city,
        country,
        longitude,
        latitude,
        isNew,
      } = dataItemToSave;
      var dataToSave: any = {
        id,
        name,
        parentId,
        model,
        description,
        make,
        year,
        city,
        country,
        longitude,
        latitude,
      };
      if (!dataToSave.parentId) {
        dataToSave.parentId = -1;
      }
      Object.keys(dataToSave).forEach(
        (key) => dataToSave[key] === undefined && delete dataToSave[key]
      );
      // Create a new document with data
      try {
        dataToSave.id = renderedGridData.length + 1;
        const collectionRef = database.collection(databseCollectionName);
        if (isNew || !dataItemToSave.firebaseId) {
          collectionRef
            .add(dataToSave)
            .then((res) => {
              setInEditMode(false);
              setEditingItem(null);
            })
            .catch((err) => {
              console.log(err);
              debugger;
            });
        } else {
          collectionRef
            .doc(dataItemToSave.firebaseId || "")
            .update(dataToSave)
            .then((res) => {
              setInEditMode(false);
              setEditingItem(null);
            })
            .catch((err) => {
              console.log(err);
              debugger;
            });
        }
        await refreshData();
      } catch (error) {
        console.log(error);
        debugger;
      }
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Oops we run into an error saving the record!");
    }
  };
  const onCancelSaveItem = () => {
    setInEditMode(false);
    setEditingItem(null);
  };

  function editItem(dataItemToSave: DatasetItem): void {
    setEditingItem(dataItemToSave);
    setInEditMode(true);
  }
  var columnsToRender = renderedColumns;
  if (editingItem === null) {
    columnsToRender = [
      ...renderedColumns,
      {
        cell: (props: TreeListColumnProps) => {
          return (
            <CommandCell onClick={editItem} columnProps={props}></CommandCell>
          );
        },
        width: "100px",
      },
    ];
  }

  const logout = React.useCallback(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("./login");
      })
      .catch((error) => {
        router.push("./login");
      });
  }, [router]);
  const toggleMap = React.useCallback(
    (event: any) => {
      setViewInGrid(!viewInGrid);
    },
    [viewInGrid]
  );
  console.log("Aefaef");
  const searchValueChanged = React.useCallback((event: TextBoxChangeEvent) => {
    setSearchValue((event.value || "") + "");
  }, []);

  const getRenderingData = React.useCallback(() => {
    var copy = renderedGridData.slice();
    var filteredData = filterBy(copy, {
      logic: "or",
      filters: [
        {
          field: "name",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "make",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "model",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "year",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "description",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "city",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
        {
          field: "country",
          operator: "contains",
          value: searchValue,
          ignoreCase: true,
        },
      ],
    });
    return createDataTree(
      mapTree(filteredData, childrenItemsField, (item: { id: number }) =>
        extendDataItem(item, childrenItemsField, {
          [expandField]: state.expanded.includes(item.id),
        })
      ),
      (i: DatasetItem) => i.id,
      (p: DatasetItem) => p.parentId,
      childrenItemsField
    );
  }, [renderedGridData, searchValue, state.expanded]);
  return (
    <React.StrictMode>
      <ErrorBoundary
        errorComponent={(props) => {
          console.log(props);
          return <div>Something went wrong</div>;
        }}
      >
        <div className={styles.ContentContainer}>
          <div className={styles.Content}>
            <div className={styles.Toolbar}>
              <Toolbar className={styles.toolbar}>
                <Button
                  className="k-toolbar-button"
                  svgIcon={plusIcon}
                  size={"small"}
                  title="Bold"
                  disabled={editingItem !== null}
                  onClick={addRecord}
                >
                  Add Asset
                </Button>
                <Button
                  className="k-toolbar-button"
                  svgIcon={arrowRotateCwSmallIcon}
                  title="Italic"
                  size={"small"}
                  togglable={true}
                  onClick={() => {
                    location.reload();
                  }}
                >
                  Refresh
                </Button>
                <TextBox
                  placeholder="Search..."
                  size={"small"}
                  value={searchValue}
                  onChange={searchValueChanged}
                ></TextBox>
                <Button
                  className="k-toolbar-button"
                  svgIcon={viewInGrid ? mapMarkerIcon : mapMarkerIcon}
                  title="Italic"
                  size={"small"}
                  togglable={true}
                  onClick={toggleMap}
                >
                  {viewInGrid ? "Show In Map" : "View In Grid"}
                </Button>
                <Button
                  className="k-toolbar-button"
                  svgIcon={logoutIcon}
                  title="Italic"
                  size={"small"}
                  togglable={true}
                  onClick={logout}
                >
                  Logout
                </Button>

                <Label>{user?.displayName || user?.email}</Label>
              </Toolbar>
            </div>
            <div className={styles.gridContent}>
              {(viewInGrid && (
                <TreeList
                  style={{
                    maxHeight: windowHeight + "px",
                    overflow: "auto",
                    height: "100%",
                  }}
                  onItemChange={onItemChange}
                  ref={gridComponentReference}
                  data={getRenderingData()}
                  dataItemKey={"guid"}
                  expandField={expandField}
                  subItemsField={childrenItemsField}
                  resizable
                  sortable
                  selectable={{ enabled: true, mode: "multiple", cell: true }}
                  onExpandChange={onExpandChange}
                  columns={columnsToRender}
                />
              )) || (
                <MapComponent renderedData={getRenderingData()}></MapComponent>
              )}
            </div>
          </div>

          {inEditMode && (
            <div
              className={styles.Content}
              style={{
                boxShadow: "-10px 0px 20px #7d7d7d",
                zIndex: 1,
              }}
            >
              <div className={styles.formContent}>
                <FormComponent
                  addRecord={onSaveItem}
                  onCancelSaveItem={onCancelSaveItem}
                  editingItem={editingItem}
                  assetsList={renderedGridData}
                ></FormComponent>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </React.StrictMode>
  );
};
