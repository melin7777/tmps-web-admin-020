import { CameraAlt, Cancel, Done, Search } from "@mui/icons-material";
import { DialogActions, DialogContent, TextField, InputAdornment, CircularProgress, Button, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const SubCategoriesBrowser = ({setOpen, value, setValue, dependedValue, setDependedValue}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(value);
  const [selectedDependedItem, setSelectedDependedItem] = useState(dependedValue);
  const [items, setItems] = useState([]);
  const [viewItems, setViewItems] = useState([]);

  useEffect(() => {
    setIsLoading(false);
    getData();
  }, []);

  useEffect(() => {
    let temp = [];
    if(searchText.length===0){
      items.map(val=>{
        if(selectedDependedItem.id>0){
          if(selectedDependedItem.id===val.categoryId){
            temp.push({id: val.id, description: val.description, categoryId: val.categoryId, categoryDescription: val.categoryDescription});
          }
        }
        else{
          temp.push({id: val.id, description: val.description, categoryId: val.categoryId, categoryDescription: val.categoryDescription});
        }
      });
    }
    else{
      items.map(val=>{
        if((""+val.id).indexOf(searchText)>-1 || 
          (val.description.toLowerCase()).indexOf(searchText.toLowerCase())>-1){
          if(selectedDependedItem.id>0){
            if(selectedDependedItem.id===val.categoryId){
              temp.push({id: val.id, description: val.description, categoryId: val.categoryId, categoryDescription: val.categoryDescription});
            }
          }
          else{
            temp.push({id: val.id, description: val.description, categoryId: val.categoryId, categoryDescription: val.categoryDescription});
          }
        }
      });
    }
    setViewItems(temp);
  }, [searchText, items, selectedDependedItem]);

  async function getData(){
    setIsLoading(true);
    try{
      var error = false;
      if(!error){
        const response = await axios.post("/api/sub-categories/active", {});
        const values = [];
        response.data.data.rows.map(val => {
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = " http://localhost:8000/"+val.image_url;
          }
          values.push({
            id: val.id,
            description: val.description,
            categoryId: val.category_id,
            categoryDescription: val.category.description,
            image_url: imageUrl,
          });
        });
        setItems(values);
      }
    }
    catch(error){
      setItems([]);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center px-5 py-2">
        <div className="flex flex-col">
          <span className="text-zinc-800 font-medium text-lg">Select Sub Category</span>          
          {selectedDependedItem.id>0 &&
            <div className="flex flex-row justify-between items-center gap-2 bg-zinc-800 rounded-xl px-3 py-1">
              <span className="flex flex-row text-white text-xs">{selectedDependedItem.description}</span>
              <Cancel sx={{width: 18, height: 18, color: '#fff', cursor: 'pointer'}} onClick={()=>setSelectedDependedItem({id: 0, description: "All"})}/>
            </div>
          }
        </div>
        <TextField
          className='form_text_field_small'
          id='search-text'
          value={searchText}
          onChange={event=>setSearchText(event.target.value)} 
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{width: 20, height: 20, color: '#666'}}/></InputAdornment>,
          }}
        />
      </div>
      {isLoading ?
        <DialogContent dividers sx={{background: '#fff', display: 'flex', flex: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 600, width: 'auto', minWidth: {sm: 500}}}>
          <CircularProgress />
        </DialogContent>
      :
        <DialogContent dividers sx={{background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', position: 'relative', height: 600, width: 'auto', minWidth: {sm: 500}}}>
          {viewItems.map(val=>
            <div key={val.id} onClick={()=>setSelectedItem(val)} className='flex flex-row w-full justify-between items-center px-1 cursor-pointer' style={{borderBottom: '1px solid #e0e0e0', backgroundColor: selectedItem?.id===val.id?"#e7e5e4":"#ffffff"}}>
              <div className='flex flex-col justify-center items-center'>
                {val.image_url==="none" ? 
                  <CameraAlt sx={{width: 30, height: 30, color: '#cbd5e1'}}/> : 
                  <Avatar src={val.image_url} sx={{width: 30, height: 30}}/>
                }
              </div>
              <div className='flex flex-col flex-1 justify-center items-start h-[60px] pl-3'>
                <span className='text-sm'>{val.description}</span>
              </div>
            </div>
          )}
        </DialogContent>
      }
      <DialogActions sx={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'end', gap: 1, flexWrap: 'wrap', py: 2, px: 2}}>        
        <Button 
          variant='outlined' 
          style={{textTransform: 'none'}} 
          startIcon={<Cancel />}
          onClick={()=>setOpen(false)}
          size='small'
        >Cancel</Button>
        <Button 
          variant='contained' 
          disabled={isLoading} 
          style={{textTransform: 'none'}} 
          startIcon={isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Done />}
          onClick={()=>{setValue(selectedItem); setOpen(false)}}
          size='small'
        >Select</Button>
      </DialogActions>
    </>
  )
}

export default SubCategoriesBrowser;