'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress, MenuItem, InputAdornment, IconButton, Typography, Button, TextField, Dialog } from '@mui/material';
import { Add, ArrowDropDown, ClearAll, Close, Edit, FilterAlt, ImportExport, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowUp, Search } from '@mui/icons-material';
import useWindowDimensions from '@/hooks/useWindowDimension';
import SupportMenu from '@/components/headers/SupportMenu';
import CategoriesBrowser from '@/components/browsers/CategoriesBrowser';

const SubCategoriesSearch = () => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [selectedRow, setSelectedRow] = useState(0);
  const [filtersShowing, setFiltersShowing] = useState(false);
  const [searchDescription, setSearchDescription] = useState("");
  const [searchStatus, setSearchStatus] = useState("active");
  const [searchSortBy, setSearchSortBy] = useState("id");
  const [searchOrder, setSearchOrder] = useState("ASC");

  const [searchCategory, setSearchCategory] = useState({id: 0, description: "All"});
  const [openCategory, setOpenCategory] = useState(false);

  const [searchRpp, setSearchRpp] = useState(30);
  const [searchRowCount, setSearchRowCount] = useState(0);
  const [searchNop, setSearchNop] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    setIsSaving(false);
    setIsLoading(false);(async () => {
      try {
        const search_data = localStorage.getItem('admin_sub_categories_search_data');
        if(search_data!==null){
          setSearchData(JSON.parse(search_data));
        }
        const search_nop = localStorage.getItem('admin_sub_categories_search_nop');
        if(search_nop!==null) {
          setSearchNop(JSON.parse(search_nop));
        }
        const search_page = localStorage.getItem('admin_sub_categories_search_page');
        if(search_page!==null) {
          setSearchPage(JSON.parse(search_page));
        }
        const sort_by = localStorage.getItem('admin_sub_categories_search_sort_by');
        if(sort_by!==null) {
          setSearchSortBy(JSON.parse(sort_by));
        }
        const order = localStorage.getItem('admin_sub_categories_search_order');
        if(order!==null) {
          setSearchOrder(JSON.parse(order));
        }
        const search_description = localStorage.getItem('admin_sub_categories_search_description');
        if(search_description!==null) {
          setSearchDescription(search_description);
        }
        const search_status = localStorage.getItem('admin_sub_categories_search_status');
        if(search_status!==null) {
          setSearchStatus(JSON.parse(search_status));
        }
        const search_category = localStorage.getItem('admin_sub_categories_search_category');
        if(search_category!==null) {
          setSearchCategory(JSON.parse(search_category));
        }
        const search_rpp = localStorage.getItem('admin_sub_categories_search_rpp');
        if(search_rpp!==null) {
          setSearchRpp(JSON.parse(search_rpp));
        }
        const search_controls_showing = localStorage.getItem('admin_sub_categories_search_filters_showing');
        if(search_controls_showing!==null) {
          setFiltersShowing(JSON.parse(search_controls_showing));
        }
        else{
          setFiltersShowing(false);
        }
        const search_selected_row = localStorage.getItem('admin_sub_categories_search_selected_row');
        if(search_selected_row && search_selected_row!==null) {
          setSelectedRow(JSON.parse(search_selected_row));
        }
        else{
          setSelectedRow(0);
        }
      } 
      catch(e) {
        console.log("get storage error - "+e);
      }
    })();
  }, []);
  
  useEffect(() => {
    const change = () => {
      if(filtersShowing!==null){
        try {
          localStorage.setItem("admin_sub_categories_search_filters_showing", JSON.stringify(filtersShowing));
        } 
        catch (e) {}
      }
    }
    change();
  }, [filtersShowing]);
  
  useEffect(() => {
    const change = () => {
      if(selectedRow!==null){
        try {
          localStorage.setItem("admin_sub_categories_search_selected_row", JSON.stringify(selectedRow));
        } 
        catch (e) {}
      }      
    }
    change();
  }, [selectedRow]);
  
  const clearFields = () => {
    setSearchDescription("");
    setSearchStatus("all");
    setSearchCategory({id: 0, description: "All"});
  }

  async function getSearchData(page){
    if(page>=1 && page<=searchNop){
      setIsLoading(true);
      setServerError(false);
      try{
        var error = false;
        var search_data = {};
        if (searchCategory.id !== 0) {
          search_data["categoryId"] = (searchCategory.id);
        }
        if (searchDescription.length>0) {
          search_data["description"] = searchDescription;
        }
        if (searchStatus !== "0") {
          search_data["status"] = searchStatus;
        }
        search_data["sortBy"] = searchSortBy;
        search_data["order"] = searchOrder;
        if(!error){
          const response = await axios.post("/api/sub-categories/search", {
            search_data: search_data,
            rpp: parseInt(searchRpp),
            page: page,
          });
          var index = 1;
          const values = [];
          response.data.data.data.map(val => {
            var status = "";
            if(val.status==="active"){
              status = "Active";
            }
            else if(val.status==="inactive"){
              status = "Inactive";
            }
            const temp = {
              index: index++,
              categoryId: val.category_id,
              categoryDescription: val.category.description,
              categoryCode: val.category.code,
              id: val.id,
              code: val.code,
              description: val.description,
              status: status,
            };
            values.push(temp);
          });
          setSearchData(values);
          setSearchRowCount(response.data.data.row_count);
          setSearchNop(response.data.data.nop);
          setSearchPage(page);
  
          try {
            localStorage.setItem('admin_sub_categories_search_data', JSON.stringify(values));
            localStorage.setItem('admin_sub_categories_search_rpp', JSON.stringify(searchRpp));
            localStorage.setItem('admin_sub_categories_search_nop', JSON.stringify(response.data.data.nop));
            localStorage.setItem('admin_sub_categories_search_page', JSON.stringify(page));
            localStorage.setItem('admin_sub_categories_search_sort_by', JSON.stringify(searchSortBy));
            localStorage.setItem('admin_sub_categories_search_order', JSON.stringify(searchOrder));
  
            localStorage.setItem('admin_sub_categories_search_description', searchDescription);
            localStorage.setItem('admin_sub_categories_search_status', JSON.stringify(searchStatus));
            localStorage.setItem('admin_sub_categories_search_category', JSON.stringify(searchCategory));
          } 
          catch (e) {
            console.log("put storage error");
          }
        }
      }
      catch(error){
        toast.error("Sub Categories Search Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsLoading(false);
      }
    }
  }

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <SupportMenu selected_root='sub-categories'/>
        <div className='header_container'>
          <div className='header_container_left'>
            <span></span>
            <div className='header_container_left_text'>
              <span className="form_header">Sub Categories</span>
              <span className="form_sub_header">Add or remove sub categories</span>
            </div>
          </div>
          <div className='header_container_right'>
            <Button 
              variant='contained' 
              disabled={isSaving} 
              style={{textTransform: 'none'}} 
              startIcon={isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
              href={'/sub-categories/create-item'}
              target='_blank'
              size='small'
            >New Item</Button>
            <Button 
              variant='outlined' 
              style={{textTransform: 'none'}} 
              startIcon={<FilterAlt />}
              endIcon={filtersShowing?<KeyboardArrowUp/>:<KeyboardArrowDown/>}
              onClick={()=>setFiltersShowing((val)=>!val)}
              size='small'
            >Filters</Button>
          </div>
        </div>
        {filtersShowing && 
          <div className='form_fields_container_fixed'>
            <div className='form_fields_container_search'>
              <div className='form_row_double'>
                <div className='form_field_container'>
                  <TextField 
                    id='description'
                    label="Search" 
                    variant="outlined" 
                    className='form_text_field' 
                    value={searchDescription} 
                    onChange={event=>setSearchDescription(event.target.value)}                     
                    disabled={isLoading} 
                    size='small' 
                    inputProps={{style: {fontSize: 13}}}
                    SelectProps={{style: {fontSize: 13}}}
                    InputLabelProps={{style: {fontSize: 15}}}
                  />
                </div>
                <div className='form_field_container'>
                  <TextField className='form_text_field'
                    id='status'
                    value={searchStatus}
                    label="Status"
                    onChange={event=>setSearchStatus(event.target.value)} 
                    variant={"outlined"}
                    select={true}
                    disabled={isLoading}
                    size='small'
                    inputProps={{style: {fontSize: 13}}}
                    SelectProps={{style: {fontSize: 13}}}
                    InputLabelProps={{style: {fontSize: 15}}}
                  >
                    <MenuItem value={"all"}>All</MenuItem>
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                  </TextField>
                </div>
              </div>
              <div className='form_row_double'>
                <div className='form_field_container'>
                  <div className='form_text_field_constructed'>
                    <span className='form_text_field_constructed_label'>Category</span>
                    <span className='form_text_field_constructed_text' onClick={()=>setOpenCategory(true)}>{searchCategory.description}</span>
                    <div className='form_text_field_constructed_actions'>
                      <Close sx={{width: 20, height: 20, color: '#6b7280'}} onClick={()=>setSearchCategory({id: 0, description: "All"})}/>
                      <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenCategory(true)}/>
                    </div>
                  </div>
                </div>
                <div className='form_field_container gap-2'>
                  <Button 
                    variant='contained' 
                    disabled={isLoading} 
                    style={{textTransform: 'none'}} 
                    startIcon={isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Search />}
                    onClick={()=>getSearchData(1)}
                    size='small'
                  >Search</Button>
                  <Button 
                    variant='outlined' 
                    disabled={isLoading} 
                    style={{textTransform: 'none'}} 
                    startIcon={isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<ClearAll />}
                    onClick={()=>clearFields()}
                    size='small'
                  >Clear</Button>
                </div>
              </div>
            </div>
          </div>
        }
        <div className='form_fields_toolbar_container'>
          <div className='form_fields_toolbar_container_left'>
            <TextField
              className='form_text_field_small'
              id='sort-by-2'
              select={true}
              value={searchSortBy}
              onChange={event=>setSearchSortBy(event.target.value)} 
              disabled={isLoading}
              label='Sort By'
              size='small'
              inputProps={{style: {fontSize: 13}}}
              SelectProps={{style: {fontSize: 13}}}
              InputLabelProps={{style: {fontSize: 15}}}
            >
              <MenuItem value={"id"}>ID</MenuItem>
              <MenuItem value={"code"}>Code</MenuItem>
              <MenuItem value={"description"}>Description</MenuItem>
              <MenuItem value={"status"}>Status</MenuItem>
            </TextField>
            <TextField
              className='form_text_field_small'
              id='order'
              select={true}
              value={searchOrder}
              onChange={event=>setSearchOrder(event.target.value)} 
              disabled={isLoading}
              label='Order'
              size='small'
              InputProps={{
                startAdornment: <InputAdornment position="start"><ImportExport sx={{width: 20, height: 20, color: '#666'}}/></InputAdornment>,
              }}
              inputProps={{style: {fontSize: 13}}}
              SelectProps={{style: {fontSize: 13}}}
              InputLabelProps={{style: {fontSize: 15}}}
            >
              <MenuItem value={"ASC"}>Ascending</MenuItem>
              <MenuItem value={"DESC"}>Descending</MenuItem>
            </TextField>
          </div>
          <div className='form_fields_toolbar_container_right'>
            <TextField
              className='form_text_field_xtra_xtra_small'
              id='rpp'
              select={true}
              value={searchRpp}
              onChange={event=>setSearchRpp(event.target.value)} 
              disabled={isLoading}
              label='Rows'
              size='small'
              inputProps={{style: {fontSize: 13}}}
              SelectProps={{style: {fontSize: 13}}}
              InputLabelProps={{style: {fontSize: 15}}}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </TextField>
            {searchRpp!==0 &&
              <>
                <IconButton aria-label="delete" size="small" onClick={()=>getSearchData(searchPage-1)}>
                  <KeyboardArrowLeft size={20} />
                </IconButton>
                <Typography sx={{fontSize: 12, color: "#444"}}>{`Page ${searchPage} of ${searchNop}`}</Typography>
                <IconButton aria-label="delete" size="small" onClick={()=>getSearchData(searchPage+1)}>
                  <KeyboardArrowRight size={20} />
                </IconButton>
              </>
            }
            {!filtersShowing && 
              <Button 
                variant='contained' 
                disabled={isLoading} 
                style={{textTransform: 'none'}} 
                startIcon={isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Search />}
                onClick={()=>getSearchData(1)}
                size='small'
              >Search</Button>
            }
          </div>
        </div>
        <div className='table_container'>
          <div className='table_header_container'>
            <div className='table_header_col flex-1'>Details</div>
            <div className='table_header_col_2 w-[80px]'>Edit</div>
          </div>
          <div className='table_body_container'>
            {searchData.map(val=>
              <div key={val.id} className='table_row'>
                <div className='table_col_start_center sm:h-[120px]'>
                  <div className='table_field_double'>
                    <div className='table_field'>
                      <span className='table_field_label'>ID:</span>
                      <span className='table_field_text_center'>{val.id}</span>
                    </div>
                    <div className='table_field'>
                    <span className='table_field_label'>Code:</span>
                      <span className='table_field_text_center'>{val.code}</span>
                    </div>
                  </div>
                  <div className='table_field_single'>
                    <div className='table_field_full'>
                      <span className='table_field_label'>Category:</span>
                      <span className='table_field_text_full h-[30px]'>{val.categoryDescription}</span>
                    </div>
                  </div>
                  <div className='table_field_single'>
                    <div className='table_field_full'>
                      <span className='table_field_label'>Description:</span>
                      <span className='table_field_text_full h-[30px]'>{val.description}</span>
                    </div>
                  </div>
                  <div className='table_field_double sm:form_field_single'>
                    <div className='table_field_full'></div>
                    <div className='flex sm:hidden'>
                      <Button 
                        variant='outlined' 
                        style={{textTransform: 'none'}} 
                        startIcon={<Edit />}
                        href={'/sub-categories/'+encodeURIComponent(val.id)}
                        target='_blank'
                        size='small'
                      >Edit</Button>
                    </div>
                  </div>
                </div>
                <div className='table_col_2_end_end w-[80px] h-[120px]'>
                  <Button 
                    variant='outlined' 
                    style={{textTransform: 'none'}} 
                    startIcon={<Edit />}
                    href={'/sub-categories/'+encodeURIComponent(val.id)}
                    target='_blank'
                    size='small'
                  >Edit</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={openCategory} onClose={()=>setOpenCategory(false)} scroll='paper'>
        <CategoriesBrowser {...{setOpen: setOpenCategory, value: searchCategory, setValue: setSearchCategory}}/>
      </Dialog>
      <ToastContainer />
    </div>
  )
}

export default SubCategoriesSearch;