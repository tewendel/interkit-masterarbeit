<script>

  import { onDestroy } from 'svelte'

  import { InterkitClient } from 'interkit'
  import { docsGo } from '../docs.js'

  import {
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Button,
    CopyButton,
    ButtonSet,
    Toolbar,
    ToolbarContent,
    ToolbarSearch
  } from "carbon-components-svelte"

  import Add from 'carbon-icons-svelte/lib/Add.svelte'
  import Help from 'carbon-icons-svelte/lib/Help.svelte'
  import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte'
  // import Delete from 'carbon-icons-svelte/lib/Delete.svelte'
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte'
  import InputModal from '../InputModals/InputModal.svelte'
  import SheetRenameModal from '../InputModals/SheetRenameModal.svelte'
  import SheetCell from './SheetCell.svelte'

  import { columnTypes } from '../baseConfig.js';

  export let sheetKey;
  export let projectId;
  export let close;

  let headerTypeModal = null; // set to "columnType" when open
  let updateHeader = {} // the value of the column being changed

  let openInputModal = null; // the type of the input modal to open
  let updateRow;  // the row being edited in modal
  let updateCell; // the cell being edited in modal
  let inputModalValue; // value edited in input modal
  let modalParams; // object of optional params passed to input modal

  const sheetRenameModal = {
    open: false,
    value: {},
    start: () => {
      // using `this` in LHS would break reactivity
      sheetRenameModal.value.id = $currentSheet.id
      sheetRenameModal.value.key = $currentSheet.key
      sheetRenameModal.value.newKey = $currentSheet.key
      sheetRenameModal.value.newName = $currentSheet.name
      sheetRenameModal.open = true
    },
    submit: function () {
      if (this.value.newKey === '') {
        window.alert('new key must not be empty')
        return
      }
      const isKeyChange = this.value.newKey !== this.value.key
      InterkitClient.call('sheet.rename', {
        projectId,
        id: $currentSheet.id,
        key: this.value.newKey,
        name: this.value.newName
      })
        .then(changeCount => {
          if (changeCount !== 1) {
            throw new Error('sheet.rename did not return exactly 1 change, instead ' + changeCount)
          }
          if (isKeyChange) sheetKey = this.value.newKey
          sheetRenameModal.open = false
        })
        .catch(err => {
          console.error(err)
          window.alert('sheet rename error')
        })
    }
  }

  let rowsSubHandle;
  let rows;

  let currentSheetSub;
  let currentSheet;

  const setup = async (newKey) => {
    if(newKey) {
      // subscribe to the rows of the current sheet
      if(rowsSubHandle) rowsSubHandle.stop()
      rowsSubHandle = await InterkitClient.getSub('rows', 'rows', {sheetKey, projectId}, (r)=>r.sheetKey == newKey);
      rows = rowsSubHandle.data;

      // subscribe to the current sheet itself
      if(currentSheetSub) currentSheetSub.stop()
      currentSheetSub = await InterkitClient.getSub('sheets', 'sheets', {key: sheetKey, projectId}, (s)=>s.key == sheetKey && s.projectId == projectId, true);
      currentSheet = currentSheetSub.data;
      
      console.log("Sheet: got currentSheet sub", $currentSheet ? $currentSheet : "")
    }
  }

  // initialize the row subscriptions when id prop changes
  $: setup(sheetKey)

  let refSubs = {};
  let refData = {};
  let refDataUnsubscribe = {};
  
  // setup subscriptions for other sheets referenced in columns
  const updateReferenceSubscriptions = async (sheet) => {
    if(sheet?.columns) {
      for(let column of sheet.columns.filter(c=>c.type == "sheetRef")) {
        let refSheetKey = column.reference

        if(refSubs[refSheetKey]) refSubs[refSheetKey].stop()
        refSubs[refSheetKey] = await InterkitClient.getSub('rows', 'rows', {sheetKey: refSheetKey, projectId}, (r)=>r.sheetKey == refSheetKey);
        
        // manually (un)subscribe to the store to update data
        if(refDataUnsubscribe[refSheetKey]) refDataUnsubscribe[refSheetKey]()
        
        refDataUnsubscribe[refSheetKey] = refSubs[refSheetKey].data.subscribe(data => {
          //console.log("ref data Update")
          refData[refSheetKey] = data;
        })
      }
    }
  }

  // watch updates on currentSheet to adjust subscriptions for reference columns
  $: {
    //console.log("currentSheet updated", $currentSheet)
    updateReferenceSubscriptions($currentSheet)
  }

  // some cleanup
  onDestroy(()=>{
    if(currentSheetSub)
      currentSheetSub.stop();

    if(rowsSubHandle) 
      rowsSubHandle.stop()

    for(let sub of Object.values(refSubs)) {
      sub.stop();
    }

    for(let unsub of Object.values(refDataUnsubscribe)) {
      unsub();
    }
  })

  const remove = async () => {
    if(confirm("permanently remove sheet, including all rows and all data within?")) {
      await InterkitClient.call('sheet.remove', {sheetKey, projectId})
      close();
    }
  }

  const createColumn = async ()=> {
    let newCol = await InterkitClient.call('sheet.addColumn', {sheetKey, projectId})
    openUpdateHeaderModal(newCol);
  }

  const createRow = ()=> {
    InterkitClient.call('sheet.addRow', {sheetKey, projectId})
  }

  const removeRow = (row)=> {
    if(confirm("permanently delete row?")) {
      InterkitClient.call('row.delete', {key: row.key, projectId})   
    }
  }
  
  // called when user clicks on a cell in the data table
  const updateValue = (row, cell) => {
    console.log(row)
    let column = headers.find(h => h.key == cell.key)
    let columnName = column?.value
    let columnType = column?.type
    //console.log(columnType)

    if(columnType === "undefined") {
      alert(`Column '${columnName}' has type undefined, please edit (click on column header cell) and set a type.`)
      return
    }

    if(columnType == "string") {
      let newVal = prompt("Update " + columnName, cell.value)
      if(newVal != null) {
        InterkitClient.call('row.updateValue', {rowKey: row.key, colKey: column.key, newVal, projectId})
      }
    }

    if(columnType == "number") {
      let newVal = prompt("Update " + columnName, (cell.value && typeof cell.value == "number") ? cell.value : "")
      console.log("newVal", newVal)
      if(newVal != null) {
        newVal = parseFloat(newVal);
        InterkitClient.call('row.updateValue', {rowKey: row.key, colKey: column.key, newVal, projectId})
      }
    }

    if(["location", "sheetRef", "mediaFile", "optionSelect", "richText", "date"].includes(columnType)) {
      console.log("opening input modal", columnType)
      updateCell = cell;
      updateRow = row;
      inputModalValue = cell.value;
      openInputModal = columnType;
      
      let currentColumn = $currentSheet.columns.find(c=>c.key == updateCell.key)
      modalParams = {
        currentColumn
      }
      if(columnType == "sheetRef") {
        // get key of sheet that is referenced in column
        console.log(currentColumn)
        modalParams.reference = currentColumn.reference
      }
    }
  }

  // submits the value retrieved from the input modal to the database
  const submitValue = (value) => {
    console.log("submitting", value)
    InterkitClient.call('row.updateValue', {
      colKey: updateCell.key, 
      rowKey: updateRow.key, 
      newVal: value,
      projectId
    })
  }

  const openUpdateHeaderModal = (header) => {
    console.log(header)
    headerTypeModal = "columnType";
    updateHeader = header;
  }

  const moveCol = (header, direction) => {
    InterkitClient.call('sheet.moveColumn', {sheetKey, projectId, colKey: header.key, direction}) 
  }

  const deleteCol = (header) => {
    if(confirm("permanently delete column?"))
      InterkitClient.call('sheet.removeColumn', {sheetKey, projectId, colKey: header.key}) 
  }

  const submitHeaderColumnUpdate = () => {
    console.log("submit", updateHeader)
    InterkitClient.call('sheet.updateHeader', {sheetKey, projectId, colKey: updateHeader.key, newVal: updateHeader.value, newType: updateHeader.type, newReference: updateHeader.reference, options: updateHeader.options, newColKey: updateHeader.newColKey})
  }
  
  // transform headers and rows for use with carbon DataTable
  const sortFunction = (a, b) => {
    if (a < b || !a) return -1;
    if (a > b || !b) return 1;
    return 0;
  }

  let headers = []
  $: {
    if($currentSheet) 
      if($currentSheet.columns) 
        headers = $currentSheet.columns.map(c=>{return {
          key: c.key, 
          value: c.name, 
          type: c.type, 
          reference: c.reference,
          options: c.options,
          // allow sorting only on simple types - note that sort cannot be set to true, the component then expects a custom sorting function!
          sort: (c.type == "number" || c.type == "string") ? 
            sortFunction : false
        }}).concat([
        {
          key: "key",
          show: true,
          value: "Key"
        },
        { 
          key: "overflow", 
          sort: false,
          //empty: true 
        }]) // add overflow column
  }
  //$: { console.log("rows update", $rows) }

  $: carbonRows = $rows ? $rows.map(r=>{return {...r.values, key: r.key, id: r._id}}) : []
  //$: { console.log("carbonRows update", carbonRows) }

  let searchQuery;
  const searchFunction = (r, query) => {
    //console.log(r)
    if(!query || query == "") return true;
    else {
      for(const key in r) {
        console.log(r[key])
        if(typeof r[key] == "string") {
          if(r[key].toLowerCase().includes(query.toLowerCase())) 
            return true;
        }
      }
      return false;
    }
  }

  let rowsFiltered = [];
  $: {
    rowsFiltered = carbonRows.filter((r)=>{return searchFunction(r, searchQuery)})
    //console.log(rows, rowsFiltered)
  }


