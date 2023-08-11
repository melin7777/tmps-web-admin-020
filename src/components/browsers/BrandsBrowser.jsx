import { Cancel, Done, Search } from "@mui/icons-material";
import { DialogActions, DialogContent, TextField, InputAdornment, CircularProgress, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const BrandsBrowser = ({setOpen, value, setValue}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(value);
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
        temp.push({id: val.id, description: val.description});
      });
    }
    else{
      items.map(val=>{
        if((""+val.id).indexOf(searchText)>-1 || 
          (val.description.toLowerCase()).indexOf(searchText.toLowerCase())>-1){
          temp.push({id: val.id, description: val.description});
        }
      });
    }
    setViewItems(temp);
  }, [searchText]);

  async function getData(){
    setIsLoading(true);
    try{
      var error = false;
      if(!error){
        const response = await axios.post("/api/brands/get-active", {});
        const values = [];
        response.data.data.rows.map(val => {
          values.push({
            id: val.id,
            description: val.description,
          });
        });
        setItems(values);
        setViewItems(values);
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
        <span className="text-violet-600 font-medium text-lg">Select Brand</span>
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
            <>
              {selectedItem?.id===val.id?
                <span key={val.id} onClick={()=>setSelectedItem(val)} className="text-violet-800 bg-violet-100 text-sm py-2 pl-3 w-full cursor-pointer" style={{borderBottom: '1px solid #c4b5fd'}}>{val.description}</span>
              :
                <span key={val.id} onClick={()=>setSelectedItem(val)} className="text-gray-500 text-sm py-2 w-full cursor-pointer" style={{borderBottom: '1px solid #d1d5db'}}>{val.description}</span>
              }
            </>
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

export default BrandsBrowser;