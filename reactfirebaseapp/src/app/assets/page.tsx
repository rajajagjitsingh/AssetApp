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
  renderedColumns,
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
  // Get the user data using a custom hook (assuming `useUser` is a custom hook)
  const user = useUser();

  // Get the router object (assuming `useRouter` is from a routing library)
  const router = useRouter();

  // Create a reference to a Grid component (uninitialized)
  const gridComponentReference = React.useRef(null);

  // Initialize the 'state' object with initial values for data, sorting, and filtering
  const [state, setState] = React.useState<GridState>({
    dataState: {
      sort: [], // Initial sorting configuration
      filter: [], // Initial filtering configuration
    },
    expanded: [], // Array to track expanded items (e.g., in a TreeList)
  });

  // Initialize a state variable for the data that will be rendered in the grid
  const [renderedGridData, setRenderedGridData] = React.useState<DatasetItem[]>(
    []
  );

  // Initialize a state variable to control the view mode in the grid (boolean)
  const [viewInGrid, setViewInGrid] = React.useState<boolean>(true);

  // Initialize a state variable for a search input value (string)
  const [searchValue, setSearchValue] = React.useState<string>("");

  // Initialize a state variable to track whether the component is in edit mode (boolean)
  const [inEditMode, setInEditMode] = React.useState<boolean>(false);

  // Initialize a state variable for the item being edited (DatasetItem or null)
  const [editingItem, setEditingItem] = React.useState<DatasetItem | null>(
    null
  );

  const onExpandChange = React.useCallback(
    (e: TreeListExpandChangeEvent) => {
      // Determine whether the tree node is being expanded or collapsed
      var expanded = e.value
        ? state.expanded.filter((id) => id !== e.dataItem.id) // Remove the ID from the expanded state
        : [...state.expanded, e.dataItem.id]; // Add the ID to the expanded state

      // Update the component's state with the new expanded state
      setState({
        ...state,
        expanded: expanded,
      });
    },
    [state] // This callback function depends on the 'state' object
  );

  const refreshData = React.useCallback(async () => {
    // Fetch data from a Firestore collection
    database
      .collection(databseCollectionName)
      .get()
      .then((querySnapshot) => {
        // Transform the query snapshot into an array of DatasetItem objects
        const dataArray = querySnapshot.docs.map((doc) => {
          // Cast the document data to the DatasetItem type
          var dataItem = doc.data() as DatasetItem;
          // Set the isNew property to false and assign the firebaseId
          dataItem.isNew = false;
          dataItem.firebaseId = doc.id;
          return dataItem;
        });

        // Update the allData variable with the new data array
        allData = dataArray;
        // Update the component's state with the new data for rendering
        setRenderedGridData(dataArray);
      })
      .catch((error) => {
        // Handle any errors with debugging or error-specific logic
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

  // Define a function to add a new record to the grid
  const addRecord = React.useCallback(() => {
    // Create a new DatasetItem with default values
    const newRecord: DatasetItem = {
      id: renderedGridData.length + 1, // Assign a unique ID
      childrenItems: [], // Initialize children items array
      isNew: true, // Mark it as a new record
      name: "", // Initialize name with an empty string
      year: new Date().getFullYear(), // Set the year to the current year
    };

    // Set the new record as the item being edited and enter edit mode
    setEditingItem(newRecord);
    setInEditMode(true);
  }, [renderedGridData.length]); // Dependency array based on renderedGridData length

  // Calculate the height of the window minus 75 pixels and store it in the 'windowHeight' variable
  const windowHeight = window.innerHeight - 75;

  // Define a function to handle changes to an item in the TreeList
  const onItemChange = (event: TreeListItemChangeEvent) => {
    const field: any = event.field;

    // Update the renderedGridData with the changed item
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

  // Function to save or update a DatasetItem in Firestore
  const onSaveItem = async (dataItemToSave: DatasetItem) => {
    try {
      // Extract relevant properties from dataItemToSave
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

      // Prepare data to be saved in Firestore
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

      // Set a default parentId value if it's not defined
      if (!dataToSave.parentId) {
        dataToSave.parentId = -1;
      }

      // Remove properties with undefined values
      Object.keys(dataToSave).forEach(
        (key) => dataToSave[key] === undefined && delete dataToSave[key]
      );

      // Reference to the Firestore collection
      const collectionRef = database.collection(databseCollectionName);

      if (isNew || !dataItemToSave.firebaseId) {
        // Add a new document with data
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
        // Update an existing document with data
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

      // Refresh the data after saving or updating
      await refreshData();
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Oops, we ran into an error while saving the record!");
    }
  };

  // Function to cancel the item save operation
  const onCancelSaveItem = () => {
    setInEditMode(false);
    setEditingItem(null);
  };

  // Function to enter edit mode for a specific DatasetItem
  function editItem(dataItemToSave: DatasetItem): void {
    setEditingItem(dataItemToSave);
    setInEditMode(true);
  }

  // Determine which columns to render based on whether an item is being edited
  var columnsToRender = renderedColumns;
  if (editingItem === null) {
    columnsToRender = [
      ...renderedColumns,
      {
        cell: (props: TreeListColumnProps) => {
          return (
            // Render an edit command cell
            <CommandCell onClick={editItem} columnProps={props}></CommandCell>
          );
        },
        width: "100px",
      },
    ];
  }

  // Function to log the user out and navigate to the login page
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

  // Function to toggle between grid and map view
  const toggleMap = React.useCallback(
    (event: any) => {
      setViewInGrid(!viewInGrid);
    },
    [viewInGrid]
  );

  // Function to handle changes in the search input value
  const searchValueChanged = React.useCallback((event: TextBoxChangeEvent) => {
    setSearchValue((event.value || "") + "");
  }, []);

  // Function to filter and create a data tree for rendering
  const getRenderingData = React.useCallback(() => {
    var copy = renderedGridData.slice();
    var filteredData = filterBy(copy, {
      logic: "or",
      filters: [
        // Define filters for various fields in the data
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
        // Add more filters for other fields as needed
      ],
    });

    // Create a data tree for rendering
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
                {/* Button to add a new asset */}
                <Button
                  className="k-toolbar-button"
                  svgIcon={plusIcon}
                  size={"small"}
                  title="Add Asset"
                  disabled={editingItem !== null}
                  onClick={addRecord}
                >
                  Add Asset
                </Button>

                {/* Button to refresh the page */}
                <Button
                  className="k-toolbar-button"
                  svgIcon={arrowRotateCwSmallIcon}
                  title="Refresh"
                  size={"small"}
                  togglable={true}
                  onClick={() => {
                    location.reload();
                  }}
                >
                  Refresh
                </Button>

                {/* Search input box */}
                <TextBox
                  placeholder="Search..."
                  size={"small"}
                  value={searchValue}
                  onChange={searchValueChanged}
                ></TextBox>

                {/* Button to toggle between grid and map view */}
                <Button
                  className="k-toolbar-button"
                  svgIcon={viewInGrid ? mapMarkerIcon : mapMarkerIcon}
                  title="Toggle View"
                  size={"small"}
                  togglable={true}
                  onClick={toggleMap}
                >
                  {viewInGrid ? "Show In Map" : "View In Grid"}
                </Button>

                {/* Button to log out */}
                <Button
                  className="k-toolbar-button"
                  svgIcon={logoutIcon}
                  title="Log Out"
                  size={"small"}
                  togglable={true}
                  onClick={logout}
                >
                  Logout
                </Button>

                {/* Display user's name or email */}
                <Label>{user?.displayName || user?.email}</Label>
              </Toolbar>
            </div>

            <div className={styles.gridContent}>
              {/* Conditionally render a TreeList or MapComponent based on the 'viewInGrid' state */}
              {viewInGrid ? (
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
              ) : (
                <MapComponent renderedData={getRenderingData()}></MapComponent>
              )}
            </div>
          </div>

          {/* Display a form for editing when in edit mode */}
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