</script>

<div class="main-buttons">
  <ButtonSet>
    <Button
      kind="ghost"
      size="field"
      on:click={close}
      style="margin-right: auto"
      icon={ChevronLeft}
      >
      back
    </Button>
    <Button
      size="field"
      kind="ghost"
      icon={Help}
      on:click={() => docsGo('/basics/interface_overview#data')}
      >
      Help
    </Button>
  </ButtonSet>
</div>

{#if $currentSheet}
  <h4>{$currentSheet.name} 
    <small>key={$currentSheet.key}</small>
  </h4>
  <Button size="small" on:click={() => { sheetRenameModal.start() }}>Rename</Button>
  <Button size="small" on:click={remove} icon={TrashCan}>Remove Sheet</Button>

  <br><br>

  <div class="SheetTableContainer">
    <DataTable
      sortable
      {headers}
      rows={rowsFiltered}
      style="padding-bottom: 48px; overflow-x: auto"
    >

      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch bind:value={searchQuery}/>
        </ToolbarContent>
      </Toolbar>
      
      <span slot="cell-header" let:header>
        {#if header.key == "overflow"}
          <OverflowMenu style="float: right" flipped>
              <OverflowMenuItem on:click={createColumn} text="add column" />    
          </OverflowMenu>   
        {:else}
          <div class="sheet-header" >
            <OverflowMenu size="sm" style="width: 100%; justify-content: flex-start">
              <div slot="menu" style="font-weight:bold;">
                {#if header.value}
                  {header.value}
                {:else}
                  <span style="opacity:0.5">(empty)</span>
                {/if}
              </div>
              {#if header.key != "key"}
                <OverflowMenuItem on:click={()=>{openUpdateHeaderModal(header)}} text="edit" />
                <OverflowMenuItem on:click={()=>{moveCol(header, -1)}} text="move left" />
                <OverflowMenuItem on:click={()=>{moveCol(header, 1)}} text="move right" />
                <OverflowMenuItem on:click={()=>{deleteCol(header)}} text="remove" />
              {/if}
            </OverflowMenu>
          </div>
        {/if}
      </span>
      
      <span slot="cell" let:row let:cell>
        {#if cell.key === 'overflow'}
          <OverflowMenu style="float: right" flipped>
            <!--OverflowMenuItem on:click={()=>{alert(row.key)}} text="show rowKey" /-->
            <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
          </OverflowMenu>
        {:else if cell.key == 'key'}
          <CopyButton style="display: inline;" text={row?.key} feedback="Copied rowKey to clipboard!"/>
          <span class="shorten">{row?.key}</span>
        {:else}
          <span class="sheet-cell" on:click={()=>{updateValue(row, cell)}}>
            <SheetCell {cell} {refData} {projectId}/>
          </span>
        {/if}
      </span>
    
    </DataTable>
  </div>
  <Button size="small" icon={Add} on:click={createRow}>Add Row</Button>
{/if}

<InputModal
  type={headerTypeModal}
  bind:value={updateHeader}
  submit={submitHeaderColumnUpdate}  
  close={()=>{headerTypeModal = null}}
  {projectId}
/>

<InputModal
  type={openInputModal}
  bind:value={inputModalValue}
  submit={()=>submitValue(inputModalValue)}
  close={()=>{openInputModal = null}}
  {projectId}
  params={modalParams}
/>

<SheetRenameModal
  open={sheetRenameModal.open}
  bind:value={sheetRenameModal.value}
  submit={() => sheetRenameModal.submit()}
  close={() => { sheetRenameModal.open = false }}
  />

<style>

  .main-buttons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .sheet-header:hover {
    cursor: pointer;
  }

  .header-type {
    font-weight: normal;
    margin-bottom: 5px;
  }

  .sheet-cell:hover {
    cursor: pointer;
  }

  .sheet-cell {
    display: block;
  }

  .marker-icon {
    height: 30px;
  }

  small {
    font-size: 50%;
    font-family: monospace;
  } 

  .shorten {
    width: 4em;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

</style>
