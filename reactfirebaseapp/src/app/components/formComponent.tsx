import { Toolbar, Button } from "@progress/kendo-react-buttons";
import {
  ComboBox,
  ComboBoxChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { TextBoxChangeEvent, TextBox } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { saveIcon, cancelIcon } from "@progress/kendo-svg-icons";
import React from "react";
import { FormComponentProps, DatasetItem } from "../services/context";
import styles from "./../css/page.module.css";

// FormComponent is a React component for editing dataset items
export const FormComponent = (props: FormComponentProps) => {
  // State variable for the item being edited
  const [editingItem, setEditingItem] = React.useState<DatasetItem | null>(
    props.editingItem
  );

  // Event handler for input changes
  const onChangeInput = React.useCallback(
    (event: TextBoxChangeEvent) => {
      var item = editingItem;
      if (item === null) {
        item = { id: 0, name: "", year: 0, childrenItems: [], isNew: true };
      }
      (item as any)[event.target.element?.name || ""] = event.value;
      setEditingItem({
        ...(item as DatasetItem),
      });
    },
    [editingItem]
  );

  // Event handler for selecting the parent asset
  const onChangeParent = React.useCallback(
    (event: ComboBoxChangeEvent) => {
      var item = editingItem;
      if (item === null) {
        item = { id: 0, name: "", year: 0, childrenItems: [], isNew: true };
      }
      (item as DatasetItem).parentId = event.value?.id;
      setEditingItem({
        ...(item as DatasetItem),
      });
    },
    [editingItem]
  );

  // Event handler for adding a new record
  const addRecord = React.useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      // Validate input fields
      if (!editingItem || !editingItem.name || !editingItem.year) {
        alert("Please enter all required information.");
        return;
      }

      // Call the parent component's addRecord function
      if (editingItem) {
        props.addRecord(editingItem);
      }
    },
    [editingItem, props]
  );

  // Event handler for canceling the edit
  const onCancelSaveItem = React.useCallback(() => {
    props.onCancelSaveItem();
  }, [props]);

  return (
    <form>
      <div className={styles.Toolbar} style={{ marginBottom: "10px" }}>
        <Toolbar className={styles.toolbar}>
          {/* Button for saving the asset */}
          <Button
            className="k-toolbar-button"
            svgIcon={saveIcon}
            size={"small"}
            title="Save"
            type="button"
            disabled={!editingItem || !editingItem.name || !editingItem.year}
            onClick={addRecord}
          >
            Save Asset
          </Button>
          {/* Button for canceling the edit */}
          <Button
            className="k-toolbar-button"
            svgIcon={cancelIcon}
            title="Cancel"
            size={"small"}
            togglable={true}
            onClick={onCancelSaveItem}
          >
            Cancel
          </Button>
        </Toolbar>
      </div>

      {/* Input fields for asset information */}
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Name*</Label>
        <TextBox
          type="text"
          name="name"
          value={editingItem?.name || ""}
          aria-placeholder="Name"
          required
          placeholder="Name"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Make</Label>
        <TextBox
          type="text"
          aria-placeholder="Make"
          value={editingItem?.make || ""}
          name="make"
          placeholder="Make"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Model</Label>
        <TextBox
          type="text"
          name="model"
          value={editingItem?.model || ""}
          aria-placeholder="Model"
          placeholder="Model"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Desciption</Label>
        <TextBox
          type="text"
          aria-placeholder="Desciption"
          value={editingItem?.description || ""}
          name="description"
          placeholder="Description"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Year*</Label>
        <TextBox
          type="Number"
          required
          value={editingItem?.year || ""}
          aria-placeholder="Year"
          name="year"
          placeholder="Year"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>City</Label>
        <TextBox
          type="text"
          aria-placeholder="City"
          value={editingItem?.city || ""}
          name="city"
          placeholder="City"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Country</Label>
        <TextBox
          type="text"
          aria-placeholder="Country"
          name="country"
          value={editingItem?.country || ""}
          placeholder="Country"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Longitude</Label>
        <TextBox
          type="number"
          aria-placeholder="Longitude"
          name="longitude"
          value={editingItem?.longitude || 0}
          placeholder="Longitude"
          onChange={onChangeInput}
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Latitude</Label>
        <TextBox
          type="number"
          aria-placeholder="Latitude"
          value={editingItem?.latitude || 0}
          name="latitude"
          onChange={onChangeInput}
          placeholder="Latitude"
        ></TextBox>
      </div>
      <div className={styles.formInputDiv}>
        <Label className={styles.labelItem}>Parent Asset</Label>

        <ComboBox
          data={props.assetsList}
          onChange={onChangeParent}
          dataItemKey="id"
          value={
            props.assetsList.filter((e) => e.id == editingItem?.parentId)[0]
          }
          textField="name"
        ></ComboBox>
      </div>
    </form>
  );
};
