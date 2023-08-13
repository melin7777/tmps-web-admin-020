import { CameraAlt, Cancel, Done, Search } from "@mui/icons-material";
import { DialogActions, DialogContent, TextField, InputAdornment, CircularProgress, Button, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const SellersBrowser = ({setOpen, value, setValue}) => {
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
        temp.push(val);
      });
    }
    else{
      items.map(val=>{
        if((""+val.id).indexOf(searchText)>-1 || 
          (val.first_name.toLowerCase()).indexOf(searchText.toLowerCase())>-1 ||
          (val.last_name.toLowerCase()).indexOf(searchText.toLowerCase())>-1 ||
          (val.email.toLowerCase()).indexOf(searchText.toLowerCase())>-1){
          temp.push(val);
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
        const response = await axios.post("/api/sellers/active", {});
        const values = [];
        response.data.data.rows.map(val => {
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "https://tm-web.techmax.lk/"+val.image_url;
          }
          values.push({
            id: val.id,
            first_name: val.first_name,
            last_name: val.last_name,
            description: val.first_name+" "+val.last_name,
            email: val.email,
            image_url: imageUrl,
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
        <span className="text-zinc-800 font-medium text-lg">Select Seller</span>
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
                <span className='text-sm'>{val.first_name+" "+val.last_name}</span>
                <span className='text-xs font-semibold'>{val.email}</span>
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

export default SellersBrowser;